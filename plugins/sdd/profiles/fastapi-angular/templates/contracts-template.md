# API Contract: [Resource/Feature Name]

<!--
  ACTION REQUIRED: One file per resource/router touched by this feature, under
  contracts/. If this feature only extends an endpoint already documented by an
  earlier feature, use the "Delta contract" variant at the bottom of this template
  instead of restating the unchanged parts.
-->

[One line: which router → service this extends, per `CLAUDE.md`'s router→service
layering, e.g. "Extends the existing `/accounts` router
(`backend/routers/accounts.py` → `backend/services/accounts_service.py`)."]

All JSON request/response bodies use **camelCase** keys, per the repo-wide API
convention in `CLAUDE.md` and Constitution Principle III. Backend Python internals
stay `snake_case` (PEP 8); Pydantic models bridge the two via a camelCase alias
generator.

## `[METHOD] [/resource/path]`

[One line: what this endpoint does + the FR(s) from `spec.md` it satisfies.]

**Request**: `[multipart/form-data | application/json]`

[Table of fields (multipart) or JSON body schema — field, required, type, notes. Cite
the FR each field/constraint traces back to.]

**Response 200** — `application/json`

```json
[Example response body]
```

[Which Pydantic models in `backend/models/` this maps to, and whether they're new or
reused.]

**Response 4xx** — `application/json`

```json
{ "detail": "string" }
```

[Which request-level conditions trigger a 4xx, and how that's distinguished from any
per-row/per-entity condition that is instead reported inside a 200 response — a
common pattern in this repo (see `specs/001-employee-benefit-calculation/contracts/benefits-api.md`).]

## Frontend contract usage

- `features/[name]/[name].service.ts` (under the Angular app's `src/app/`): [method
  signature] — [how it calls this endpoint, e.g. multipart fields appended, headers].
- `features/[name]/[name].ts` (or the relevant component): [how the response is
  consumed — `apiCall` status/data/error signals, what renders on success/error].

---

## Delta contract variant

When a feature only adds to or modifies an already-documented endpoint (rather than
introducing a new one), do not restate the full contract. Instead:

```markdown
# API Contract Delta: [Feature Name]

Extends `specs/[base-feature]/contracts/[base]-api.md` — same endpoint, same response
envelope. Only the additions below; everything not mentioned here is unchanged.

## `[METHOD] [/resource/path]`

[Only the new/changed request fields, response fields, or error cases.]

## Frontend contract usage

[Only what changed in the consuming service/page — new params, new state, etc.]
```

See `specs/002-previous-benefit-carryforward/contracts/benefits-api-carryforward.md`
for a worked example of this pattern.
