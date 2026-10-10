---
name: doctor
description: Read-only health check of a repo's SDD setup: Spec-Kit present and release-pinned, .sdd.config.json valid, area roots real, constitution has per-area Technology Standards, templates in sync with the plugin's profile, git hygiene OK. Reports problems with the exact fix; changes nothing.
user-invocable: true
---

Run these checks and print a table `check → PASS / WARN / FAIL → fix`. Change nothing.

1. **Spec-Kit**: `.specify/` exists; `.specify/init-options.json` has `integration: claude`;
   `speckit_version` is not a `.dev` build (WARN if it is). Stock skills `speckit-specify`,
   `-clarify`, `-plan`, `-tasks`, `-analyze`, `-implement`, `-converge` exist in `.claude/skills/`.
2. **Config**: `.sdd.config.json` parses; every area has `id`, `root`, `tag`; ids are unique; every
   `root` exists on disk; `lint.command` (if present) has `{file}` or is intentionally fileless.
   `frameworkVersion` major matches the installed plugin's major (WARN on minor/patch drift,
   FAIL on major drift, pointing at the plugin's `docs/MIGRATION.md`).
3. **Constitution**: `.specify/memory/constitution.md` has a Technology Standards section with a
   subsection for every area id.
4. **Templates**: each file listed in the profile's `templates` exists in `.specify/templates/`;
   report byte-different ones as drift (WARN, show `diff` stat), not an error.
5. **Permissions**: the profile's `permissions.allow` entries are present in `.claude/settings.json`.
6. **Git hygiene**: `.gitignore` does not blanket-ignore `.claude` or `.specify`; `.claude/` and
   `.specify/` content is tracked (`git ls-files`); `.specify/feature.json` is ignored.
7. **Portability**: WARN if `.specify/init-options.json` has `script: ps` and the team uses
   macOS/Linux (ask), or if any registry `source` in `.specify/workflows/workflow-registry.json`
   is an absolute machine path.
8. **Stack words in core** (only when run inside the plugin repo itself): grep
   `plugins/jy-sdd/{agents,skills,hooks}` for `fastapi|angular|react|django|backend/|frontend/|\.venv`
   and FAIL on any hit.
