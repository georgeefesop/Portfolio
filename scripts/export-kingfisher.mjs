#!/usr/bin/env node
/**
 * export-kingfisher.mjs
 * Fetches the local WordPress/Elementor site at http://localhost:8080/
 * and exports it as static files under public/kingfisher/ in the Next.js project.
 *
 * Run from the GE-Portfolio directory:
 *   node scripts/export-kingfisher.mjs
 */

import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { URL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'public', 'kingfisher');

const BASE_URL = 'http://localhost:8080';
const PREFIX = '/kingfisher';

// Paths to skip entirely
const SKIP_PATTERNS = [
  '/wp-json/',
  '/feed/',
  '/xmlrpc.php',
  '/wp-login.php',
  '/wp-admin/',
];

let downloadedCount = 0;
let skippedCount = 0;
const errors = [];

// ─── helpers ────────────────────────────────────────────────────────────────

function fetchUrl(urlStr, redirectsLeft = 3) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlStr);
    const lib = parsed.protocol === 'https:' ? https : http;

    const req = lib.get(urlStr, { timeout: 15000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        if (redirectsLeft <= 0) return reject(new Error(`Too many redirects for ${urlStr}`));
        const next = new URL(res.headers.location, urlStr).toString();
        return resolve(fetchUrl(next, redirectsLeft - 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(Object.assign(new Error(`HTTP ${res.statusCode}`), { statusCode: res.statusCode }));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ body: Buffer.concat(chunks), headers: res.headers }));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout: ${urlStr}`)); });
  });
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

/** Convert a localhost URL path to a local output file path */
function urlPathToLocalPath(urlPath) {
  // Strip query strings / fragments for file naming
  const clean = urlPath.split('?')[0].split('#')[0];
  // If it ends with /, treat as index.html
  const normalized = clean.endsWith('/') ? clean + 'index.html' : clean;
  return path.join(OUTPUT_DIR, normalized);
}

/** Rewrite CSS content: fix url(...) references to point to /kingfisher/... */
function rewriteCss(css) {
  // url('http://localhost:8080/...') → url('/kingfisher/...')
  let result = css.replace(
    /url\(\s*['"]?http:\/\/localhost:8080\/(.*?)['"]?\s*\)/gi,
    (_, p) => `url('/kingfisher/${p}')`
  );
  // url('/wp-content/...') → url('/kingfisher/wp-content/...')
  result = result.replace(
    /url\(\s*['"]?\/(wp-content\/[^'")\s]+)['"]?\s*\)/gi,
    (_, p) => `url('/kingfisher/${p}')`
  );
  // url('/wp-includes/...') → url('/kingfisher/wp-includes/...')
  result = result.replace(
    /url\(\s*['"]?\/(wp-includes\/[^'")\s]+)['"]?\s*\)/gi,
    (_, p) => `url('/kingfisher/${p}')`
  );
  return result;
}

/** Extract asset URLs (localhost:8080) from CSS url(...) declarations */
function extractCssAssets(css) {
  const urls = new Set();
  const re = /url\(\s*['"]?(https?:\/\/localhost:8080\/[^'")\s]+)['"]?\s*\)/gi;
  let m;
  while ((m = re.exec(css)) !== null) {
    urls.add(m[1]);
  }
  // Also pick up root-relative /wp-content/ and /wp-includes/ paths
  const re2 = /url\(\s*['"]?\/(wp-(?:content|includes)\/[^'")\s]+)['"]?\s*\)/gi;
  while ((m = re2.exec(css)) !== null) {
    urls.add(`${BASE_URL}/${m[1]}`);
  }
  return urls;
}

/** Rewrite the full HTML: replace all localhost refs with /kingfisher/... */
function rewriteHtml(html) {
  let result = html;

  // Remove WordPress admin bar
  result = result.replace(/<[^>]+id=["']wpadminbar["'][^>]*>[\s\S]*?<\/[a-z]+>/i, '');
  // Also remove the #wpadminbar style block injected inline
  result = result.replace(/<style[^>]*>[\s\S]*?#wpadminbar[\s\S]*?<\/style>/gi, '');

  // Remove or rewrite canonical
  result = result.replace(
    /<link[^>]+rel=["']canonical["'][^>]*href=["']https?:\/\/localhost:8080\/?["'][^>]*\/?>/gi,
    `<link rel="canonical" href="/kingfisher" />`
  );

  // Rewrite <base href="...">
  result = result.replace(
    /<base[^>]+href=["']https?:\/\/localhost:8080\/?["'][^>]*\/?>/gi,
    `<base href="/kingfisher/" />`
  );

  // Rewrite href="http://localhost:8080" and href="http://localhost:8080/" → href="/kingfisher"
  result = result.replace(
    /href=["']https?:\/\/localhost:8080\/?["']/gi,
    `href="/kingfisher"`
  );

  // Rewrite all remaining http://localhost:8080/ occurrences (src, href with paths, etc.)
  result = result.replace(/https?:\/\/localhost:8080\//g, `${PREFIX}/`);

  // Also handle JSON-escaped form: http:\/\/localhost:8080\/ (inside inline JS)
  result = result.replace(/https?:\\\/\\\/localhost:8080\\\//g, `${PREFIX}\\/`);

  // Rewrite root-relative wp-content/wp-includes paths in src/href attributes
  result = result.replace(
    /\b(src|href)=(['"])\/(wp-(?:content|includes)\/)/gi,
    (_, attr, quote, path) => `${attr}=${quote}${PREFIX}/${path}`
  );

  return result;
}

/** Extract all localhost:8080 asset URLs from HTML */
function extractHtmlAssets(html) {
  const urls = new Set();

  // src="http://localhost:8080/..."
  const srcRe = /\bsrc=["'](https?:\/\/localhost:8080\/[^"'>\s]+)["']/gi;
  let m;
  while ((m = srcRe.exec(html)) !== null) urls.add(m[1]);

  // href="http://localhost:8080/..." (CSS, fonts, etc.)
  const hrefRe = /\bhref=["'](https?:\/\/localhost:8080\/[^"'>\s]+)["']/gi;
  while ((m = hrefRe.exec(html)) !== null) urls.add(m[1]);

  // srcset="..." - may have multiple URLs
  const srcsetRe = /\bsrcset=["']([^"']+)["']/gi;
  while ((m = srcsetRe.exec(html)) !== null) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u.startsWith(`${BASE_URL}/`)) urls.add(u);
    }
  }

  // Root-relative src="/wp-content/..." or src='/wp-content/...'
  const rootSrcRe = /\bsrc=["']\/(wp-(?:content|includes)\/[^"'>\s]+)["']/gi;
  while ((m = rootSrcRe.exec(html)) !== null) urls.add(`${BASE_URL}/${m[1]}`);

  // Root-relative href="/wp-content/..." (CSS link tags)
  const rootHrefRe = /\bhref=["']\/(wp-(?:content|includes)\/[^"'>\s]+)["']/gi;
  while ((m = rootHrefRe.exec(html)) !== null) urls.add(`${BASE_URL}/${m[1]}`);

  return urls;
}

function shouldSkip(urlPath) {
  return SKIP_PATTERNS.some(p => urlPath.includes(p));
}

// ─── main ───────────────────────────────────────────────────────────────────

async function downloadAsset(urlStr, isCss = false) {
  const parsed = new URL(urlStr);
  if (shouldSkip(parsed.pathname)) {
    console.log(`  SKIP  ${parsed.pathname}`);
    skippedCount++;
    return null;
  }

  const localPath = urlPathToLocalPath(parsed.pathname);

  if (fs.existsSync(localPath)) {
    // Already downloaded this session
    return localPath;
  }

  try {
    const { body, headers } = await fetchUrl(urlStr);
    const contentType = headers['content-type'] || '';
    const isCssFile = isCss || contentType.includes('css') || parsed.pathname.endsWith('.css');

    let content = body;
    if (isCssFile) {
      let cssText = body.toString('utf-8');
      // Find and queue assets referenced inside this CSS
      const cssAssets = extractCssAssets(cssText);
      for (const assetUrl of cssAssets) {
        await downloadAsset(assetUrl);
      }
      cssText = rewriteCss(cssText);
      content = Buffer.from(cssText, 'utf-8');
    }

    ensureDir(localPath);
    fs.writeFileSync(localPath, content);
    console.log(`  OK    ${parsed.pathname}`);
    downloadedCount++;
    return localPath;
  } catch (err) {
    const code = err.statusCode ? `HTTP ${err.statusCode}` : err.message;
    console.warn(`  WARN  ${parsed.pathname} - ${code}`);
    errors.push({ url: urlStr, error: code });
    return null;
  }
}

async function main() {
  console.log('=== Kingfisher Static Export ===\n');
  console.log(`Fetching ${BASE_URL}/ ...`);

  let htmlRaw;
  try {
    const { body } = await fetchUrl(`${BASE_URL}/`);
    htmlRaw = body.toString('utf-8');
  } catch (err) {
    console.error(`FATAL: Could not fetch ${BASE_URL}/\n${err.message}`);
    process.exit(1);
  }

  // Extract assets from raw HTML (before rewriting)
  const assetUrls = extractHtmlAssets(htmlRaw);
  console.log(`\nFound ${assetUrls.size} assets to download...\n`);

  for (const url of assetUrls) {
    await downloadAsset(url);
  }

  // Rewrite HTML
  const htmlFinal = rewriteHtml(htmlRaw);

  // Verify no localhost remains
  const remaining = (htmlFinal.match(/localhost:8080/g) || []).length;
  if (remaining > 0) {
    console.warn(`\nWARN: ${remaining} occurrences of localhost:8080 still in HTML (may be in comments/scripts)`);
  }

  // Save HTML
  const htmlPath = path.join(OUTPUT_DIR, 'index.html');
  ensureDir(htmlPath);
  fs.writeFileSync(htmlPath, htmlFinal, 'utf-8');
  console.log(`\nSaved HTML → ${htmlPath}`);

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Assets downloaded : ${downloadedCount}`);
  console.log(`Assets skipped    : ${skippedCount}`);
  console.log(`Errors / 404s     : ${errors.length}`);
  if (errors.length > 0) {
    for (const e of errors) {
      console.log(`  ${e.error}  ${e.url}`);
    }
  }
  console.log(`localhost refs left in HTML: ${remaining}`);
  console.log('\nDone.');
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
