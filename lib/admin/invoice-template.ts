// PORT of toolbelt/lib/invoice-template.mjs - keep in sync (see ADR 5).
//
// invoice-template.ts - branded efesop A4 invoice HTML (direction B).
//
// Pure function: takes the structured invoice model assembled by
// commands/invoice.mjs (CLI) or buildInvoiceModel (web) and returns a single
// HTML string ready for Playwright's page.setContent + page.pdf({ format: 'A4' }).
//
// Design (efesop.com homage, light mode): solid tan/sand left rail with a
// huge serif "George Efesopoulos." running bottom-up the spine, and the
// payment-by-bank-transfer block pinned at the bottom. White right panel
// with a faint blueprint grid behind the content: Invoice headline + number
// at top, From + Bill to (two columns), line-items table (rolled up to one
// row per day by the caller), totals, then a cursive signature inverted
// in-template from a white-ink PNG.

const BRAND = {
  ink: '#2A241D',        // efesop --text-primary (light theme)
  inkSoft: '#564B3D',    // --text-muted
  inkFaint: '#8A7E6C',   // derived muted-er, for captions
  accent: '#AB7B62',     // --accent-primary (copper)
  line: '#D4C8AE',       // --border-subtle (light theme)
  lineSoft: '#ECE2CC',   // very light rule / zebra
  rail: '#E8E0CA',       // tan/sand left rail (efesop hero cream)
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
  if (identity.tax_residency) lines.push(`Tax residency: ${esc(identity.tax_residency)}`);
  return lines;
}

