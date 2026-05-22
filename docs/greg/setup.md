# greg.efesop.com - go-live checklist

The site is built and lives in this repo under `app/greg/*`. It is served on
the `greg.` subdomain by `middleware.ts`. Locally, preview it at
**greg.localhost:3000**.

These are the wiring steps to take it live. Nothing here changes efesop.com.

## 1. Domain
- Add a `greg` CNAME on efesop.com pointing at the Vercel deployment.
- Add `greg.efesop.com` as a domain on the Vercel project.

## 2. Stripe (G.E. Revamp company account)
- Create the Stripe account in the company's name (see `docs/greg/intake-questions.md` and Notion TKT-89). It must be owned by G.E. Revamp Services Limited, not by George.
- Enable card payments and SEPA Direct Debit.
- Copy the secret key into `STRIPE_GREG_SECRET_KEY`.
- Add a webhook endpoint `https://greg.efesop.com/api/greg/stripe-webhook` for the `checkout.session.completed` event. Copy its signing secret into `STRIPE_GREG_WEBHOOK_SECRET`.

## 3. PostHog
- Create a new PostHog project for greg.efesop.com (keeps its analytics separate from efesop.com).
- Copy the project API key into `NEXT_PUBLIC_POSTHOG_KEY_GREG`.

## 4. Supabase (payment capture)
- The `greg_revamp_payments` table already exists in the George-OS Supabase project.
- Copy that project's service-role key into `GREG_SUPABASE_SERVICE_KEY`. `GREG_SUPABASE_URL` is already set.

## 5. Invoice tool
- `GREG_INVOICE_PASSWORD` is set in `.env.local`. Set the same value in Vercel.
- The tool lives at `greg.efesop.com/create-invoice`. Username: `greg`.

## 6. Optional - Notion customer mirror
- Create a Notion database "G.E. Revamp - Customers" with properties:
  Name (title), Email (email), Phone (phone), Amount (number), Service (text), Source (select), Paid date (date).
- Create a Notion internal integration, share the database with it.
- Set `GREG_NOTION_TOKEN` and `GREG_NOTION_CUSTOMERS_DB_ID`.
- If skipped, payments are still captured in Supabase and visible in the Stripe app.

## 7. Set env vars in Vercel
Add every variable above to the Vercel project (Production and Preview).

## 8. Content before launch
- Drop real project photos into `public/greg/` per `docs/greg/assets-guide.md` and update `data/greg/gallery.ts`.
- Replace the placeholder testimonials in `data/greg/content.ts` with real ones from Gregory.
- Fill the projects-completed number, towns covered, and VAT number once Gregory provides them (`docs/greg/intake-questions.md`).

## 9. Sign-off
Gregory reviews and approves the site before it is made public.

## Theme
greg's colours are in `app/greg/greg-theme.css` - edit `--greg-bg` and
`--greg-accent` for dark and light mode. Structure and fonts are shared with
efesop.com and update automatically.
