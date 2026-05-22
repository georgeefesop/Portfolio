# greg.efesop.com - admin area plan (Phase 2)

Phase 1 (the public site, /pay, /create-invoice, payment capture, the
Same-Day Design Render product) is built and launch-ready. This is Phase 2:
a private admin area so Gregory can run the site himself.

## What it replaces

The standalone /intake form idea is dropped. Instead of a one-time form,
Gregory gets a permanent admin where he manages content directly. The intake
questions become the "Business details" and content sections of the admin.

## Architecture

### /admin - the hub
A sign-in-gated hub at greg.efesop.com/admin. One "greg admin" login (extends
the existing /create-invoice cookie auth) covers /admin, /create-invoice and
/studio. A discreet "Admin" link in the site footer points here. The hub is a
simple page of large cards: Website content - AI Render Studio - Orders -
Create an invoice.

### Content -> Sanity CMS
The repo already runs Sanity (for the Kingfisher project). greg gets its own
Sanity schemas: project (gallery item), service, testimonial, business
details (singleton). Editing happens in Sanity Studio, embedded at /studio.
The site reads content from Sanity. Sanity's asset pipeline hosts the image
and video uploads (handles ~50MB-per-file) - that answers the "where do
uploads live" question. Legal pages and fine structural copy stay in code.

### Orders
/admin/orders reads the Supabase greg_revamp_payments table and lists
payments and render orders.

### AI Render Studio
/admin/render-studio. Gregory describes a render in plain English and uploads
up to 4 reference photos. The Anthropic API (Claude Opus 4.7) turns the brief
into strong Runware prompts; the app executes the renders via the Runware HTTP
API and tracks the jobs itself (the local render-queue is not available to a
deployed app). Async UI: grey placeholder tiles with a loader and elapsed
timer, replaced by the finished image. Per-image save/download and WhatsApp /
Signal share, batch share. Capped at 10 generations per week.

## Tickets
- admin auth + hub page + footer link
- Sanity CMS for greg content
- orders dashboard
- AI Render Studio
- render placeholders into the portfolio gallery

## Recommendation

Launch Phase 1 first. The site is your dad's web presence and lead funnel -
get it live with seeded content and the Stripe wiring. Phase 2 is a
maintenance and power tool; it can follow without holding up the launch.
