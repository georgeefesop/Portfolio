'use client';

import posthog from 'posthog-js';
import { PostHogProvider as Provider } from 'posthog-js/react';
import PostHogPageView from './PostHogPageView';
import WebVitals from './WebVitals';

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || '/ingest',
    ui_host: 'https://eu.posthog.com',
    persistence: 'memory',
    disable_session_recording: true,
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    capture_exceptions: true,
    loaded: (ph) => ph.register({ site: 'efesop.com' }),
  });
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider client={posthog}>
      <PostHogPageView />
      <WebVitals />
      {children}
    </Provider>
  );
}
