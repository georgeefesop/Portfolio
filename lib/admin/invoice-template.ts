// PORT of toolbelt/lib/invoice-template.mjs - keep in sync (see ADR 5).
//
// invoice-template.ts - branded efesop A4 invoice HTML.
//
// Pure function: takes the structured invoice model assembled by
// commands/invoice.mjs and returns a single HTML string ready for
// Playwright's page.setContent + page.pdf({ format: 'A4' }).
//
// Design: printable financial document. White paper, dark ink (#2A241D),
// one copper accent (#AB7B62 - efesop --accent-primary), serif headings
// (Georgia, mirroring the site's Newsreader), system sans body. No webfonts
// so it renders identically offline. Restraint over flourish.

const BRAND = {
  ink: '#2A241D',        // efesop --text-primary (light theme)
  inkSoft: '#564B3D',    // --text-muted
  inkFaint: '#8A7E6C',   // derived muted-er, for captions
  accent: '#AB7B62',     // --accent-primary (copper)
  line: '#D4C8AE',       // --border-subtle (light theme)
  lineSoft: '#ECE2CC',   // very light rule / zebra
  paper: '#FFFFFF',
};

// HTML-escape user-supplied text (Notion descriptions, names, bank fields).
function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// EUR money: thousands separators, always 2dp. e.g. 1402.5 -> "1,402.50".
export function eur(n: number): string {
  const v = Number(n) || 0;
  return v.toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Hours: drop trailing .0 (8.5 -> "8.5", 3 -> "3").
function hrs(n: number): string {
  const v = Number(n) || 0;
  return Number.isInteger(v) ? String(v) : String(v);
}

// Render the from-block (identity) lines. Only fields actually present in
// secrets render; nothing is hardcoded.
function identityLines(identity: InvoiceIdentity): string[] {
  const lines: string[] = [];
  if (identity.tic_number) lines.push(`Tax ID (TIC): ${esc(identity.tic_number)}`);
  if (identity.social_insurance_number) lines.push(`Social Insurance No: ${esc(identity.social_insurance_number)}`);
  if (identity.tax_residency) lines.push(`Tax residency: ${esc(identity.tax_residency)}`);
  return lines;
}

// One bank row; shows the visible placeholder marker when unfilled.
function bankRow(label: string, value: string | undefined, { placeholder = false }: { placeholder?: boolean } = {}): string {
  const v = placeholder
    ? `<span style="color:${BRAND.accent};font-style:italic">&lt;fill efesop_bank in secrets.json&gt;</span>`
    : esc(value);
  return `<tr><td class="bk-label">${esc(label)}</td><td class="bk-value">${v}</td></tr>`;
}

export interface InvoiceIdentity {
  tic_number?: string;
  social_insurance_number?: string;
  tax_residency?: string;
}

export interface InvoiceFrom {
  name: string;
  role: string;
  location?: string;
  identity: InvoiceIdentity;
}

export interface InvoiceClient {
  name: string;
  org?: string;
  addressLines?: string[];
}

export interface InvoiceMeta {
  number: string;
  issueDate: string;
  dueDate: string;
  weekLabel?: string;
  periodLabel: string;
}

export interface InvoiceItem {
  date: string;
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

export interface InvoiceTotals {
  subtotal: number;
  vatRate: number;
  vatLabel: string;
  vatAmount: number;
  total: number;
}

export interface InvoiceBankFilled {
  account_name?: boolean;
  iban?: boolean;
  bic?: boolean;
  bank?: boolean;
}

export interface InvoiceBank {
  account_name?: string;
  iban?: string;
  bic?: string;
  bank?: string;
  reference?: string;
  filled: InvoiceBankFilled;
}

export interface InvoiceModel {
  from: InvoiceFrom;
  client: InvoiceClient;
  meta: InvoiceMeta;
  items: InvoiceItem[];
  totals: InvoiceTotals;
  bank: InvoiceBank;
}

/**
 * @param {object} inv
 * @param {object} inv.from         { name, role, location, identity: {...} }
 * @param {object} inv.client       { name, org, addressLines: [] }
 * @param {object} inv.meta         { number, issueDate, dueDate, weekLabel, periodLabel }
 * @param {Array}  inv.items        [{ date, description, hours, rate, amount }]
 * @param {object} inv.totals       { subtotal, vatRate, vatLabel, vatAmount, total }
 * @param {object} inv.bank         { account_name, iban, bic, bank, reference, filled }
 * @returns {string} full HTML document
 */
export function renderInvoiceHtml(inv: InvoiceModel): string {
  const { from, client, meta, items, totals, bank } = inv;

  const rows = items.map((it, i) => `
        <tr class="${i % 2 ? 'zebra' : ''}">
          <td class="c-date">${esc(it.date)}</td>
          <td class="c-desc">${esc(it.description)}</td>
          <td class="c-num">${hrs(it.hours)}</td>
          <td class="c-num">&euro;${eur(it.rate)}</td>
          <td class="c-num c-amt">&euro;${eur(it.amount)}</td>
        </tr>`).join('');

  const idLines = identityLines(from.identity);
  const clientAddr = (client.addressLines || []).filter(Boolean)
    .map(l => `<div>${esc(l)}</div>`).join('');

  // VAT row: 0% now ("Not VAT registered"), one flag flips it to 19%.
  const vatRow = `
        <tr>
          <td class="t-label">${esc(totals.vatLabel)}</td>
          <td class="t-value">&euro;${eur(totals.vatAmount)}</td>
        </tr>`;

  const bankFilled = bank.filled;
  const bankRows = [
    bankRow('Account name', bank.account_name, { placeholder: !bankFilled.account_name }),
    bankRow('IBAN', bank.iban, { placeholder: !bankFilled.iban }),
    bankRow('BIC / SWIFT', bank.bic, { placeholder: !bankFilled.bic }),
    bankRow('Bank', bank.bank, { placeholder: !bankFilled.bank }),
    bankRow('Reference', bank.reference || meta.number, { placeholder: false }),
  ].join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Inter", -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: ${BRAND.ink};
    background: ${BRAND.paper};
    font-size: 11px;
    line-height: 1.5;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page { padding: 48px 52px 40px; }

  /* Header */
  .head { display: flex; justify-content: space-between; align-items: flex-start; }
  .brand { font-family: Georgia, "Times New Roman", serif; }
  .brand .mark {
    font-size: 26px; font-weight: 600; letter-spacing: -0.01em; color: ${BRAND.ink};
  }
  .brand .mark .dot { color: ${BRAND.accent}; }
  .brand .tagline { font-size: 10px; color: ${BRAND.inkSoft}; margin-top: 3px; }
  .doc-title {
    text-align: right; font-family: Georgia, serif; font-size: 30px; font-weight: 600;
    letter-spacing: 0.04em; color: ${BRAND.accent}; line-height: 1;
  }
  .doc-meta { text-align: right; margin-top: 10px; font-size: 10.5px; color: ${BRAND.inkSoft}; }
  .doc-meta b { color: ${BRAND.ink}; font-weight: 600; }

  .rule { height: 2px; background: ${BRAND.accent}; margin: 18px 0 22px; }

  /* From / Bill-to blocks */
  .parties { display: flex; justify-content: space-between; gap: 40px; margin-bottom: 26px; }
  .party { width: 48%; }
  .party .eyebrow {
    text-transform: uppercase; letter-spacing: 0.12em; font-size: 8.5px;
    color: ${BRAND.inkFaint}; font-weight: 700; margin-bottom: 6px;
  }
  .party .name { font-size: 13px; font-weight: 600; color: ${BRAND.ink}; }
  .party .sub { font-size: 10.5px; color: ${BRAND.inkSoft}; margin-top: 1px; }
  .party .lines { margin-top: 6px; font-size: 10px; color: ${BRAND.inkSoft}; line-height: 1.55; }
  .party .lines div { white-space: nowrap; }

  /* Line-items table */
  table.items { width: 100%; border-collapse: collapse; margin-bottom: 4px; }
  table.items thead th {
    text-align: left; font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.1em;
    color: ${BRAND.inkFaint}; font-weight: 700; padding: 0 8px 7px; border-bottom: 1.5px solid ${BRAND.accent};
  }
  table.items tbody td {
    padding: 8px; font-size: 10.5px; color: ${BRAND.ink}; vertical-align: top;
    border-bottom: 1px solid ${BRAND.line};
  }
  table.items tbody tr.zebra td { background: ${BRAND.lineSoft}; }
  .c-num { text-align: right; white-space: nowrap; }
  th.c-num { text-align: right; }
  .c-date { white-space: nowrap; width: 78px; color: ${BRAND.inkSoft}; }
  .c-desc { width: auto; }
  .c-amt { font-weight: 600; }

  /* Totals */
  .totals { display: flex; justify-content: flex-end; margin-top: 14px; }
  table.totals-t { width: 280px; border-collapse: collapse; }
  table.totals-t td { padding: 5px 8px; font-size: 11px; }
  table.totals-t .t-label { color: ${BRAND.inkSoft}; }
  table.totals-t .t-value { text-align: right; color: ${BRAND.ink}; font-variant-numeric: tabular-nums; }
  table.totals-t tr.grand td {
    border-top: 2px solid ${BRAND.accent}; padding-top: 9px; font-size: 14px; font-weight: 700;
  }
  table.totals-t tr.grand .t-label { color: ${BRAND.ink}; }
  table.totals-t tr.grand .t-value { color: ${BRAND.accent}; }

  /* Bank-transfer block */
  .pay {
    margin-top: 30px; border: 1px solid ${BRAND.line}; border-radius: 8px;
    padding: 16px 18px; background: #FCFAF5;
  }
  .pay .eyebrow {
    text-transform: uppercase; letter-spacing: 0.12em; font-size: 8.5px;
    color: ${BRAND.inkFaint}; font-weight: 700; margin-bottom: 9px;
  }
  table.bank { border-collapse: collapse; }
  table.bank td { padding: 2.5px 0; font-size: 10.5px; vertical-align: top; }
  td.bk-label { color: ${BRAND.inkSoft}; padding-right: 18px; white-space: nowrap; }
  td.bk-value { color: ${BRAND.ink}; font-weight: 600; font-variant-numeric: tabular-nums; }

  .note { margin-top: 14px; font-size: 9.5px; color: ${BRAND.inkFaint}; }

  /* Footer */
  .foot {
    margin-top: 34px; padding-top: 12px; border-top: 1px solid ${BRAND.line};
    display: flex; justify-content: space-between; font-size: 9px; color: ${BRAND.inkFaint};
  }
</style>
</head>
<body>
  <div class="page">
    <div class="head">
      <div class="brand">
        <div class="mark">${esc(from.name)}<span class="dot">.</span></div>
        <div class="tagline">${esc(from.role)}${from.location ? ' &middot; ' + esc(from.location) : ''}</div>
      </div>
      <div>
        <div class="doc-title">INVOICE</div>
        <div class="doc-meta">
          <div><b>${esc(meta.number)}</b></div>
          <div>Issued: ${esc(meta.issueDate)}</div>
          <div>Due: ${esc(meta.dueDate)}</div>
        </div>
      </div>
    </div>

    <div class="rule"></div>

    <div class="parties">
      <div class="party">
        <div class="eyebrow">From</div>
        <div class="name">${esc(from.name)}</div>
        <div class="sub">${esc(from.role)}${from.location ? ', ' + esc(from.location) : ''}</div>
        <div class="lines">${idLines.map(l => `<div>${l}</div>`).join('')}</div>
      </div>
      <div class="party">
        <div class="eyebrow">Bill to</div>
        <div class="name">${esc(client.name)}</div>
        ${client.org ? `<div class="sub">${esc(client.org)}</div>` : ''}
        <div class="lines">${clientAddr}</div>
        <div class="lines" style="margin-top:8px"><div>Billing period: ${esc(meta.periodLabel)}</div></div>
      </div>
    </div>

    <table class="items">
      <thead>
        <tr>
          <th class="c-date">Date</th>
          <th class="c-desc">Description</th>
          <th class="c-num">Hours</th>
          <th class="c-num">Rate</th>
          <th class="c-num">Amount</th>
        </tr>
      </thead>
      <tbody>${rows}
      </tbody>
    </table>

    <div class="totals">
      <table class="totals-t">
        <tr>
          <td class="t-label">Subtotal</td>
          <td class="t-value">&euro;${eur(totals.subtotal)}</td>
        </tr>
        ${vatRow}
        <tr class="grand">
          <td class="t-label">Total due</td>
          <td class="t-value">&euro;${eur(totals.total)}</td>
        </tr>
      </table>
    </div>

    <div class="pay">
      <div class="eyebrow">Payment &middot; bank transfer</div>
      <table class="bank">${bankRows}</table>
    </div>

    <div class="note">Payment due within the stated term by bank transfer. Please quote the invoice number as the payment reference.</div>

    <div class="foot">
      <span>${esc(from.name)} &middot; ${esc(from.role)}</span>
      <span>${esc(meta.number)}</span>
    </div>
  </div>
</body>
</html>`;
}
