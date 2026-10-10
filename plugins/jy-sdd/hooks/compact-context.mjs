// SessionStart (matcher: compact): after /compact or auto-compaction, re-point Claude at the
// durable state on disk so nothing important depends on the summary alone. stdout -> context.
import fs from 'node:fs';
import path from 'node:path';
import { readInput, projectDir } from './_lib.mjs';

const root = projectDir(readInput());
let featureDir = null;
try {
  featureDir = JSON.parse(fs.readFileSync(path.join(root, '.specify/feature.json'), 'utf8')).feature_directory;
} catch {
  // no active Spec-Kit feature
}

const lines = ['Context was just compacted. Durable state lives on disk, not in the summary:'];
if (featureDir) {
  lines.push(
    `- Active Spec-Kit feature: ${featureDir}. Re-read its tasks.md ([X] = done) and, if relevant, ` +
      'plan.md / design.md / quality-report.md before continuing.',
  );
}
lines.push('- Run `git status` / `git diff` to see uncommitted work in progress.');
console.log(lines.join('\n'));
