// PostToolUse (Edit|Write): run the area's configured fixer/linter on the edited file so the
// repo's rules are enforced on every edit. Remaining errors go back to Claude (exit 2).
//
// .sdd.config.json area.lint = {
//   "match":   "src/**/*.{ts,html}",                      // glob, relative to area.root
//   "cwd":     ".",                                       // relative to area.root (default ".")
//   "requires": "node_modules/eslint/bin/eslint.js",      // skip silently if missing (deps not installed)
//   "command": ["node", "node_modules/eslint/bin/eslint.js", "--fix", "{file}"]   // {file} = path relative to cwd
// }
// "node" in command[0] resolves to the running Node binary, avoiding slow `npx` resolution on Windows.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { readInput, projectDir, relTarget } from './_lib.mjs';
import { loadConfig, areaOf, matchesAny } from './config.mjs';

const input = readInput();
const rel = relTarget(input);
if (!rel) process.exit(0);
const root = projectDir(input);
const cfg = loadConfig(root);
if (!cfg) process.exit(0);
const area = areaOf(cfg, rel);
const lint = area?.lint;
if (!lint?.command?.length) process.exit(0);

const areaRoot = area.root.replace(/\/?$/, '/');
const inArea = rel.slice(areaRoot.length);
if (lint.match && !matchesAny(inArea, [lint.match])) process.exit(0);

const cwd = path.join(root, areaRoot, lint.cwd || '.');
if (lint.requires && !fs.existsSync(path.join(cwd, lint.requires))) process.exit(0);

const file = path.relative(cwd, path.join(root, rel)).split(path.sep).join('/');
const [cmd, ...args] = lint.command.map((p) => p.replace('{file}', file));
const res = spawnSync(cmd === 'node' ? process.execPath : cmd, args, { cwd, encoding: 'utf8', shell: false });

if (res.status !== 0) {
  console.error(`Lint errors remain in ${rel} after auto-fix:\n${res.stdout}${res.stderr}`.trim());
  process.exit(2);
}
