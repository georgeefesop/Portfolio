'use client';

import posthog from 'posthog-js';
import { PostHogProvider as Provider } from 'posthog-js/react';
import PostHogPageView from './PostHogPageView';
import WebVitals from './WebVitals';

// greg.efesop.com is a separate site sharing this deployment - it ingests into
// its own PostHog project (NEXT_PUBLIC_POSTHOG_KEY_GREG) so traffic and
// conversions stay separate from efesop.com.
if (typeof window !== 'undefined') {
  const isGreg = window.location.hostname.startsWith('greg.');
  const key = isGreg
    ? process.env.NEXT_PUBLIC_POSTHOG_KEY_GREG
    : process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (key) {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || '/ingest',
      ui_host: 'https://eu.posthog.com',
      persistence: 'memory',
      disable_session_recording: true,
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true,
      capture_exceptions: true,
      loaded: (ph) => ph.register({ site: isGreg ? 'greg.efesop.com' : 'efesop.com' }),
    });
  }
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
