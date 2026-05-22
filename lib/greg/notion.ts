/**
 * Optional Notion mirror of G.E. Revamp customers.
 *
 * When GREG_NOTION_TOKEN and GREG_NOTION_CUSTOMERS_DB_ID are set, each
 * captured payment is also written as a page in a Notion database so Gregory
 * can browse his customers on his phone. If unset, this is a no-op - Supabase
 * remains the system of record.
 *
 * The target Notion database needs these properties:
 *   Name (title) · Email (email) · Phone (phone) · Amount (number) ·
 *   Service (text) · Source (select) · Paid date (date)
 */

import 'server-only';

const NOTION_VERSION = '2022-06-28';

export interface GregCustomerRecord {
  name: string;
  email: string | null;
  phone: string | null;
  amount: number | null;
  description: string | null;
  source: string | null;
  paidAt: string;
}

export async function addNotionCustomer(c: GregCustomerRecord): Promise<void> {
  const token = process.env.GREG_NOTION_TOKEN;
  const dbId = process.env.GREG_NOTION_CUSTOMERS_DB_ID;
  if (!token || !dbId) return; // not configured - Supabase still has the record

  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: c.name || 'Unknown' } }] },
    'Paid date': { date: { start: c.paidAt } },
  };
  if (c.email) properties.Email = { email: c.email };
  if (c.phone) properties.Phone = { phone_number: c.phone };
  if (c.amount != null) properties.Amount = { number: c.amount };
  if (c.description)
    properties.Service = { rich_text: [{ text: { content: c.description } }] };
  if (c.source) properties.Source = { select: { name: c.source } };

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ parent: { database_id: dbId }, properties }),
  });

  if (!res.ok) {
    console.error(
      '[greg/notion] add customer failed',
      res.status,
      await res.text(),
    );
  }
}
