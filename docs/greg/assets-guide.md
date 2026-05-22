# greg.efesop.com - how to add photos & videos

All of Gregory's project media lives under `public/greg/`.

## Folders

- **`public/greg/before-after/<project>/`** - before/after pairs, one folder per project.
  Name files `before-1.jpg` / `after-1.jpg`, `before-2.jpg` / `after-2.jpg`, etc.
  A `la-hacienda/` folder is already there for his biggest project.
- **`public/greg/gallery/`** - general finished-project photos (kitchens, bathrooms,
  extensions, gardens, driveways, garages, etc.).
- **`public/greg/video/`** - video clips (the crane video, project walkthroughs).

## After adding files

List the items in `data/greg/gallery.ts` so they appear on the site. Each gallery
entry points at a file path, a category, and a title. The file ships with 12
placeholder entries - swap the paths for real ones as photos come in.

## Recommended format

- JPG or WebP, landscape orientation where possible.
- At least 1200px on the long edge.
- Compress to roughly under 500KB each so the gallery stays fast.
- Video: MP4, 1080p, ideally under ~15MB per clip.
