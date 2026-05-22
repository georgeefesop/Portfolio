'use client';

import { useEffect, useState } from 'react';
import {
  Loader2,
  Check,
  Copy,
  MessageCircle,
  Ban,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { GREG } from '@/lib/greg/site';

/* localStorage keys - this tool is single-user, so saved data lives on the
   device. No database needed. */
const LS_CLIENTS = 'greg_invoice_clients';
const LS_SERVICES = 'greg_invoice_services';
const LS_RECENT = 'greg_invoice_recent';

interface SavedClient {
  name: string;
  phone: string;
}
interface RecentInvoice {
  id: string;
  url: string;
  clientName: string;
  clientPhone: string;
  service: string;
  total: number;
  createdAt: string;
  active: boolean;
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/** Digits only, for wa.me links. */
function phoneDigits(input: string): string {
  return input.replace(/\D/g, '');
}

function whatsappShare(inv: {
  clientName: string;
  clientPhone: string;
  service: string;
  total: number;
  url: string;
}): string {
  const msg = `Hello ${inv.clientName}, here is your payment request from ${GREG.shortName} for ${inv.service}: EUR ${inv.total.toFixed(
    2,
  )}. You can pay securely here: ${inv.url} Thank you.`;
  const digits = phoneDigits(inv.clientPhone);
  const base = digits ? `https://wa.me/${digits}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(msg)}`;
}

const field =
  'w-full rounded-lg border border-border-medium bg-bg-tertiary px-3.5 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-accent-primary';
const label = 'mb-1.5 block text-xs font-medium text-text-muted';

export default function InvoiceTool() {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [service, setService] = useState('');
  const [amount, setAmount] = useState('');
  const [vat, setVat] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const [savedClients, setSavedClients] = useState<SavedClient[]>([]);
  const [savedServices, setSavedServices] = useState<string[]>([]);
  const [recent, setRecent] = useState<RecentInvoice[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<RecentInvoice | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSavedClients(load<SavedClient[]>(LS_CLIENTS, []));
    setSavedServices(load<string[]>(LS_SERVICES, []));
    setRecent(load<RecentInvoice[]>(LS_RECENT, []));
  }, []);

  const amountNum = Number(amount);
  const amountValid =
    amount.trim() !== '' &&
    Number.isFinite(amountNum) &&
    amountNum >= 5 &&
    amountNum <= 50_000;
  const total = vat ? amountNum * 1.19 : amountNum;
  const canSubmit =
    clientName.trim() !== '' && service.trim() !== '' && amountValid && !loading;

  function resetForm() {
    setClientName('');
    setClientPhone('');
    setService('');
    setAmount('');
    setVat(false);
    setDueDate('');
    setNote('');
    setShowOptions(false);
    setCreated(null);
    setError(null);
  }

  function fillClient(c: SavedClient) {
    setClientName(c.name);
    setClientPhone(c.phone);
  }

  async function createInvoice() {
    if (!canSubmit) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/greg/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientPhone: clientPhone.trim(),
          service: service.trim(),
          amount: amountNum,
          vat,
          dueDate,
          note: note.trim(),
        }),
      });
      const data = (await res.json()) as {
        id?: string;
        url?: string;
        total?: number;
        error?: string;
      };
      if (!res.ok || !data.url || !data.id) {
        throw new Error(data.error ?? 'Could not create the payment request.');
      }

      const invoice: RecentInvoice = {
        id: data.id,
        url: data.url,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        service: service.trim(),
        total: data.total ?? total,
        createdAt: new Date().toISOString(),
        active: true,
      };
      setCreated(invoice);

      // Persist client, service and recent list on the device.
      const clients = [
        { name: invoice.clientName, phone: invoice.clientPhone },
        ...savedClients.filter(
          (c) => c.name.toLowerCase() !== invoice.clientName.toLowerCase(),
        ),
      ].slice(0, 12);
      const servicesList = [
        invoice.service,
        ...savedServices.filter(
          (s) => s.toLowerCase() !== invoice.service.toLowerCase(),
        ),
      ].slice(0, 12);
      const recentList = [invoice, ...recent].slice(0, 20);
      setSavedClients(clients);
      setSavedServices(servicesList);
      setRecent(recentList);
      save(LS_CLIENTS, clients);
      save(LS_SERVICES, servicesList);
      save(LS_RECENT, recentList);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not create the payment request.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  async function deactivate(id: string) {
    try {
      const res = await fetch('/api/greg/invoice', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) return;
      const updated = recent.map((r) =>
        r.id === id ? { ...r, active: false } : r,
      );
      setRecent(updated);
      save(LS_RECENT, updated);
    } catch {}
  }

  /* ---- Share screen (after a link is created) ---- */
  if (created) {
    return (
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-2xl border border-accent-primary bg-bg-elevated p-6 md:p-7">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent-primary/15 text-accent-primary">
            <Check size={22} aria-hidden />
          </div>
          <h2 className="text-h4 font-bold tracking-tight text-text-primary">
            Payment request ready
          </h2>
          <p className="mt-1.5 text-sm text-text-secondary">
            {created.service} - EUR {created.total.toFixed(2)} for{' '}
            {created.clientName}
          </p>

          <div className="mt-5 flex flex-col gap-2.5">
            <a
              href={whatsappShare(created)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-5 py-3.5 font-semibold text-white transition-transform hover:scale-[1.01]"
            >
              <MessageCircle size={18} aria-hidden />
              Send to client on WhatsApp
            </a>
            <button
              type="button"
              onClick={() => copyLink(created.url)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-medium bg-bg-tertiary px-5 py-3.5 font-semibold text-text-primary transition-colors hover:border-accent-primary/60"
            >
              {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
              {copied ? 'Link copied' : 'Copy payment link'}
            </button>
          </div>

          <p className="mt-3 break-all rounded-lg bg-bg-tertiary px-3 py-2 text-xs text-text-muted">
            {created.url}
          </p>

          <button
            type="button"
            onClick={resetForm}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-primary hover:underline"
          >
            <Plus size={15} aria-hidden />
            Create another
          </button>
        </div>

        <RecentList recent={recent} onDeactivate={deactivate} onCopy={copyLink} />
      </div>
    );
  }

  /* ---- The form ---- */
  return (
    <div className="mx-auto w-full max-w-lg">
      <h1 className="font-serif text-h2 leading-tight tracking-tight text-text-primary">
        Create a payment request
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Fill in the job and the amount. You get a payment link to send straight
        to the client on WhatsApp.
      </p>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border-subtle bg-bg-secondary p-5 md:p-6">
        {/* Saved clients */}
        {savedClients.length > 0 && (
          <div>
            <span className={label}>Recent clients</span>
            <div className="flex flex-wrap gap-2">
              {savedClients.slice(0, 8).map((c) => (
                <button
                  key={`${c.name}-${c.phone}`}
                  type="button"
                  onClick={() => fillClient(c)}
                  className="rounded-full border border-border-medium bg-bg-tertiary px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-accent-primary/60 hover:text-accent-primary"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="inv-client" className={label}>
              Client name
            </label>
            <input
              id="inv-client"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Andreas Georgiou"
              className={field}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="inv-phone" className={label}>
              Client WhatsApp number
            </label>
            <input
              id="inv-phone"
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="+357 99 123456"
              className={field}
            />
          </div>
        </div>

        <div>
          <label htmlFor="inv-service" className={label}>
            What is the work?
          </label>
          <input
            id="inv-service"
            type="text"
            list="inv-service-list"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="e.g. Bathroom renovation - deposit"
            className={field}
          />
          <datalist id="inv-service-list">
            {savedServices.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor="inv-amount" className={label}>
            Amount (EUR){vat ? ' - before VAT' : ''}
          </label>
          <input
            id="inv-amount"
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="500"
            min={5}
            max={50000}
            step="0.01"
            className={`${field} text-lg font-semibold`}
          />
          {vat && amountValid && (
            <p className="mt-1.5 text-xs text-text-muted">
              Client pays EUR {total.toFixed(2)} (includes 19% VAT)
            </p>
          )}
        </div>

        {/* Options */}
        <div>
          <button
            type="button"
            onClick={() => setShowOptions((v) => !v)}
            className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            <ChevronDown
              size={15}
              className={`transition-transform ${showOptions ? 'rotate-180' : ''}`}
              aria-hidden
            />
            More options
          </button>
          {showOptions && (
            <div className="mt-3 flex flex-col gap-3 border-t border-border-subtle pt-3">
              <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={vat}
                  onChange={(e) => setVat(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-accent-primary"
                />
                Add 19% VAT
              </label>
              <div>
                <label htmlFor="inv-due" className={label}>
                  Due date (optional)
                </label>
                <input
                  id="inv-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="inv-note" className={label}>
                  Note (optional)
                </label>
                <input
                  id="inv-note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Anything to record against this payment"
                  className={field}
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={createInvoice}
          disabled={!canSubmit}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta-bg px-5 py-3.5 font-semibold text-cta-fg transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden />
              Creating
            </>
          ) : (
            'Create payment request'
          )}
        </button>

        {error && (
          <p className="text-xs text-accent-coral" role="alert">
            {error}
          </p>
        )}
      </div>

      <RecentList recent={recent} onDeactivate={deactivate} onCopy={copyLink} />
    </div>
  );
}

function RecentList({
  recent,
  onDeactivate,
  onCopy,
}: {
  recent: RecentInvoice[];
  onDeactivate: (id: string) => void;
  onCopy: (url: string) => void;
}) {
  if (recent.length === 0) return null;
  return (
    <div className="mt-8">
      <h3 className="mb-3 text-sm font-semibold text-text-primary">
        Recent payment requests
      </h3>
      <ul className="flex flex-col gap-2">
        {recent.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-bg-secondary px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">
                {r.clientName} - EUR {r.total.toFixed(2)}
              </p>
              <p className="truncate text-xs text-text-muted">
                {r.service}
                {!r.active ? ' - cancelled' : ''}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => onCopy(r.url)}
                aria-label="Copy link"
                className="rounded-md p-2 text-text-muted transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              >
                <Copy size={15} aria-hidden />
              </button>
              {r.active && (
                <button
                  type="button"
                  onClick={() => onDeactivate(r.id)}
                  aria-label="Deactivate link"
                  className="rounded-md p-2 text-text-muted transition-colors hover:bg-bg-tertiary hover:text-accent-coral"
                >
                  <Ban size={15} aria-hidden />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
