import { readdirSync, readFileSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { join, basename, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const csDir = join(repoRoot, 'data/case-studies');
const publicDir = join(repoRoot, 'public');
const outRoot = join(repoRoot, '_export');
const outThumbs = join(outRoot, 'thumbnails');
const outSubs = join(outRoot, 'subscreenshots');

if (existsSync(outRoot)) rmSync(outRoot, { recursive: true, force: true });
mkdirSync(outThumbs, { recursive: true });
mkdirSync(outSubs, { recursive: true });

const files = readdirSync(csDir).filter(f => f.endsWith('.ts') && !['index.ts', 'types.ts'].includes(f));
const imgRe = /['"](\/images\/[^'"\s)]+\.(?:png|jpg|jpeg|webp|svg|gif))['"]/gi;
const thumbRe = /thumbnail:\s*['"](\/images\/[^'"\s)]+\.(?:png|jpg|jpeg|webp|svg|gif))['"]/gi;

const allRefs = new Map(); // webPath -> Set(sources: 'thumb'|'sub')

for (const file of files) {
    const text = readFileSync(join(csDir, file), 'utf8');
    const thumbs = new Set();
    let m;
    while ((m = thumbRe.exec(text))) thumbs.add(m[1]);
    imgRe.lastIndex = 0;
    while ((m = imgRe.exec(text))) {
        const p = m[1];
        if (!allRefs.has(p)) allRefs.set(p, new Set());
        allRefs.get(p).add(thumbs.has(p) ? 'thumb-and-sub' : 'sub');
    }
    // ensure thumbs are tagged
    for (const t of thumbs) {
        if (!allRefs.has(t)) allRefs.set(t, new Set());
        allRefs.get(t).add('thumb');
    }
}

let thumbCount = 0, subCount = 0, missing = [];
const flatName = (webPath) => {
    // /images/foo/bar.png -> foo__bar.png ; /images/x.png -> x.png
    const parts = webPath.replace(/^\/images\//, '').split('/');
    return parts.join('__');
};

for (const [webPath, tags] of allRefs) {
    const src = join(publicDir, webPath.replace(/^\//, ''));
    if (!existsSync(src)) { missing.push(webPath); continue; }
    const flat = flatName(webPath);
    const isThumb = [...tags].some(t => t.includes('thumb'));
    if (isThumb) {
        copyFileSync(src, join(outThumbs, flat));
        thumbCount++;
    }
    // subscreenshots = everything (heroes + galleries + decision screenshots + thumbs all together per user request)
    copyFileSync(src, join(outSubs, flat));
    subCount++;
}

console.log(`Thumbnails: ${thumbCount} -> ${outThumbs}`);
console.log(`Subscreenshots (all images flat): ${subCount} -> ${outSubs}`);
if (missing.length) {
    console.log(`\nMissing on disk (${missing.length}):`);
    for (const m of missing) console.log('  ' + m);
}