// One bank row; shows the visible placeholder marker when unfilled.
function bankRow(label: string, value: string | undefined, { placeholder = false }: { placeholder?: boolean } = {}): string {
  const v = placeholder
    ? `<span style="color:${BRAND.accent};font-style:italic">&lt;fill efesop_bank&gt;</span>`
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
  /** White-ink signature PNG as a data URI; inverted to dark in-template. */
  signatureDataUri?: string;
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
  /** TKT-441: synthesized "(no billable work)" placeholder row for a weekday
   *  with no real entries; renders "-" in Rate + Amount cells. */
  zero?: boolean;
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

export function renderInvoiceHtml(inv: InvoiceModel): string {
  const { from, client, meta, items, totals, bank } = inv;

  // TKT-441: zero-day placeholder rows show "-" in the Rate + Amount cells
  // instead of "EUR 0.00", so the row reads as a "no billable work" marker
  // rather than a charge. Hours still print "0".
  const rows = items.map((it, i) => {
    const isZero = it.zero || ((Number(it.hours) || 0) === 0 && (Number(it.amount) || 0) === 0);
    const rateCell = isZero ? '-' : `&euro;${eur(it.rate)}`;
    const amtCell = isZero ? '-' : `&euro;${eur(it.amount)}`;
    return `
          <tr class="${i % 2 ? 'zebra' : ''}${isZero ? ' zero' : ''}">
            <td class="c-date">${esc(it.date)}</td>
            <td class="c-desc">${esc(it.description)}</td>
            <td class="c-num">${hrs(it.hours)}</td>
            <td class="c-num">${rateCell}</td>
            <td class="c-num c-amt">${amtCell}</td>
          </tr>`;
  }).join('');

  // Items-table footer: total hours + total amount across all day-rows.
  const totalHours = items.reduce((s, it) => s + (Number(it.hours) || 0), 0);
  const totalAmount = items.reduce((s, it) => s + (Number(it.amount) || 0), 0);
  const totalsRow = `
          <tr class="totals-row">
            <td class="c-date">Total</td>
            <td class="c-desc"></td>
            <td class="c-num">${hrs(totalHours)}</td>
            <td class="c-num"></td>
            <td class="c-num c-amt">&euro;${eur(totalAmount)}</td>
          </tr>`;

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
    bankRow('Account', bank.account_name, { placeholder: !bankFilled.account_name }),
    bankRow('IBAN', bank.iban, { placeholder: !bankFilled.iban }),
    bankRow('BIC / SWIFT', bank.bic, { placeholder: !bankFilled.bic }),
    bankRow('Bank', bank.bank, { placeholder: !bankFilled.bank }),
    bankRow('Reference', bank.reference || meta.number, { placeholder: false }),
  ].join('');

  // Rail: rotated signature (white-ink PNG inverted in-template); when no
  // signature is available, fall back to the serif wordmark text.
  const railContent = from.signatureDataUri
    ? `<img class="rail-sig" src="${from.signatureDataUri}" alt="${esc(from.name)}">`
    : `<div class="rail-name-area"><div class="rail-name">${esc(from.name)}<span class="dot">.</span></div></div>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap">
<style>
  /* Fraunces (variable serif) for display: Invoice. headline, EFE number,
     and Total due. Body / table / labels stay system sans. The CLI render
     waits for networkidle so the font load resolves; offline -> falls back
     to Georgia silently via the stack below. */
  /* 10mm printable margin all around so a home printer's no-print zone
     doesn't eat the rail, the bank info, or the right edge of the totals. */
  @page { size: A4; margin: 10mm; }
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
  /* A4 minus 10mm margin both sides = 190 x 277mm printable area. */
  .sheet { display: flex; height: 277mm; }

  /* ---- Left rail: plain white. Holds only the rotated signature. */
  .rail {
    flex: 0 0 56mm;
    background: ${BRAND.paper};
    border-right: 1px solid rgba(212, 200, 174, 0.8); /* BRAND.line @ 80% */
    position: relative;
    overflow: hidden;
  }
  /* Rotated signature: anchored at the rail's center, rotated -90deg so the
     cursive reads bottom-up the spine. The source PNG is white ink on a
     transparent background; filter:invert(1) flips it to dark ink, and the
     transparency keeps the tan rail showing through.
     Intrinsic width 200mm with auto height preserves the signature's natural
     aspect (~2048:401), so the rotated extent is ~200mm tall, ~39mm wide -
     fits in the 56mm rail with breathing room. */
  .rail-sig {
    position: absolute;
    top: 50%; left: 50%;
    width: 120mm; height: auto;
    transform: translate(-50%, -50%) rotate(-90deg);
    filter: invert(1);
    opacity: 0.92;
  }
  /* Fallback wordmark (text), shown when no signatureDataUri is supplied. */
  .rail-name-area {
    position: absolute; inset: 14mm 6mm 8mm;
    display: flex; align-items: center; justify-content: center;
  }
  .rail-name {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    white-space: nowrap;
    font-family: "Fraunces", Georgia, "Times New Roman", serif;
    font-size: 58px; font-weight: 600;
    letter-spacing: -0.018em; line-height: 1;
    color: ${BRAND.ink};
  }
  .rail-name .dot { color: ${BRAND.accent}; }

  .eyebrow {
    text-transform: uppercase; letter-spacing: 0.14em; font-size: 8px;
    color: ${BRAND.inkFaint}; font-weight: 700; margin-bottom: 8px;
  }

  /* ---- Right panel: plain white. */
  .body {
    flex: 1; min-width: 0;
    background-color: ${BRAND.paper};
    padding: 10mm 10mm 8mm;
    display: flex; flex-direction: column;
  }
  .invhead { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 22px; }
  .invhead .title {
    font-family: "Fraunces", Georgia, serif; font-size: 44px; font-weight: 600;
    letter-spacing: -0.02em; color: ${BRAND.ink}; line-height: 0.9;
  }
  .invhead .title .dot { color: ${BRAND.accent}; }
  .invhead .meta { text-align: right; font-size: 10px; color: ${BRAND.inkSoft}; line-height: 1.6; }
  .invhead .meta .num {
    font-family: "Fraunces", Georgia, serif; font-size: 15px; font-weight: 600;
    color: ${BRAND.accent}; margin-bottom: 4px; letter-spacing: 0.01em;
  }
  .invhead .meta b { color: ${BRAND.ink}; font-weight: 600; }

  /* From / Bill-to two-column block under the headline */
  .parties { display: flex; gap: 36px; margin-bottom: 18px; }
  .party { flex: 1; min-width: 0; }
  .party .name { font-size: 13px; font-weight: 600; color: ${BRAND.ink}; }
  .party .sub { font-size: 10.5px; color: ${BRAND.inkSoft}; margin-top: 1px; }
  .party .lines { margin-top: 6px; font-size: 10px; color: ${BRAND.inkSoft}; line-height: 1.6; }
  .party .period { font-size: 9.5px; color: ${BRAND.inkSoft}; margin-top: 8px; }

  table.items { width: 100%; border-collapse: collapse; background: ${BRAND.paper}; }
  table.items thead th {
    text-align: left; font-size: 8px; text-transform: uppercase; letter-spacing: 0.11em;
    color: ${BRAND.inkFaint}; font-weight: 700; padding: 0 8px 8px;
    border-bottom: 1.5px solid ${BRAND.accent}; background: ${BRAND.paper};
  }
  table.items tbody td {
    padding: 6px 8px; font-size: 10px; line-height: 1.4; color: ${BRAND.ink}; vertical-align: top;
    border-bottom: 1px solid ${BRAND.line}; background: ${BRAND.paper};
  }
  table.items tbody tr.zebra td { background: rgba(236,226,204,0.22); }
  /* Zero-day placeholders (TKT-441): soften the row to read as a marker,
     not a charge. */
  table.items tbody tr.zero td.c-desc { color: ${BRAND.inkFaint}; font-style: italic; }
  table.items tbody tr.zero td.c-num { color: ${BRAND.inkFaint}; }
  table.items tfoot td {
    padding: 10px 8px; font-size: 11px; font-weight: 600;
    color: ${BRAND.ink}; vertical-align: middle;
    border-top: 1.5px solid ${BRAND.accent}; border-bottom: 0;
    background: ${BRAND.paper};
  }
  table.items tfoot td.c-date {
    text-transform: uppercase; letter-spacing: 0.1em; font-size: 9px;
    color: ${BRAND.inkFaint}; font-weight: 700;
  }
  table.items tfoot td.c-amt { color: ${BRAND.accent}; }
  .c-num { text-align: right; white-space: nowrap; }
  th.c-num { text-align: right; }
  .c-date { white-space: nowrap; width: 84px; color: ${BRAND.inkSoft}; }
  .c-desc { width: auto; }
  .c-amt { font-weight: 600; }

  .totals { display: flex; justify-content: flex-end; margin-top: 10px; }
  table.totals-t { width: 268px; border-collapse: collapse; background: ${BRAND.paper}; }
  table.totals-t td { padding: 5px 8px; font-size: 11px; }
  table.totals-t .t-label { color: ${BRAND.inkSoft}; }
  table.totals-t .t-value { text-align: right; color: ${BRAND.ink}; font-variant-numeric: tabular-nums; }
  table.totals-t tr.grand td {
    border-top: 2px solid ${BRAND.accent}; padding-top: 10px; font-size: 16px; font-weight: 700;
  }
  table.totals-t tr.grand .t-label { color: ${BRAND.ink}; }
  table.totals-t tr.grand .t-value {
    color: ${BRAND.accent};
    font-family: "Fraunces", Georgia, serif;
    font-size: 20px; letter-spacing: -0.01em; font-weight: 500;
  }

  /* Payment block: the due-by sentence, then the bank-transfer details. */
  .payment-section {
    margin-top: 22px; padding-top: 16px;
    border-top: 1px solid ${BRAND.line};
  }
  .payment-due {
    margin: 0 0 12px; font-size: 10px; line-height: 1.55; color: ${BRAND.inkSoft};
  }
  .payment-due b { color: ${BRAND.ink}; font-weight: 600; }
  .bank-block {
    display: inline-block; min-width: 60%;
  }
  /* padding-top/bottom (not shorthand!) so the per-cell horizontal padding
     below isn't reset by specificity. */
  table.bank { border-collapse: collapse; }
  table.bank td { padding-top: 3px; padding-bottom: 3px; font-size: 10px; vertical-align: top; line-height: 1.5; }
  td.bk-label {
    color: ${BRAND.inkSoft}; padding-right: 18px; white-space: nowrap;
    text-transform: uppercase; letter-spacing: 0.08em; font-size: 8.5px; font-weight: 700;
  }
  td.bk-value {
    color: ${BRAND.ink}; font-weight: 600; font-variant-numeric: tabular-nums;
    padding-left: 4px;
  }

  .foot {
    margin-top: auto; padding-top: 10px; border-top: 1px solid ${BRAND.line};
    display: flex; justify-content: space-between; font-size: 8.5px; color: ${BRAND.inkFaint};
  }
</style>
</head>
<body>
  <div class="sheet">

    <aside class="rail">
      ${railContent}
    </aside>

    <main class="body">
      <div class="invhead">
        <div class="title">Invoice<span class="dot">.</span></div>
        <div class="meta">
          <div class="num">${esc(meta.number)}</div>
          <div>Issued: <b>${esc(meta.issueDate)}</b></div>
          <div>Due: <b>${esc(meta.dueDate)}</b></div>
        </div>
      </div>

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
          ${clientAddr ? `<div class="lines">${clientAddr}</div>` : ''}
          <div class="period">Billing period &middot; ${esc(meta.periodLabel)}</div>
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
        <tfoot>${totalsRow}
        </tfoot>
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

      <div class="payment-section">
        <p class="payment-due">Payment due by <b>${esc(meta.dueDate)}</b> via bank transfer.</p>
        <div class="bank-block">
          <div class="eyebrow">Payment &middot; bank transfer</div>
          <table class="bank">${bankRows}</table>
        </div>
      </div>

      <div class="foot">
        <span>${esc(from.name)} &middot; ${esc(from.role)}</span>
        <span>${esc(meta.number)}</span>
      </div>
    </main>

  </div>
</body>
</html>`;
}
