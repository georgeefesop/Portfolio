'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import { parseDurationMinutes, defaultWorkDate } from '@/lib/admin/time';

const field =
  'w-full rounded-lg border border-border-medium bg-bg-tertiary px-3.5 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-accent-primary';
const labelClass = 'mb-1.5 block text-xs font-medium text-text-muted';

type FormValues = {
  work_date: string;
  duration: string;
  break_minutes: number;
  work_done: string;
  comment: string;
  billable: boolean;
};

export default function QuickAddForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      work_date: defaultWorkDate(),
      duration: '',
      break_minutes: 0,
      work_done: '',
      comment: '',
      billable: true,
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    const parsed = parseDurationMinutes(values.duration);
    if (parsed === null) {
      setSubmitError('Could not read that duration.');
      return;
    }
    const breakMinutes = Number(values.break_minutes) || 0;
    const durationMinutes = Math.max(0, parsed - breakMinutes);

    try {
      const res = await fetch('/api/admin/time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          work_date: values.work_date,
          duration_minutes: durationMinutes,
          break_minutes: breakMinutes,
          work_done: values.work_done,
          comment: values.comment,
          billable: values.billable,
        }),
      });
      if (!res.ok) {
        throw new Error(res.status === 401 ? 'Session expired.' : 'Save failed.');
      }
      reset({
        work_date: defaultWorkDate(),
        duration: '',
        break_minutes: 0,
        work_done: '',
        comment: '',
        billable: true,
      });
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
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
          <label className={labelClass} htmlFor="duration">
            Duration
          </label>
          <input
            id="duration"
            type="text"
            placeholder="e.g. 1.5h, 90m, 9-11:30"
            autoComplete="off"
            className={field}
            {...register('duration', {
              required: 'Enter a duration.',
              validate: (v) =>
                parseDurationMinutes(v) !== null || 'Could not read that duration.',
            })}
          />
          {errors.duration && (
            <p className="mt-1 text-xs text-accent-coral" role="alert">
              {errors.duration.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="break_minutes">
            Break (minutes)
          </label>
          <input
            id="break_minutes"
            type="number"
            min={0}
            className={field}
            {...register('break_minutes', { valueAsNumber: true, min: 0 })}
          />
        </div>

        <div>
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

        <div className="sm:col-span-2">
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
