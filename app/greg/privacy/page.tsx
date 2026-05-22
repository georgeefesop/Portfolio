import type { Metadata } from 'next';
import LegalPage from '@/components/greg/LegalPage';
import { privacyContent } from '@/data/greg/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How G.E. Revamp Services Limited handles personal information collected through greg.efesop.com.',
};

export default function PrivacyPage() {
  return <LegalPage doc={privacyContent} />;
}
