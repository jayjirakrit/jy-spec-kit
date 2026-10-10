---
name: execution
description: Orchestrate the code half of the Spec-Kit cycle: implement and converge loop with per-area area-engineer dispatch, quality-engineer verification, a /code-review pass, a human review gate, then an optional convention-following commit. Requires tasks.md from /jy-sdd:elaboration.
argument-hint: "Optional implementation guidance or task filter"
user-invocable: true
---

## User Input

```text
$ARGUMENTS
```

Consider the user input before proceeding (if not empty).

## Goal

Turn an approved `tasks.md` into working, verified, reviewed code by running the **stock**
Spec-Kit skills with the delegation rules below. This skill sequences, dispatches, loops, gates
and reports. The documentation half is `/jy-sdd:elaboration`.

## Step 1 — Preconditions

1. `.specify/` and `.sdd.config.json` must exist (else: run `/jy-sdd:init`). Read `areas`,
   `commitTags`.
2. Run the Spec-Kit prerequisites script that matches `.specify/init-options.json` `script`
   (`ps` → `.specify/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`;
   `sh` → `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks`)
   from the repo root and parse `FEATURE_DIR`.
3. Missing `tasks.md`/`plan.md` → stop; tell the user to run `/jy-sdd:elaboration`.
4. Record the starting point: `git status --short` and `git rev-parse HEAD`.

## Delegation rules (apply to every `speckit-implement` run)

When invoking `Skill speckit-implement`, add these instructions:

- **Read `design.md`** (if present) with the other design docs: it is the intended direction;
  deviations must be called out in the completion report.
- **Route each task by file path** using `.sdd.config.json` `areas[].root`:
  - All target files under one area's `root` → dispatch the `area-engineer` agent
    (`Agent`, `subagent_type: area-engineer`) with `AREA_ID: <id>`, FEATURE_DIR and the task(s).
  - Files spanning areas, or outside every area (`specs/`, root config, cross-cutting docs) →
    execute directly in this thread.
- Preserve dependency and `[P]` rules: wait for a dispatched task before starting anything that
  depends on it; independent `[P]` tasks may be dispatched concurrently, even across areas.
- Each subagent ends with the fixed report block (`STATUS`, `COMPLETED`, `FAILED`, `FILES
  CHANGED`, `VERIFICATION`, `ASSUMPTIONS / DEVIATIONS`, `OPEN QUESTIONS`). **This thread** applies
  the `[X]` checkbox edits in `tasks.md` from `COMPLETED`; treat `FAILED` as failed tasks; a report
  without the block counts as `STATUS: partial` (check the files yourself).

## Step 2 — Build Loop (max 3 iterations)

```
iteration = 1
loop:
  Skill speckit-implement $ARGUMENTS   # with the delegation rules; quality verification deferred
  Skill speckit-converge               # appends any unbuilt work as new "- [ ]" tasks
  open = count of lines matching ^- \[ \] in FEATURE_DIR/tasks.md
  if open == 0 or iteration == 3: exit loop
  iteration += 1
then: Quality verification (below), once for the whole feature
```

- Report one line per iteration (`iteration N: X tasks done, Y open`).
- If implement halts (failed sequential task, declined checklist gate) → stop looping, run quality
  verification on what exists, go to the GATE. Same if the verdict is still FAIL after its single
  fix pass. Never keep looping on a failure.
- Cap hit with tasks open → list them for the GATE.

## Quality verification (once, after the loop)

Pipelined per area so one area's review overlaps the other's work:

1. **Area lanes**: for each area that has tasks in this run, once all its tasks report
   `STATUS: done`, dispatch `quality-engineer` (`run_in_background: true`) with FEATURE_DIR,
   `SCOPE: <areaId>`, `MODE: fresh` and that area's engineer `VERIFICATION` lines.
2. **Per-lane fix pass**: on a FAIL verdict, route each production-code finding once to that area's
   `area-engineer`, then re-dispatch that lane once with `MODE: delta`, the changed files and the
   findings addressed. Still failing → keep findings for the report; no more loops.
3. **Integration**: after all tasks and lanes finish, dispatch `quality-engineer` once with
   `SCOPE: integration` (foreground, unless Step 3 runs `/code-review` alongside). It checks
   contracts across areas and files outside every area, and merges area reports into
   `FEATURE_DIR/quality-report.md`. Integration FAIL → route findings once, then re-dispatch
   `SCOPE: integration`, `MODE: delta` once.
4. Only one area (or none) touched → a single `SCOPE: full` review replaces lanes + integration.

The feature is done only when the verdict is PASS or PASS WITH NOTES.

## Step 3 — Code Review

Invoke `Skill code-review` on the diff since the HEAD recorded in Step 1 (read-only; may run
alongside the integration review). Show findings; for correctness bugs ask (`AskUserQuestion`:
**Fix all**, **Pick which**, **Skip**). Route approved fixes by area exactly as above. Then
re-dispatch `quality-engineer` once with `SCOPE: integration`, `MODE: delta` and the files changed.

## Step 4 — GATE: Human Review

Present: quality verdict + `quality-report.md` path; code-review findings (fixed/skipped/remaining);
open tasks and iterations used; deviations from `design.md` and subagent assumptions; files changed
(`git status --short` vs Step 1). `AskUserQuestion`: **Approve**, **Request changes**, **Abort**.
- Approve → Step 5. Request changes → append feedback to `tasks.md` as new `- [ ]` tasks in a
  "Review follow-ups" phase (next free T-IDs), run one Step 2 iteration and Step 4 again (max twice,
  then report and stop). Abort → stop; leave the tree as is.

## Step 5 — Offer Commit (only after Approve)

Propose, do not run yet, commits following the repo's own conventions in `CLAUDE.md`:
- Split by area. Tag from `commitTags` plus the area's `tag` (e.g. `[ADD][BE] …`; `[IMP]` for
  changes to existing behaviour). If `CLAUDE.md` defines a different convention, it wins.
- Uncommitted `specs/<NNN-feature>/` → its own first commit (`[DOCS] add <feature-name> feature spec`
  unless `CLAUDE.md` says otherwise).
- Respect the repo's rule on commit trailers/attribution. Never push.
- Show each proposed commit's subject and files, then `AskUserQuestion`: **Commit as proposed**,
  **Edit messages**, **Don't commit**. Commit only on explicit confirmation.

## Completion Report

Feature directory, iterations used, open-task count; quality verdict + report link; code-review
summary; commits created (or "not committed"); suggested next step `/clear` before the next feature.

## Done When

- [ ] Build loop finished (0 open tasks, or cap/failure reported)
- [ ] `quality-report.md` reflects the final code
- [ ] `/code-review` ran; findings handled or explicitly skipped
- [ ] Human gate answered; commit offered only after approval
