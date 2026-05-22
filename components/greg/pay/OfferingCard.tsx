import { Check } from 'lucide-react';
import { WhatsAppButton } from '../WhatsApp';
import type { GregService } from '@/data/greg/content';
import ServiceIcon from '@/components/greg/ServiceIcon';

/**
 * A service shown on /pay as a "quoted per project" package. No fixed price -
 * every job is quoted, so the CTA is a WhatsApp enquiry pre-filled with the
 * service name.
 */
export default function OfferingCard({ service }: { service: GregService }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border-subtle bg-bg-secondary p-6 md:p-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-bg-tertiary text-accent-primary">
          <ServiceIcon id={service.id} size={20} />
        </div>
        <span className="rounded-full bg-bg-tertiary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Quoted per project
        </span>
      </div>

      <h3 className="text-h4 font-bold leading-tight tracking-tight text-text-primary">
        {service.title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">
        {service.description}
      </p>

      <ul className="mt-4 space-y-2">
        {service.points.map((point) => (
          <li
            key={point}
            className="flex items-start gap-2 text-sm text-text-secondary"
          >
            <Check
              size={15}
              className="mt-0.5 shrink-0 text-accent-primary"
              aria-hidden
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-border-subtle/70 pt-5">
        <WhatsAppButton
          location={`pay_service_${service.id}`}
          message={`Hello, I would like a quote for ${service.title.toLowerCase()}.`}
          variant="outline"
          className="w-full"
        >
          Enquire on WhatsApp
        </WhatsAppButton>
      </div>
    </div>
  );
}
