#!/usr/bin/env node
// Auto-replace em dashes (U+2014) with ASCII hyphens (U+002D) in staged
// source files. Wired up via lint-staged in package.json -> husky
// pre-commit hook. Files come in as CLI args from lint-staged; modified
// files are re-staged automatically.
//
// IMPORTANT: this script MUST NOT contain a literal U+2014 byte anywhere
// in its own source. If it did, lint-staged would run this hook against
// this very file, the regex would replace its own bytes, and the hook
// would silently turn into a no-op. We build the target character from
// its codepoint so only ASCII bytes ever land on disk here.

import { readFileSync, writeFileSync } from 'node:fs';

const EM_DASH = String.fromCodePoint(0x2014);
const PATTERN = new RegExp(EM_DASH, 'g');
const files = process.argv.slice(2);
let changed = 0;

for (const file of files) {
    try {
        const original = readFileSync(file, 'utf8');
        if (!original.includes(EM_DASH)) continue;
        const fixed = original.replace(PATTERN, '-');
        writeFileSync(file, fixed);
        changed += 1;
        console.log(`em-dash fix: rewrote ${file}`);
    } catch (err) {
        console.error(`em-dash fix: failed on ${file}: ${err.message}`);
        process.exit(1);
    }
}

if (changed > 0) {
    console.log(`em-dash fix: cleaned ${changed} file(s).`);
}
