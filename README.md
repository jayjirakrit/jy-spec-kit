# jy-spec-kit

A Claude Code plugin marketplace that layers a team **spec-driven development (SDD)** workflow on top of
[GitHub Spec-Kit](https://github.com/github/spec-kit). It is a thin wrapper: Spec-Kit stays stock and
pinned, this plugin adds the orchestration, agents, hooks and per-stack profiles.

## What you get (plugin `sdd`)

| Piece | Where | Purpose |
|---|---|---|
| `/sdd:init` | `skills/init` | Wire a repo: Spec-Kit, profile, `.sdd.config.json`, templates, permissions |
| `/sdd:elaboration` | `skills/elaboration` | specify → clarify → **gate** → plan (+`design.md`) → **gate** → tasks → analyze |
| `/sdd:execution` | `skills/execution` | implement ⇄ converge → quality review ∥ `/code-review` → **gate** → optional commit |
| `/sdd:doctor` | `skills/doctor` | Read-only setup health check |
| Agents | `agents/` | `business-analyst`, `solution-architect`, `area-engineer`, `quality-engineer` |
| Hooks | `hooks/` | config-driven path guard, per-area lint-on-edit, post-compact context restore |
| Profiles | `profiles/` | `fastapi-angular`, `blank` (stack facts + templates + permission baseline) |

## Install

```
/plugin marketplace add jayjirakrit/jy-spec-kit
/plugin install sdd@jy-spec-kit
```

Then, in the target repo: `/sdd:init` → `/sdd:doctor` → `/sdd:elaboration "<feature>"` → `/sdd:execution`.

To pin the plugin for the whole team, commit it in the repo's `.claude/settings.json`
(`extraKnownMarketplaces` + `enabledPlugins`) so cloning prompts the install.

## How it stays stack-agnostic

Three layers, strictly separated:

1. **Core** (`agents/`, `skills/`, `hooks/`): no stack words. `/sdd:doctor` greps for them.
2. **Profile** (`profiles/<name>/`): templates, default areas, lint/gate commands, permissions.
3. **Repo config** (`.sdd.config.json`, repo-owned): any number of `areas`.

```jsonc
{
  "profile": "fastapi-angular",
  "frameworkVersion": "0.1.0",
  "requireContracts": true,
  "commitTags": ["ADD", "IMP", "DOCS"],
  "protected": [{ "glob": "backend/data/*.xlsx", "reason": "Deployed template, edit by hand." }],
  "areas": [
    { "id": "backend", "root": "backend/", "role": "backend", "tag": "BE", "gates": ["pytest"] },
    { "id": "frontend", "root": "frontend/", "role": "frontend", "tag": "FE",
      "lint": { "match": "src/**/*.{ts,html}", "requires": "node_modules/eslint/bin/eslint.js",
                "command": ["node", "node_modules/eslint/bin/eslint.js", "--fix", "{file}"] } }
  ]
}
```

Domain rules (calendars, currencies, language) belong in the repo's constitution, never in the core.

## Adding a stack profile

Create `plugins/sdd/profiles/<name>/profile.json` with `config` (areas, gates, lint), `permissions.allow`,
`templates` (files under `profiles/<name>/templates/`) and `constitutionNotes`. Nothing else changes.

## Status: v0.1.0 (untested skeleton)

Extracted from the Serichai web portal's local setup. **Not yet run end to end.** Known gaps:

- Plugin skill/hook loading and `${CLAUDE_PLUGIN_ROOT}` expansion not yet verified in a live install.
- `design-template.md` / `contracts-template.md` exist only in the `fastapi-angular` profile; other
  profiles derive them in `/sdd:init`. A generic design template is still to be written.
- Stock Spec-Kit's own scripts are PowerShell or bash depending on `specify init --script`; the plugin
  only picks the matching one. Mixed Windows + macOS/Linux teams should choose `sh` under WSL/Git Bash or
  commit both script sets.
- Versions: pin Spec-Kit to a release, not `0.16.1.dev0`.

See `CHANGELOG.md` and `docs/MIGRATION.md`.
