// Import Figma case-study deck slides into public/images/<id>/deck/ as web webp.
// Source PNGs are scale-2 exports from the Case Studies Figma file (heavy);
// this resizes to <=1920px wide + webp q80 so the portfolio stays Lighthouse-fast.
// Run: node scripts/import-deck-images.mjs   (sharp ships with Next.js)

import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, parse } from 'node:path';

const EX = 'C:/Users/georg/Projects/george-os/ceo/specs/case-studies/_exports';
const PUB = 'C:/Users/georg/Projects/ge-portfolio/public/images';

// destId = data/case-studies/<id>.ts id; slides land in /images/<destId>/deck/<base>.webp
const JOBS = [
    { destId: 'realfi', srcDir: join(EX, 'images'), thumb: join(EX, 'realfi-cover-4x3.png') },
    { destId: 'sidechains', srcDir: join(EX, 'bridge-images'), thumb: join(EX, 'bridge-cover-4x3.png') },
    { destId: 'la-hacienda-rebrand', srcDir: join(EX, 'lahacienda-images'), thumb: join(EX, 'lahacienda-images', '01.png') },
];

for (const job of JOBS) {
    const dest = join(PUB, job.destId, 'deck');
    mkdirSync(dest, { recursive: true });
    const pngs = readdirSync(job.srcDir).filter((f) => f.toLowerCase().endsWith('.png'));
    for (const f of pngs) {
        const base = parse(f).name; // 01, 06a, 06-01, ...
        await sharp(join(job.srcDir, f))
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(join(dest, `${base}.webp`));
    }
    if (job.thumb && existsSync(job.thumb)) {
        await sharp(job.thumb)
            .resize({ width: 1280, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(join(dest, 'thumb.webp'));
    }
    console.log(`${job.destId}: ${pngs.length} slides + ${job.thumb ? 'thumb' : 'no thumb'} -> ${dest}`);
}
