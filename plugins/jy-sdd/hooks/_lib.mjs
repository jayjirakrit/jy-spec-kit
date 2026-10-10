// Shared helpers for the hook scripts: read the hook JSON from stdin and resolve
// the edited file relative to the project root (forward slashes, for matching).
import fs from 'node:fs';
import path from 'node:path';

export function readInput() {
  try {
    return JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch {
    return {};
  }
}

export function projectDir(input) {
  return path.resolve(process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd());
}

// Returns the edited file relative to the project root, or null if outside it.
export function relTarget(input) {
  const ti = input.tool_input || {};
  const file = ti.file_path || ti.notebook_path;
  if (!file) return null;
  const root = projectDir(input);
  const rel = path.relative(root, path.resolve(root, file)).split(path.sep).join('/');
  return rel.startsWith('..') || path.isAbsolute(rel) ? null : rel;
}
