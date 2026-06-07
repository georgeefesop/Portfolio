'use client';

import { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';

export default function LoginForm({
  title = 'efesop admin',
  subtitle = 'Private area. Sign in to continue.',
}: {
  title?: string;
  subtitle?: string;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        throw new Error(
          res.status === 401 ? 'Wrong username or password.' : 'Login failed.',
        );
      }
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-border-subtle bg-bg-secondary p-7">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-bg-tertiary text-accent-primary">
        <Lock size={20} aria-hidden />
      </div>
      <h1 className="font-serif text-h3 leading-tight tracking-tight text-text-primary">
        {title}
      </h1>
      <p className="mt-2 text-sm text-text-muted">{subtitle}</p>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoComplete="username"
          className="w-full rounded-lg border border-border-subtle bg-bg-tertiary px-3.5 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-accent-primary"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          className="w-full rounded-lg border border-border-subtle bg-bg-tertiary px-3.5 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-accent-primary"
        />
        <button
          type="submit"
          disabled={loading || !username || !password}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent-primary px-5 py-3 font-semibold text-bg-primary transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" aria-hidden />
          ) : (
            'Sign in'
          )}
        </button>
        {error && (
          <p className="text-xs text-accent-coral" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
