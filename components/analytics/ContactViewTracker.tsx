'use client';

import { useEffect, useRef } from 'react';
import { usePostHog } from 'posthog-js/react';

type ContactViewTrackerProps = {
    targetId?: string;
    threshold?: number;
};

export default function ContactViewTracker({
    targetId = 'contact',
    threshold = 0.5,
}: ContactViewTrackerProps) {
    const posthog = usePostHog();
    const fired = useRef(false);

    useEffect(() => {
        if (fired.current) return;
        const target = document.getElementById(targetId);
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting && !fired.current) {
                        fired.current = true;
                        posthog?.capture('contact_view');
                        observer.disconnect();
                        break;
                    }
                }
            },
            { threshold },
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [posthog, targetId, threshold]);

    return null;
}
