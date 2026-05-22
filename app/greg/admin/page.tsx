import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Image as ImageIcon,
  Sparkles,
  ShoppingBag,
  FileText,
} from 'lucide-react';
import { isAdmin } from '@/lib/greg/admin-auth';
import LoginForm from '@/components/greg/invoice/LoginForm';
import AdminShell from '@/components/greg/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

const TOOLS = [
  {
    href: '/admin/content',
    title: 'Website content',
    description:
      'Edit your photo gallery, services, testimonials and business details.',
    icon: ImageIcon,
  },
  {
    href: '/admin/render-studio',
    title: 'AI Render Studio',
    description:
      'Turn a plain description into design renders for your clients.',
    icon: Sparkles,
  },
  {
    href: '/admin/orders',
    title: 'Orders',
    description: 'See payments and design render orders as they come in.',
    icon: ShoppingBag,
  },
  {
    href: '/create-invoice',
    title: 'Create an invoice',
    description: 'Make a payment request and send it to a client on WhatsApp.',
    icon: FileText,
  },
];

export default async function AdminHubPage() {
  if (!(await isAdmin())) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 sm:px-6 md:pt-36">
        <LoginForm
          title="G.E. Revamp admin"
          subtitle="Private area. Sign in to manage your website."
        />
      </main>
    );
  }

  return (
    <AdminShell
      title="Admin"
      description="Run your website, see your orders and create renders."
      showBack={false}
    >
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
    </AdminShell>
  );
}
