# Changelog

## 0.2.0

- New `test-design.md` artifact written by the solution-architect during plan: test strategy and
  layers per area, coverage matrix, Given/When/Then test cases (TC-IDs), one reference test per layer.
- Plugin-level default templates `templates/design-template.md` and `templates/test-design-template.md`;
  `/jy-sdd:init` copies them when the profile doesn't supply its own, `/jy-sdd:doctor` checks them.
- Elaboration: GATE 2 reviews test coverage; tasks are tests-first; analyze flags a P1 scenario
  without a TC, or a TC without a test task, as CRITICAL.
- Execution: testing rules passed to every engineer dispatch; quality review traces TCs to tests.
- `design.md` lists TC-IDs per key file instead of "Specs must assert" bullets.

## 0.1.0 (plugin id: `jy-sdd`)

- Initial extraction from the Serichai web portal setup.
- Orchestrators `/jy-sdd:elaboration` and `/jy-sdd:execution` now carry the delegation logic that was
  previously patched into stock `speckit-specify`, `-plan`, `-tasks` and `-implement`, so stock
  Spec-Kit skills stay unmodified.
- `area-engineer` replaced by role-specific `backend-engineer` and `frontend-engineer` (routed by
  the area's `role`), plus a new `team-lead` for cross-area tasks and engineer open questions.
- Hooks read `.sdd.config.json` (`guard-protected`, `lint-area`); `compact-context` unchanged.
- Profiles: `fastapi-angular`, `blank`.
