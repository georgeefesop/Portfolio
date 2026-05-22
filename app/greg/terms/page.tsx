import type { Metadata } from 'next';
import LegalPage from '@/components/greg/LegalPage';
import { termsContent } from '@/data/greg/legal';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'The terms that apply to the use of greg.efesop.com, the website of G.E. Revamp Services Limited.',
};

export default function TermsPage() {
  return <LegalPage doc={termsContent} />;
}
