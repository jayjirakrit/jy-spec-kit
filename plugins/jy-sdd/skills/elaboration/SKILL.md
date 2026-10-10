---
name: elaboration
description: Orchestrate the documentation half of the Spec-Kit cycle (specify, clarify, plan, tasks, analyze) with human review gates after the spec and after the plan, delegating to the business-analyst and solution-architect agents. Writes only Markdown under specs/<feature>/; never touches source code.
argument-hint: "Feature description (or empty to continue the active feature)"
user-invocable: true
---

## User Input

```text
$ARGUMENTS
```

Consider the user input before proceeding (if not empty).

## Goal

Take a feature from a natural-language description to a reviewed, analyzed `tasks.md` by running
the **stock** Spec-Kit skills (`speckit-*`, installed by `specify init`) in order, with the
delegation rules below. Each step is the named skill, invoked with the `Skill` tool, and its
instructions are followed in full. The code half of the cycle is `/jy-sdd:execution`.

## Preconditions

- `.specify/` exists (Spec-Kit installed) and `.sdd.config.json` exists. If either is missing,
  stop and tell the user to run `/jy-sdd:init`.
- Read `.sdd.config.json`: `areas`, `requireContracts`, `commitTags`.

## Scope Rule (non-negotiable)

- Write **only** Markdown inside the active feature directory `specs/<NNN-feature>/` (plus
  `.specify/feature.json`, which the Spec-Kit scripts maintain).
- Never create or edit files under any area `root`, or anywhere else. If a step seems to need
  code, capture it as a snippet in `design.md` (the only artifact allowed to hold implementation code).
- Do not commit.

## Step 0 — Resume Detection

1. Read `.specify/feature.json` (if it exists) for the active `feature_directory`.
2. `$ARGUMENTS` non-empty → new feature at Step A.
3. Empty:
   - No active feature or no `spec.md` → ask the user for a feature description.
   - Otherwise resume at the first missing artifact: no `plan.md` → GATE 1; no `tasks.md` →
     GATE 2; `tasks.md` present → Step F. Say which step and why.

## Pipeline

### A. Specify
Invoke `Skill speckit-specify` with `$ARGUMENTS`, adding this instruction: *"After creating the
feature directory, spec file and `.specify/feature.json` (steps 1-3), do NOT write the spec
inline. Dispatch one `Agent` call with `subagent_type: business-analyst` giving it SPEC_FILE,
the feature directory, the resolved spec-template path and the full feature description. If its
report's OPEN QUESTIONS is not `none`, ask the user all of them at once (max 3, its suggested
answers as options) and re-dispatch it with the answers."*

### B. Clarify
Invoke `Skill speckit-clarify`. Skip only if `spec.md` has no `[NEEDS CLARIFICATION]` markers
and clarify's own scan finds no high-impact ambiguity; say so in one line.

### C. Checklist (optional)
Only if `$ARGUMENTS` explicitly asks for an extra domain (e.g. "security"), invoke
`Skill speckit-checklist <domain>`. Otherwise skip silently.

### GATE 1 — Review spec (human)
Present the path to `spec.md`, any `checklists/*.md`, and a 5-10 line summary (user stories with
priorities, FR and SC counts, assumptions). `AskUserQuestion`: **Approve**, **Revise**, **Abort**.
- Approve → D. Revise → re-run `speckit-specify` (or `speckit-clarify` for ambiguity feedback)
  with the feedback, then GATE 1 again. Abort → stop and report what exists.

### D. Plan
Invoke `Skill speckit-plan`, adding this instruction: *"Execute Phases 0 and 1 by dispatching one
`Agent` call with `subagent_type: solution-architect`, giving it FEATURE_SPEC, IMPL_PLAN,
SPECS_DIR, BRANCH and any guidance. It writes `plan.md`, `research.md`, `data-model.md`,
`contracts/*.md`, `quickstart.md` and `design.md` directly. Wait for it to finish both phases."*
The dispatch message must also say:
- `design.md` is built from `.specify/templates/design-template.md`, 250-400 lines, one 10-40 line
  snippet per key file, the only artifact allowed to hold implementation code.
- If `requireContracts` is true: `contracts/` is **mandatory**: one `contracts/<resource>-api.md`
  per interface the feature adds or changes between areas, built from
  `.specify/templates/contracts-template.md` (delta contract if extending an existing one), and
  `plan.md`'s "API Contracts" section lists one line per contract. If false: write contracts only
  where areas communicate.
- Areas are the ids in `.sdd.config.json`; design and contracts must respect each area's
  Technology Standards subsection in the constitution.

### GATE 2 — Review plan + design.md (human)
Present paths to `plan.md`, `design.md`, `contracts/`, plus approach, key decisions, risks,
open questions and constitution-check notes. `AskUserQuestion`: **Approve**, **Revise**, **Abort**.
- Approve → E. Revise → re-run `speckit-plan` with feedback, then GATE 2 again. Abort → stop.

### E. Tasks
Invoke `Skill speckit-tasks`, adding: *"Also read `design.md` and align task file paths with it.
Every task names the file path(s) it touches so they can be routed to an area."*

### F. Analyze
Invoke `Skill speckit-analyze`, skipping its step 8 (offer remediation). CRITICAL findings → list
them, recommend the concrete fix, and state that `/jy-sdd:execution` should not start until resolved.
Otherwise summarize HIGH/MEDIUM counts in one line. Edit nothing automatically.

## Completion Report

- Feature directory and artifacts written; gate outcomes; analyze metrics
- Next: optionally commit the spec alone (`[DOCS] add <feature-name> feature spec`, only
  `specs/<NNN-feature>/`), `/compact keep feature <NNN> dir, analyze findings`, then `/jy-sdd:execution`

## Excluded on purpose

`speckit-constitution` (project governance, run by hand) and `speckit-taskstoissues` (external
side effect, run by hand).

## Done When

- [ ] `spec.md` approved at GATE 1; `plan.md` + `design.md` approved at GATE 2
- [ ] `tasks.md` generated and analyze report shown
- [ ] No files outside `specs/<NNN-feature>/` and `.specify/feature.json` changed
