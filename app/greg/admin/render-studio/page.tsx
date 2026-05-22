import type { Metadata } from 'next';
import { isAdmin } from '@/lib/greg/admin-auth';
import { getGregSupabase } from '@/lib/greg/supabase';
import LoginForm from '@/components/greg/invoice/LoginForm';
import AdminShell from '@/components/greg/admin/AdminShell';
import RenderStudio from '@/components/greg/admin/RenderStudio';

export const metadata: Metadata = {
  title: 'AI Render Studio',
  robots: { index: false, follow: false },
};

const WEEKLY_CAP = 10;

/** Render jobs used in the last rolling 7 days (status != 'failed'). */
async function weeklyQuota(): Promise<{
  used: number;
  cap: number;
  remaining: number;
}> {
  const fallback = { used: 0, cap: WEEKLY_CAP, remaining: WEEKLY_CAP };
  const supabase = getGregSupabase();
  if (!supabase) return fallback;
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from('greg_render_jobs')
    .select('id', { count: 'exact', head: true })
    .gt('created_at', since)
    .neq('status', 'failed');
  if (error) return fallback;
  const used = count ?? 0;
  return { used, cap: WEEKLY_CAP, remaining: Math.max(0, WEEKLY_CAP - used) };
}

export default async function RenderStudioPage() {
  if (!(await isAdmin())) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 sm:px-6 md:pt-36">
        <LoginForm
          title="G.E. Revamp admin"
          subtitle="Private area. Sign in to use the render studio."
        />
      </main>
    );
  }

  const quota = await weeklyQuota();

  return (
    <AdminShell
      title="AI Render Studio"
      description="Describe a project in plain words and get realistic design renders to show your clients."
    >
      <RenderStudio initialQuota={quota} />
    </AdminShell>
  );
}
