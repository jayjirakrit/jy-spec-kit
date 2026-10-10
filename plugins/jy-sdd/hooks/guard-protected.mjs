// PreToolUse (Edit|Write|NotebookEdit): block edits to paths the repo marks as off-limits in
// .sdd.config.json (top-level `protected` and each area's `protected`, each entry a glob or
// { "glob": "...", "reason": "..." }). Exit 2 blocks the call and shows stderr to Claude.
import { readInput, projectDir, relTarget } from './_lib.mjs';
import { loadConfig, matchesAny } from './config.mjs';

const input = readInput();
const rel = relTarget(input);
if (!rel) process.exit(0);
const cfg = loadConfig(projectDir(input));
if (!cfg) process.exit(0);

const rules = [...(cfg.protected || []), ...(cfg.areas || []).flatMap((a) => a.protected || [])].map((r) =>
  typeof r === 'string' ? { glob: r } : r,
);
const hit = rules.find((r) => matchesAny(rel, [r.glob]));
if (hit) {
  console.error(
    `Blocked: ${rel} is protected by .sdd.config.json (${hit.glob}).` +
      (hit.reason ? ` ${hit.reason}` : ' Ask the user to change it by hand.'),
  );
  process.exit(2);
}
