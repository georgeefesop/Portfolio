import Link from 'next/link';
import { Hammer, Mail, MapPin } from 'lucide-react';
import { GREG, GREG_TEL } from '@/lib/greg/site';
import { type BusinessDetails } from '@/data/greg/content';
import { WhatsAppButton } from './WhatsApp';

const AREAS = ['Limassol', 'Paphos', 'Larnaca', 'Nicosia'];

export default function GregFooter({
  business,
}: {
  business: BusinessDetails;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-bg-hero py-16 text-text-primary">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex w-fit items-center gap-2 text-xl font-bold tracking-tight text-text-primary transition-colors hover:text-accent-primary">
              <Hammer size={20} aria-hidden />
              <span>G.E. Revamp</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-text-muted">
              {GREG.tagline}. Over {GREG.yearsExperience} years of building
              experience, run by {GREG.owner}.
            </p>
            <WhatsAppButton location="footer" className="!px-5 !py-3 text-sm">
              Message us on WhatsApp
            </WhatsAppButton>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-primary">
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Services', href: '/#services' },
                { label: 'How we work', href: '/#process' },
                { label: 'Projects', href: '/#projects' },
                { label: 'Testimonials', href: '/#testimonials' },
                { label: 'About', href: '/#about' },
                { label: 'Pay online', href: '/pay' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-text-secondary transition-colors hover:text-accent-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-primary">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>
                <a
                  href={GREG_TEL}
                  className="transition-colors hover:text-accent-primary"
                >
                  {GREG.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${business.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-accent-primary"
                >
                  <Mail size={14} aria-hidden />
                  {business.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-text-muted">
                <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden />
                <span>Serving {AREAS.join(' · ')} and across the Greek side of Cyprus</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal bar */}
        <div className="mt-12 border-t border-border-subtle pt-8 text-xs leading-relaxed text-text-dim">
          <p>
            {GREG.company} · Registered in Cyprus, company no. {GREG.regNumber}
            {business.vatNumber ? ` · VAT ${business.vatNumber}` : ''}
          </p>
          <p className="mt-1">Registered office: {business.address}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© {year} {GREG.company}. All rights reserved.</span>
            <Link href="/privacy" className="transition-colors hover:text-text-secondary">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-text-secondary">
              Terms
            </Link>
            <Link href="/admin" className="transition-colors hover:text-text-secondary">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
