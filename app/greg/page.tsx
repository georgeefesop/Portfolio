import Hero from '@/components/greg/sections/Hero';
import Credentials from '@/components/greg/sections/Credentials';
import Services from '@/components/greg/sections/Services';
import Process from '@/components/greg/sections/Process';
import Gallery from '@/components/greg/sections/Gallery';
import Testimonials from '@/components/greg/sections/Testimonials';
import About from '@/components/greg/sections/About';
import Areas from '@/components/greg/sections/Areas';
import FinalCta from '@/components/greg/sections/FinalCta';
import { getContent } from '@/lib/greg/content-store';
import {
  services as defaultServices,
  testimonials as defaultTestimonials,
  heroContent as defaultHero,
  aboutContent as defaultAbout,
  type GregService,
  type GregTestimonial,
  type HeroContent,
  type AboutContent,
} from '@/data/greg/content';
import { galleryItems as defaultGallery } from '@/data/greg/gallery';
import type { GalleryItem } from '@/data/greg/gallery';

export default async function GregHomePage() {
  const [hero, about, services, testimonials, gallery] = await Promise.all([
    getContent<HeroContent>('hero', defaultHero),
    getContent<AboutContent>('about', defaultAbout),
    getContent<GregService[]>('services', defaultServices),
    getContent<GregTestimonial[]>('testimonials', defaultTestimonials),
    getContent<GalleryItem[]>('gallery', defaultGallery),
  ]);

  return (
    <main>
      <Hero hero={hero} />
      <Credentials />
      <Services services={services} />
      <Process />
      <Gallery items={gallery} />
      <Testimonials testimonials={testimonials} />
      <About about={about} />
      <Areas />
      <FinalCta />
    </main>
  );
}
