// Loads the repo's .sdd.config.json (the only place stack-specific facts live) for the hooks.
import fs from 'node:fs';
import path from 'node:path';

export function loadConfig(root) {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(root, '.sdd.config.json'), 'utf8'));
    return { areas: [], protected: [], ...cfg };
  } catch {
    return null; // repo not initialised with /jy-sdd:init: hooks stay silent
  }
}

// Minimal glob -> RegExp: `**` any depth, `*` within a segment, `?` one char, `{a,b}` alternation.
export function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        re += '.*';
        i++;
        if (glob[i + 1] === '/') i++;
      } else re += '[^/]*';
    } else if (c === '?') re += '[^/]';
    else if (c === '{') re += '(?:';
    else if (c === '}') re += ')';
    else if (c === ',' && re.includes('(?:')) re += '|';
    else re += c.replace(/[.+^$()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${re}$`, 'i');
}

export function matchesAny(rel, globs = []) {
  return globs.some((g) => globToRegExp(g).test(rel));
}

// The area whose root contains `rel`, or undefined.
export function areaOf(cfg, rel) {
  return (cfg.areas || []).find((a) => rel.startsWith(a.root.replace(/\/?$/, '/')));
}
