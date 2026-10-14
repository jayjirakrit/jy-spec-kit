# Design: [FEATURE]

<!--
  Written by solution-architect in /speckit-plan Phase 1; reviewed at GATE 2.
  250-400 lines. Key files only (feature logic, contracts, screens, shared blocks,
  algorithms, config that carries a decision); skip scaffolding and pure re-exports.
  - One 10-40 line snippet per key file part; never elide the decision itself.
  - Siblings: full snippet for the first, "Differs from X" + differing code for the rest.
  - §4: one subsection per area id, in .sdd.config.json order.
  - Tests live in test-design.md; here only a "Tests" line of TC-IDs.
  - Reference contracts/*.md and data-model.md; never restate them.
  - Inapplicable section: "Not applicable — reason".
-->

Spec: `spec.md` · Plan: `plan.md` · Contracts: `contracts/*.md` · Tests: `test-design.md`

## 1. Approach

[4-8 lines: solution shape, reused vs new, untouched areas.]

## 2. Key decisions

| Decision | Choice | Why / trade-off |
|----------|--------|-----------------|

## 3. Flow

```text
[main path, error path, duplicate-submit path]
```

## 4. Key files

| Requirements | Key files |
|--------------|-----------|
| [FR-001..003] | `[path]`, `[path]` |

### 4.1 [area id]

#### [file path] — [FR-###]
```[lang]
[key path]
```
**Check**: [one line]
**Tests**: [TC-###]

#### [sibling file] — differs from [first]
- [what differs]
```[lang]
[differing code]
```
**Tests**: [TC-###]

### 4.N Shared building blocks

#### [file path] — [FR-###]
```[lang]
[public API + edge-case behaviour]
```
**Check**: [one line]
**Tests**: [TC-###]

### 4.N+1 Algorithms / business rules

#### [file path] — [FR-###]
```[lang]
[full logic incl. precedence]
```
**Tests**: [TC-###]

### 4.N+2 Config & infra (only where a decision lives)

#### [file path]
```text
[key lines]
```

## 5. Data & contracts touched

- [contract / model → link]

## 6. Risks, gaps & mismatches

- [or "None"]

## 7. Open questions

1. [or "None"]
