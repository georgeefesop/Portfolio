/**
 * Project gallery for greg.efesop.com.
 *
 * Each item renders a card in the Projects section. Clicking opens a
 * lightbox (not a case-study page).
 *
 * TO ADD REAL PHOTOS:
 *  1. Drop image files into public/greg/gallery/ or public/greg/before-after/<project>/
 *  2. Set `image` to the path, e.g. '/greg/gallery/kitchen-1.jpg'
 *  3. For a before/after pair, set `beforeImage` and `afterImage` instead.
 *  4. For a video, set `video` to a path in /greg/video/.
 * Until a file is set, the card shows a labelled placeholder.
 */

export type GalleryCategory =
  | 'extensions'
  | 'renovations'
  | 'kitchens-bathrooms'
  | 'outdoor';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  /** Single finished-project photo. */
  image?: string;
  /** Before/after pair - takes priority over `image` in the lightbox. */
  beforeImage?: string;
  afterImage?: string;
  /** Video clip path (e.g. the crane video). */
  video?: string;
}

export const GALLERY_FILTERS: { id: GalleryCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All work' },
  { id: 'extensions', label: 'Extensions & floors' },
  { id: 'renovations', label: 'Renovations' },
  { id: 'kitchens-bathrooms', label: 'Kitchens & bathrooms' },
  { id: 'outdoor', label: 'Gardens & outdoor' },
];

/* Launch gallery. The shots are AI-generated placeholders that read like
   real Cyprus project photos - Gregory swaps in his own from the admin
   (Website content -> Photo gallery). */
export const galleryItems: GalleryItem[] = [
  {
    id: 'extension-twostorey',
    title: 'Two-storey home extension, Limassol',
    category: 'extensions',
    image: '/greg/gallery/extension-twostorey.png',
  },
  {
    id: 'extension-floor',
    title: 'Additional floor added to a family home',
    category: 'extensions',
    image: '/greg/gallery/extension-floor.png',
  },
  {
    id: 'limestone-build',
    title: 'New limestone family home',
    category: 'extensions',
    image: '/greg/renders/render-limestone-house.png',
  },
  {
    id: 'renovation-paphos',
    title: 'Full home renovation, Paphos',
    category: 'renovations',
    image: '/greg/gallery/renovation-paphos.png',
  },
  {
    id: 'renovation-living',
    title: 'Open-plan living space renovation',
    category: 'renovations',
    image: '/greg/gallery/renovation-living.png',
  },
  {
    id: 'renovation-hallway',
    title: 'Hallway, stairs and interior refit',
    category: 'renovations',
    image: '/greg/gallery/renovation-hallway.png',
  },
  {
    id: 'kitchen-1',
    title: 'Full kitchen renovation',
    category: 'kitchens-bathrooms',
    image: '/greg/gallery/kitchen.png',
  },
  {
    id: 'bathroom-1',
    title: 'Bathroom renovation and retiling',
    category: 'kitchens-bathrooms',
    image: '/greg/gallery/bathroom-1.png',
  },
  {
    id: 'bathroom-2',
    title: 'Modern family bathroom rebuild',
    category: 'kitchens-bathrooms',
    image: '/greg/gallery/bathroom-2.png',
  },
  {
    id: 'pool-terrace',
    title: 'Pool and landscaped terrace',
    category: 'outdoor',
    image: '/greg/renders/render-pool-terrace.png',
  },
  {
    id: 'outdoor-kitchen',
    title: 'Outdoor kitchen and courtyard build',
    category: 'outdoor',
    image: '/greg/renders/render-outdoor-kitchen.png',
  },
  {
    id: 'land-boundary',
    title: 'Bare plot to fenced and gated',
    category: 'outdoor',
    beforeImage: '/greg/renders/render-land-before.png',
    afterImage: '/greg/renders/render-land-after.png',
  },
];
