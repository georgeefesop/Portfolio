'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import {
  defaultWorkDate,
  netMinutes,
  composeStamp,
  clockToMinutes,
  minsToHours,
  fmtHours,
} from '@/lib/admin/time';

const field =
  'w-full rounded-lg border border-border-medium bg-bg-tertiary px-3.5 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-accent-primary';
const labelClass = 'mb-1.5 block text-xs font-medium text-text-muted';

// Break choices, in hours. George expects 0.5 / 1, occasionally 0.25.
const BREAK_OPTIONS = [0, 0.25, 0.5, 0.75, 1, 1.5, 2];

type FormValues = {
  work_date: string;
  start: string;
  end: string;
  break_hours: number;
  work_done: string;
  comment: string;
  billable: boolean;
};

const emptyValues = (): FormValues => ({
  work_date: defaultWorkDate(),
  start: '09:00',
  end: '17:00',
  break_hours: 0,
  work_done: '',
  comment: '',
  billable: true,
});

export default function QuickAddForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({ defaultValues: emptyValues() });

  const start = watch('start');
  const end = watch('end');
  const breakHours = watch('break_hours');
  const net = netMinutes(start, end, (Number(breakHours) || 0) * 60);

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    const breakMinutes = Math.round((Number(values.break_hours) || 0) * 60);
    const durationMinutes = netMinutes(values.start, values.end, breakMinutes);
    if (durationMinutes === null || durationMinutes <= 0) {
      setSubmitError('Check the start and end times.');
      return;
    }
    const overnight =
      (clockToMinutes(values.end) ?? 0) <= (clockToMinutes(values.start) ?? 0);

    try {
      const res = await fetch('/api/admin/time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          work_date: values.work_date,
          started_at: composeStamp(values.work_date, values.start),
          ended_at: composeStamp(values.work_date, values.end, overnight),
          break_minutes: breakMinutes,
          duration_minutes: durationMinutes,
          work_done: values.work_done,
          comment: values.comment,
          billable: values.billable,
        }),
      });
      if (!res.ok) {
        throw new Error(res.status === 401 ? 'Session expired.' : 'Save failed.');
      }
      reset(emptyValues());
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Save failed.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-border-subtle bg-bg-secondary p-5 sm:p-6"
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <label className={labelClass} htmlFor="work_date">
            Date
          </label>
          <input
            id="work_date"
            type="date"
            className={field}
            {...register('work_date', { required: true })}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="start">
            Start
          </label>
          <input
            id="start"
            type="time"
            className={field}
            {...register('start', { required: true })}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="end">
            End
          </label>
          <input
            id="end"
            type="time"
            className={field}
            {...register('end', { required: true })}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="break_hours">
            Break (hours)
          </label>
          <select
            id="break_hours"
            className={field}
            {...register('break_hours', { valueAsNumber: true })}
          >
            {BREAK_OPTIONS.map((h) => (
              <option key={h} value={h}>
                {h === 0 ? 'None' : `${fmtHours(h)} h`}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 sm:col-span-3">
          <label className={labelClass} htmlFor="work_done">
            Work done
          </label>
          <input
            id="work_done"
            type="text"
            placeholder="What you worked on"
            autoComplete="off"
            className={field}
            {...register('work_done')}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className={labelClass}>Net</label>
          <div className="flex h-[42px] items-center rounded-lg border border-border-subtle bg-bg-tertiary px-3.5 text-sm tabular-nums text-text-primary">
            {net === null || net <= 0 ? (
              <span className="text-text-dim">--</span>
            ) : (
              <span className="font-semibold">{fmtHours(minsToHours(net))} h</span>
            )}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-4">
          <label className={labelClass} htmlFor="comment">
            Comment (optional)
          </label>
          <input
            id="comment"
            type="text"
            autoComplete="off"
            className={field}
            {...register('comment')}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border-medium bg-bg-tertiary accent-accent-primary"
            {...register('billable')}
          />
          Billable
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-primary px-5 py-2.5 font-semibold text-bg-primary transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" aria-hidden />
          ) : (
            <Plus size={16} aria-hidden />
          )}
          Add entry
        </button>
      </div>

      {submitError && (
        <p className="mt-3 text-xs text-accent-coral" role="alert">
          {submitError}
        </p>
      )}
    </form>
  );
}
