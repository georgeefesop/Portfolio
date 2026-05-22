'use client';

import { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    try {
      await fetch('/api/greg/admin/session', { method: 'DELETE' });
    } catch {
      // Ignore - redirect below will re-gate either way.
    }
    window.location.href = '/admin';
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading}
      className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text-primary disabled:opacity-50"
    >
      {loading ? (
        <Loader2 size={13} className="animate-spin" aria-hidden />
      ) : (
        <LogOut size={13} aria-hidden />
      )}
      Sign out
    </button>
  );
}
