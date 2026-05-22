import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SignOutButton from './SignOutButton';

/**
 * Shared chrome for every signed-in admin page: a heading, an optional
 * back-to-hub link and a sign-out control.
 */
export default function AdminShell({
  title,
  description,
  showBack = true,
  children,
}: {
  title: string;
  description?: string;
  showBack?: boolean;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-28 sm:px-6 md:pt-32">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          {showBack && (
            <Link
              href="/admin"
              className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
            >
              <ArrowLeft size={13} aria-hidden />
              Admin
            </Link>
          )}
          <h1 className="font-serif text-h2 leading-tight tracking-tight text-text-primary">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-sm text-text-secondary">{description}</p>
          )}
        </div>
        <SignOutButton />
      </div>
      {children}
    </main>
  );
}
