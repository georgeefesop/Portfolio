'use client';

import { useReportWebVitals } from 'next/web-vitals';
import posthog from 'posthog-js';

export default function WebVitals() {
  useReportWebVitals((metric) => {
    if (!posthog.__loaded) return;
    posthog.capture('web_vitals', {
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: (metric as { rating?: string }).rating,
      metric_id: metric.id,
      path: window.location.pathname,
    });
  });
  return null;
}
