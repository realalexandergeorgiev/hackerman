#!/usr/bin/env node
// Generates completions/_hackerman from the recipe data embedded in index.html.
// Usage: node tools/gen-zsh-completions.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/);
if(!match) throw new Error('script block not found in index.html');

const js = match[1].replaceAll('initUI();', '/* initUI disabled for generation */');
const build = new Function(js + '\nreturn buildZshCompletion();');
const out = build();

const dir = path.join(root, 'completions');
fs.mkdirSync(dir, { recursive: true });
const target = path.join(dir, '_hackerman');
fs.writeFileSync(target, out);
console.log('wrote completions/_hackerman (' + out.length + ' bytes)');
