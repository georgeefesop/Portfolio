import type { Metadata } from 'next';
import { isAdmin } from '@/lib/greg/admin-auth';
import LoginForm from '@/components/greg/invoice/LoginForm';
import AdminShell from '@/components/greg/admin/AdminShell';
import ContentEditor from '@/components/greg/admin/ContentEditor';
import { getContent } from '@/lib/greg/content-store';
import {
  services as defaultServices,
  testimonials as defaultTestimonials,
  defaultBusiness,
  type GregService,
  type GregTestimonial,
  type BusinessDetails,
} from '@/data/greg/content';
import {
  galleryItems as defaultGallery,
  type GalleryItem,
} from '@/data/greg/gallery';

export const metadata: Metadata = {
  title: 'Website content',
  robots: { index: false, follow: false },
};

export default async function AdminContentPage() {
  if (!(await isAdmin())) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 sm:px-6 md:pt-36">
        <LoginForm
          title="G.E. Revamp admin"
          subtitle="Private area. Sign in to edit your website."
        />
      </main>
    );
  }

  const [gallery, services, testimonials, business] = await Promise.all([
    getContent<GalleryItem[]>('gallery', defaultGallery),
    getContent<GregService[]>('services', defaultServices),
    getContent<GregTestimonial[]>('testimonials', defaultTestimonials),
    getContent<BusinessDetails>('business', defaultBusiness),
  ]);

  return (
    <AdminShell
      title="Website content"
      description="Edit what visitors see on your website. Changes go live as soon as you save."
    >
      <ContentEditor
        gallery={gallery}
        services={services}
        testimonials={testimonials}
        business={business}
      />
    </AdminShell>
  );
}
