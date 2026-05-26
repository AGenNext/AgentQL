#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { compile } from './compiler.js';

const file = process.argv[2];

if (!file) {
  console.error('Usage: agentql <file.json>');
  process.exit(1);
}

const resolved = path.resolve(process.cwd(), file);
const raw = fs.readFileSync(resolved, 'utf-8');
const input = JSON.parse(raw);

const compiled = compile(input);

console.log(JSON.stringify(compiled, null, 2));
