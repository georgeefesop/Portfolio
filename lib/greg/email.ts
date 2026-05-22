/**
 * Transactional email for greg.efesop.com - render-order notifications to
 * George and Gregory. Sends via Resend; no-ops cleanly (logs only) when
 * RESEND_API_KEY is not set so local dev and previews never fail.
 */

import 'server-only';
import { Resend } from 'resend';

/** Render-order notifications go to George and to Gregory's inbox. */
const NOTIFY_EMAILS = Array.from(
  new Set([
    process.env.GREG_RENDER_NOTIFY_EMAIL || 'george.efesop@gmail.com',
    'efesop@hotmail.co.uk',
  ]),
);

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export interface RenderOrderEmail {
  customerName: string;
  customerEmail: string;
  quantity: number;
  amountLabel: string;
  projectDescription: string;
  location: string;
  whatsapp: string;
  styleNotes: string;
  referenceImages: string[];
  stripeSessionId: string;
}

export async function sendRenderOrderEmail(o: RenderOrderEmail): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log('[greg/email] no RESEND_API_KEY - render order:', {
      customer: o.customerName,
      quantity: o.quantity,
      session: o.stripeSessionId,
    });
    return;
  }

  const images = o.referenceImages.length
    ? `<p><strong>Reference photos (${o.referenceImages.length}):</strong></p>
       <ul>${o.referenceImages
         .map((u) => `<li><a href="${esc(u)}">${esc(u)}</a></li>`)
         .join('')}</ul>`
    : '<p><em>No reference photos uploaded.</em></p>';

  const html = `
    <h2>New design render order${
      o.quantity > 1 ? ` (${o.quantity} renders)` : ''
    }</h2>
    <p><strong>Customer:</strong> ${esc(o.customerName)}${
      o.customerEmail ? ` (${esc(o.customerEmail)})` : ''
    }</p>
    <p><strong>WhatsApp:</strong> ${esc(o.whatsapp) || '-'}</p>
    <p><strong>Property location:</strong> ${esc(o.location) || '-'}</p>
    <p><strong>Paid:</strong> ${esc(o.amountLabel) || '-'}</p>
    <hr />
    <p><strong>What to render:</strong></p>
    <p>${esc(o.projectDescription).replace(/\n/g, '<br>')}</p>
    ${
      o.styleNotes
        ? `<p><strong>Style / material notes:</strong><br>${esc(
            o.styleNotes,
          ).replace(/\n/g, '<br>')}</p>`
        : ''
    }
    <hr />
    ${images}
    <p style="font-size:12px;color:#666;">Stripe session: ${esc(
      o.stripeSessionId,
    )}</p>
  `;

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: 'G.E. Revamp Renders <onboarding@resend.dev>',
      to: NOTIFY_EMAILS,
      replyTo: o.customerEmail || undefined,
      subject: `New render order - ${o.customerName}`,
      html,
    });
    if (error) console.error('[greg/email] resend error', error);
  } catch (err) {
    console.error(
      '[greg/email] send failed',
      err instanceof Error ? err.message : err,
    );
  }
}
