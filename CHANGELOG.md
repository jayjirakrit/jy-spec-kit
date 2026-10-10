# Changelog

## 0.1.0

- Initial extraction from the Serichai web portal setup.
- Orchestrators `/sdd:elaboration` and `/sdd:execution` now carry the delegation logic that was
  previously patched into stock `speckit-specify`, `-plan`, `-tasks` and `-implement`, so stock
  Spec-Kit skills stay unmodified.
- `backend-engineer` + `frontend-engineer` merged into config-driven `area-engineer`.
- Hooks read `.sdd.config.json` (`guard-protected`, `lint-area`); `compact-context` unchanged.
- Profiles: `fastapi-angular`, `blank`.
