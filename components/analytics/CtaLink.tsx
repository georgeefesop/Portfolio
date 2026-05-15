'use client';

import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { usePostHog } from 'posthog-js/react';

export type CtaDestination =
    | 'upwork'
    | 'email'
    | 'linkedin'
    | 'github'
    | 'calendly'
    | 'whatsapp'
    | 'phone'
    | 'youtube'
    | 'tiktok'
    | 'behance'
    | 'other';

export type CtaLocation =
    | 'hero'
    | 'nav'
    | 'contact_section'
    | 'footer'
    | 'case_study_modal'
    | 'case_study_page'
    | 'micro_upwork_card';

type CtaLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    destination: CtaDestination;
    ctaLocation: CtaLocation;
};

const CtaLink = forwardRef<HTMLAnchorElement, CtaLinkProps>(function CtaLink(
    { destination, ctaLocation, onClick, children, ...rest },
    ref,
) {
    const posthog = usePostHog();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        posthog?.capture('contact_cta_clicked', {
            destination,
            cta_location: ctaLocation,
        });
        onClick?.(event);
    };

    return (
        <a ref={ref} onClick={handleClick} {...rest}>
            {children}
        </a>
    );
});

export default CtaLink;
