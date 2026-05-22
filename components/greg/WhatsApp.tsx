'use client';

import { usePostHog } from 'posthog-js/react';
import { MessageCircle } from 'lucide-react';
import { whatsappUrl } from '@/lib/greg/site';

type Variant = 'solid' | 'outline' | 'plain';

const VARIANT_CLASS: Record<Variant, string> = {
  solid:
    'greg-para bg-cta-bg text-cta-fg font-semibold hover:brightness-95 px-12 py-3.5',
  outline:
    'greg-para bg-bg-tertiary text-text-primary font-semibold hover:text-accent-primary px-12 py-3.5',
  plain: 'text-text-secondary hover:text-accent-primary font-medium',
};

interface WhatsAppButtonProps {
  /** Tracking label - where on the page this button sits (hero, nav, footer...). */
  location: string;
  /** Optional pre-filled WhatsApp message. */
  message?: string;
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

/**
 * Tracked WhatsApp call-to-action. Every click fires a `whatsapp_click`
 * PostHog event with its location, so conversions are measurable.
 */
export function WhatsAppButton({
  location,
  message,
  variant = 'solid',
  className = '',
  children,
  showIcon = true,
}: WhatsAppButtonProps) {
  const posthog = usePostHog();
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => posthog?.capture('whatsapp_click', { location })}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-colors ${VARIANT_CLASS[variant]} ${className}`}
    >
      {showIcon && <MessageCircle size={18} aria-hidden />}
      {children ?? 'Message on WhatsApp'}
    </a>
  );
}

/**
 * Persistent floating WhatsApp button, bottom-right on every greg page.
 * Uses the WhatsApp brand green so it reads instantly as "message us".
 */
export function FloatingWhatsApp() {
  const posthog = usePostHog();
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message G.E. Revamp on WhatsApp"
      onClick={() => posthog?.capture('whatsapp_click', { location: 'floating' })}
      className="fixed bottom-5 right-5 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-transform hover:scale-105 focus-visible:scale-105"
    >
      <MessageCircle size={26} aria-hidden />
    </a>
  );
}
