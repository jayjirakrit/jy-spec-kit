# Migration

## Adopting from a repo with local copies (e.g. serichai-web-portal)

1. Install the plugin and run `/jy-sdd:init <profile>`; keep existing `.sdd.config.json` and constitution.
2. Remove local copies the plugin now provides: `.claude/agents/{business-analyst,solution-architect,quality-engineer,backend-engineer,frontend-engineer}.md`,
   `.claude/skills/speckit-{elaboration,execution}`, `.claude/hooks/*` and their `settings.json` hook entries.
3. Restore the four modified stock skills (`speckit-implement|plan|specify|tasks`) to stock by re-running
   `specify init --here --force --integration claude` (review the diff first: it also rewrites templates).
4. Move repo-specific hook rules (e.g. protected paths) into `.sdd.config.json`.
5. Run `/jy-sdd:doctor`.

## Between plugin versions

No breaking changes yet (0.x). Major bumps will list required `.sdd.config.json` changes here.
