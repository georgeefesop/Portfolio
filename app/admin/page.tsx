import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, FileText } from 'lucide-react';
import { isAdmin } from '@/lib/admin/auth';
import LoginForm from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const TOOLS = [
  {
    href: '/admin/time',
    title: 'Time tracking',
    description: "Log billable time and see this week's running total.",
    icon: Clock,
  },
  {
    href: '/admin/invoices',
    title: 'Invoices',
    description: 'Issue and track invoices from tracked hours.',
    icon: FileText,
  },
];

export default async function AdminHubPage() {
  if (!(await isAdmin())) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 sm:px-6 md:pt-36">
        <LoginForm />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-28 sm:px-6 md:pt-32">
      <div className="mb-8">
        <h1 className="font-serif text-h2 leading-tight tracking-tight text-text-primary">
          Admin
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          Private tools for running the business.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex flex-col rounded-2xl border border-border-subtle bg-bg-secondary p-6 transition-colors hover:border-accent-primary"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-bg-tertiary text-accent-primary">
              <tool.icon size={20} aria-hidden />
            </div>
            <h2 className="text-h4 font-bold leading-tight tracking-tight text-text-primary">
              {tool.title}
            </h2>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-text-secondary">
              {tool.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent-primary">
              Open
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
