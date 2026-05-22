'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Hammer, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GregThemeToggle from './GregThemeToggle';
import { WhatsAppButton } from './WhatsApp';
import { WHATSAPP_DEFAULT_MESSAGE } from '@/lib/greg/site';

const NAV_LINKS = [
  { name: 'Services', href: '/#services' },
  { name: 'How we work', href: '/#process' },
  { name: 'Projects', href: '/#projects' },
  { name: 'Testimonials', href: '/#testimonials' },
  { name: 'About', href: '/#about' },
];

const ISLAND_STYLE: React.CSSProperties = {
  background: 'var(--nav-island-bg)',
  borderColor: 'var(--nav-island-border)',
  /* Inset bevel only; the float shadow is a filter so it follows the
     parallelogram clip-path (an outer box-shadow would be clipped off). */
  boxShadow:
    '0 1px 0 rgba(255,255,255,0.04) inset, 0 -1px 0 rgba(0,0,0,0.12) inset',
  filter: 'drop-shadow(0 3px 8px rgb(0 0 0 / 22%))',
};

export default function GregNav() {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 pt-4 pointer-events-none"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="greg-para [--para-slant:13px] pointer-events-auto w-full max-w-6xl border backdrop-blur-md"
        style={ISLAND_STYLE}
      >
        <div className="flex h-14 items-center justify-between px-10 sm:px-12">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-lg font-bold text-[var(--nav-fg)] transition-opacity hover:opacity-70"
          >
            <Hammer size={24} aria-hidden />
            <span className="whitespace-nowrap text-[24px] uppercase italic tracking-[0.85px]">
              G.E. Revamp
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="whitespace-nowrap text-sm font-medium text-[var(--nav-link)] transition-colors hover:text-[var(--nav-fg)]"
              >
                {link.name}
              </a>
            ))}
            <GregThemeToggle />
            <WhatsAppButton
              location="nav"
              message={WHATSAPP_DEFAULT_MESSAGE}
              className="!px-8 !py-2 whitespace-nowrap text-sm !bg-[var(--nav-btn-bg)] !text-[var(--nav-btn-fg)] [--para-slant:8px]"
            >
              Get a quote
            </WhatsAppButton>
          </div>

          {/* Mobile cluster */}
          <div className="flex items-center gap-3 lg:hidden">
            <GregThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="rounded-lg p-1.5 text-[var(--nav-link)] transition-colors hover:text-[var(--nav-fg)]"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden rounded-b-2xl border-t border-black/10 lg:hidden"
            >
              <div className="space-y-1 px-4 pb-4 pt-2">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--nav-link)] transition-colors hover:bg-black/5 hover:text-[var(--nav-fg)]"
                  >
                    {link.name}
                  </a>
                ))}
                <WhatsAppButton
                  location="nav_mobile"
                  message={WHATSAPP_DEFAULT_MESSAGE}
                  className="mt-2 w-full !bg-[var(--nav-btn-bg)] !text-[var(--nav-btn-fg)]"
                >
                  Get a free quote
                </WhatsAppButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
