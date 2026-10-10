# Changelog

## 0.1.0 (plugin id: `jy-sdd`)

- Initial extraction from the Serichai web portal setup.
- Orchestrators `/jy-sdd:elaboration` and `/jy-sdd:execution` now carry the delegation logic that was
  previously patched into stock `speckit-specify`, `-plan`, `-tasks` and `-implement`, so stock
  Spec-Kit skills stay unmodified.
- `area-engineer` replaced by role-specific `backend-engineer` and `frontend-engineer` (routed by
  the area's `role`), plus a new `team-lead` for cross-area tasks and engineer open questions.
- Hooks read `.sdd.config.json` (`guard-protected`, `lint-area`); `compact-context` unchanged.
- Profiles: `fastapi-angular`, `blank`.
