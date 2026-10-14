# Test Design: [FEATURE]

<!--
  Written by solution-architect in /speckit-plan Phase 1; reviewed at GATE 2.
  150-400 lines. Code only in §5.
  - IDs: US<n>.AS<m>, FR-###, EC-<n> (spec order), SC-###, <contract>#<error>.
  - Every P1 scenario, behavioural FR and contract error case has a TC; untested
    edge cases go in §7.
  - "Then" is observable (value, status + field, rendered state, record, error).
  - Each layer fakes only what §2 allows; never the unit under test.
  - Each test file block in §4 = one test task, before the code it covers.
  - Priority: Must (P1, contract error, data integrity) · Should · Could.
-->

Spec: `spec.md` · Design: `design.md` · Contracts: `contracts/*.md`

## 1. Strategy

| Area | Framework / gate | Levels | Coverage target | Location & naming |
|------|------------------|--------|-----------------|-------------------|
| [area id] | [runner; gate] | [unit, contract, component, integration] | [e.g. >=80% new lines] | [pattern] |

## 2. Layers

| Area | Layer | Source files | Level | Fakes | Test file pattern | Follow |
|------|-------|--------------|-------|-------|-------------------|--------|
| [area id] | [handler / service / data access / component / client] | `[path]` | [level] | [what is faked] | [pattern] | `[existing test]` or none |

## 3. Coverage matrix

| Spec item | Priority | TC-IDs | Layer | Area |
|-----------|----------|--------|-------|------|
| US1.AS1 | P1 | TC-001, TC-004 | [layer] | [area id] |

## 4. Test cases

### 4.1 [area id]

#### 4.1.1 [layer]

##### `[test file]` — tests `[source file]` — US1

| TC | Spec | Scenario | Given | When | Then | Priority |
|----|------|----------|-------|------|------|----------|
| TC-001 | US1.AS1 | Happy path | [precondition] | [action] | [observable result] | Must |
| TC-002 | [contract]#[error] | Error case | [precondition] | [action] | [error shape] | Must |
| TC-003 | EC-1 | Edge case | [boundary] | [action] | [result] | Should |

## 5. Unit test implementation per layer

### 5.1 [area id] · [layer] — TC-001

Follows: `[existing test]` or new pattern

```[lang]
// TC-001: [scenario]
[setup unit + fakes from §2]
[arrange data from §6]
[act]
[assert "Then"]
```

**Shape**: [how fakes are injected, assertion style, TC-ID naming]

## 6. Test data & mocking

| Data set | Description | Source | Used by |
|----------|-------------|--------|---------|
| [name] | [what] | [fixture / factory / file] | TC-001 |

| Dependency | Strategy | Layers | Rationale |
|------------|----------|--------|-----------|
| [dependency] | [real / fake / stub / mock] | [layer] | [why] |

## 7. Not tested in code

| Spec item | Reason | Covered by |
|-----------|--------|------------|
| [EC-n] | [reason] | [quickstart step / walkthrough / none] |

## 8. Open questions

1. [or "None"]
