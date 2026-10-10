---
name: init
description: Set up a repo for the SDD plugin. Installs Spec-Kit if missing, picks a stack profile, writes .sdd.config.json, copies the profile's templates and permission baseline, and updates .gitignore. Safe to re-run; never overwrites repo-owned files without asking.
argument-hint: "[profile name: fastapi-angular | blank]"
user-invocable: true
---

## User Input

```text
$ARGUMENTS
```

## What this does

Wires one repo to this plugin. Ownership rules:
- **Plugin-owned** (never copied): agents, orchestrators, hooks. They load from the plugin.
- **Repo-owned** (never overwritten without asking): `.sdd.config.json`, `.specify/memory/constitution.md`, `CLAUDE.md`, `specs/`.
- **Scaffold** (copied once; `/jy-sdd:doctor` reports drift): profile templates, permission baseline.

## Steps

1. **Spec-Kit.** If `.specify/` is missing, tell the user to install it with the Claude
   integration and ask permission to run `specify init --here --integration claude` (choose
   `--script sh` on macOS/Linux, `--script ps` on Windows). Do not use a dev build; note the
   installed `specify version` in the report. If `.specify/` exists, continue.
2. **Profile.** Use `$ARGUMENTS` if given, else list `${CLAUDE_PLUGIN_ROOT}/profiles/*/profile.json`
   with their `description`s and `AskUserQuestion`. Read the chosen `profile.json`.
3. **Config.** If `.sdd.config.json` exists, show a diff against the profile's `config` and ask
   before changing anything. Otherwise write it from the profile's `config`, adding
   `"frameworkVersion"` = the plugin version from `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`.
   - `blank` profile (or any profile with empty `areas`): ask the user for each area's `id`, `root`,
     `role` (free text), `tag` and gate commands; optionally a `lint` entry (see
     `hooks/lint-area.mjs` header) and `protected` globs.
   - Verify every area `root` exists on disk; warn if not.
4. **Templates.** For each path in the profile's `templates`, copy it from the profile folder into
   `.specify/templates/` (ask before overwriting). If the profile has no `design-template.md`,
   derive one from another profile's by replacing its per-area sections with one section per
   configured area. Then, if `.specify/templates/plan-template.md` lacks them, append the
   "API Contracts" (when `requireContracts`) and "Design Sketches" sections that point at
   `contracts/` and `design.md`.
5. **Permissions.** Merge the profile's `permissions.allow` into the repo's committed
   `.claude/settings.json` (create if needed; preserve existing entries; keep the repo's own
   `deny` rules). Plugins cannot ship permission settings, so this is the only way they reach teammates.
6. **Constitution.** If `.specify/memory/constitution.md` has no "Technology Standards" section
   with a subsection per area id, tell the user to run `/speckit-constitution` and give them the
   profile's `constitutionNotes`. Do not write it yourself.
7. **Git hygiene.** Make sure `.gitignore` ignores only per-developer state:
   `.claude/settings.local.json`, `.specify/feature.json`, `.specify/.workflow-install.lock`.
   Remove any blanket `.claude` / `.specify` ignore (ask first).
8. **Report** what was written, what was skipped, and next steps: commit the setup
   (`[IMP][DOC]`-style per the repo's conventions), run `/jy-sdd:doctor`, then `/jy-sdd:elaboration`.

Never commit or push on the user's behalf.
