/**
 * Pre-payment intake for the Same-Day Design Render product.
 * POST /api/greg/render-order  (multipart/form-data)
 *   projectDescription, location, whatsapp, styleNotes, quantity, images[]
 *
 * Stores the order + reference photos in Supabase, then opens a Stripe
 * Checkout for RENDER_PRICE_EUR x quantity. The brief is captured before
 * payment so the customer never has to come back and fill anything in after.
 * When Supabase is not configured the brief rides in Stripe metadata instead.
 */

import { NextResponse } from 'next/server';
import { getGregStripe } from '@/lib/greg/stripe';
import { getGregSupabase } from '@/lib/greg/supabase';
import { RENDER_PRICE_EUR, RENDER_MAX_QUANTITY } from '@/data/greg/renders';

export const runtime = 'nodejs';

const BUCKET = 'greg-uploads';
const MAX_IMAGES = 5;

function resolveOrigin(request: Request): string {
  const origin = request.headers.get('origin');
  if (origin) return origin.replace(/\/$/, '');
  const host = request.headers.get('host');
  if (host) {
    const proto = host.includes('localhost') ? 'http' : 'https';
    return `${proto}://${host}`;
  }
  return 'https://greg.efesop.com';
}

function str(v: FormDataEntryValue | null, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'invalid_form' }, { status: 400 });
  }

  const projectDescription = str(form.get('projectDescription'), 2000);
  const location = str(form.get('location'), 200);
  const whatsapp = str(form.get('whatsapp'), 60);
  const styleNotes = str(form.get('styleNotes'), 1000);
  const quantity = Math.min(
    RENDER_MAX_QUANTITY,
    Math.max(1, Math.round(Number(form.get('quantity')) || 1)),
  );

  if (!projectDescription) {
    return NextResponse.json(
      { error: 'Add a description of what you want rendered.' },
      { status: 400 },
    );
  }

  const images = form
    .getAll('images')
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, MAX_IMAGES);

  const supabase = getGregSupabase();
  let orderId: string | null = null;
  const imageUrls: string[] = [];

  // Persist the order + reference photos when Supabase is configured.
  if (supabase) {
    const { data: order, error: insertErr } = await supabase
      .from('greg_render_orders')
      .insert({
        status: 'pending_payment',
        quantity,
        amount_total: RENDER_PRICE_EUR * quantity,
        project_description: projectDescription,
        location: location || null,
        whatsapp: whatsapp || null,
        style_notes: styleNotes || null,
      })
      .select('id')
      .single();

    if (insertErr || !order) {
      console.error(
        '[greg/render-order] insert error',
        insertErr?.message ?? 'no row',
      );
    } else {
      orderId = order.id as string;
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const ext = (file.name.split('.').pop() || 'jpg')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '');
        const path = `render-orders/${orderId}/${i + 1}.${ext || 'jpg'}`;
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const { error: upErr } = await supabase.storage
            .from(BUCKET)
            .upload(path, buffer, {
              contentType: file.type || 'image/jpeg',
              upsert: true,
            });
          if (upErr) {
            console.error('[greg/render-order] upload error', upErr.message);
            continue;
          }
          const { data: pub } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(path);
          if (pub?.publicUrl) imageUrls.push(pub.publicUrl);
        } catch (err) {
          console.error(
            '[greg/render-order] upload failed',
            err instanceof Error ? err.message : err,
          );
        }
      }
      if (imageUrls.length) {
        await supabase
          .from('greg_render_orders')
          .update({ reference_images: imageUrls })
          .eq('id', orderId);
      }
    }
  }

  // Stripe Checkout. order_id ties the webhook back to the stored order;
  // when Supabase is off, the brief rides in metadata instead.
  const metadata: Record<string, string> = {
    source: 'greg_renders',
    quantity: String(quantity),
    custom_reason:
      quantity > 1
        ? `Same-Day Design Render x${quantity}`
        : 'Same-Day Design Render',
  };
  if (orderId) {
    metadata.order_id = orderId;
  } else {
    metadata.brief = projectDescription.slice(0, 480);
    if (location) metadata.location = location;
    if (whatsapp) metadata.whatsapp = whatsapp;
  }

  const origin = resolveOrigin(request);
  try {
    const session = await getGregStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity,
          price_data: {
            currency: 'eur',
            unit_amount: RENDER_PRICE_EUR * 100,
            product_data: {
              name: 'Same-Day Design Render',
              description:
                'A realistic AI-generated visualisation of your project, delivered the same day.',
            },
          },
        },
      ],
      success_url: `${origin}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pay?canceled=1`,
      billing_address_collection: 'auto',
      metadata,
    });
    if (!session.url) {
      return NextResponse.json({ error: 'no_session_url' }, { status: 502 });
    }
    if (supabase && orderId) {
      await supabase
        .from('greg_render_orders')
        .update({ stripe_session_id: session.id })
        .eq('id', orderId);
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(
      '[greg/render-order] stripe error',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json({ error: 'stripe_error' }, { status: 502 });
  }
}
