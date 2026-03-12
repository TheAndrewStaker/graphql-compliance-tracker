#!/usr/bin/env node
/**
 * project.mjs — project scaffolding and lifecycle utilities
 * Usage: node scripts/project.mjs <command> [args]
 */

import fs from 'fs';
import path from 'path';

const root = process.cwd();
const [, , command, ...args] = process.argv;

// ─── Helpers ────────────────────────────────────────────────────────────────

function today() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function rel(p) {
  return path.relative(root, p);
}

function ensure(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(filePath, content, { overwrite = false } = {}) {
  if (!overwrite && fs.existsSync(filePath)) {return false;}
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

function fail(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

function log(msg) {
  console.log(msg);
}

// ─── Commands ────────────────────────────────────────────────────────────────

function cmdInit() {
  const dirs = [
    'docs/specs',
    'docs/testing/manual',
    'docs/sprints',
    'docs/sessions',
  ];

  for (const d of dirs) {
    const full = path.join(root, d);
    const existed = fs.existsSync(full);
    ensure(full);
    if (!existed) {log(`created  ${d}/`);}
  }

  const planPath = path.join(root, 'PLAN.md');
  if (write(planPath, `# Project Plan

## Milestones

<!-- Add milestones here. Each milestone links to a spec folder. -->
<!-- - [ ] Feature name — \`docs/specs/feature-name/\` -->

## Current status

<!-- What is actively being worked on? -->

## Decisions log

| Date | Decision | Rationale |
|------|----------|-----------|
`)) {log('created  PLAN.md');}

  const archPath = path.join(root, 'docs/ARCHITECTURE.md');
  if (write(archPath, `# Architecture

## Overview

<!-- High-level description of the system. -->

## Components

<!-- Key components and their responsibilities. -->

## Data flow

<!-- How data moves through the system. -->
`)) {log('created  docs/ARCHITECTURE.md');}

  log('done. run again at any time — init is idempotent.');
}

function cmdSprintNew() {
  const goal = args.join(' ').trim() || 'TBD';
  const currentPath = path.join(root, 'docs/sprints/SPRINT_CURRENT.md');

  if (fs.existsSync(currentPath)) {
    fail('SPRINT_CURRENT.md already exists. Run sprint:close first.');
  }

  const content = `# Sprint — ${today()}

## Goal

${goal}

## Stories

<!-- Tasks drawn from spec tasks.md files -->
<!-- - [ ] Task description — \`docs/specs/<feature>/tasks.md\` -->

## Carry-over

<!-- Anything not completed that rolls into the next sprint -->
`;

  ensure(path.dirname(currentPath));
  fs.writeFileSync(currentPath, content, 'utf8');
  log(`created  ${rel(currentPath)}`);
}

function cmdSprintClose() {
  const currentPath = path.join(root, 'docs/sprints/SPRINT_CURRENT.md');

  if (!fs.existsSync(currentPath)) {
    fail('No SPRINT_CURRENT.md found. Nothing to close.');
  }

  const sprintsDir = path.join(root, 'docs/sprints');
  const existing = fs.readdirSync(sprintsDir)
    .filter(f => /^sprint-\d+\.md$/.test(f))
    .map(f => parseInt(f.match(/\d+/)[0], 10));

  const next = existing.length > 0 ? Math.max(...existing) + 1 : 1;
  const archiveName = `sprint-${String(next).padStart(3, '0')}.md`;
  const archivePath = path.join(sprintsDir, archiveName);

  fs.renameSync(currentPath, archivePath);
  log(`archived ${rel(currentPath)} → ${rel(archivePath)}`);
}

function cmdSessionNew() {
  const currentPath = path.join(root, 'docs/sessions/SESSION_CURRENT.md');

  const content = `# Session — ${today()}

## Focus

<!-- What is the goal for this session? -->

## Completed last session

<!-- What was finished before this session started? -->

## Blockers

<!-- Anything preventing progress? -->
`;

  ensure(path.dirname(currentPath));
  fs.writeFileSync(currentPath, content, 'utf8');
  log(`created  ${rel(currentPath)}`);
}

function cmdSessionClose() {
  const currentPath = path.join(root, 'docs/sessions/SESSION_CURRENT.md');

  if (!fs.existsSync(currentPath)) {
    fail('No SESSION_CURRENT.md found. Nothing to close.');
  }

  const archivePath = path.join(root, 'docs/sessions', `${today()}.md`);

  if (fs.existsSync(archivePath)) {
    fail(`Archive target already exists: ${rel(archivePath)}`);
  }

  fs.renameSync(currentPath, archivePath);
  log(`archived ${rel(currentPath)} → ${rel(archivePath)}`);
}

function cmdSpecNew() {
  const name = args[0];
  if (!name) {fail('usage: spec:new <name>');}
  if (!/^[a-z0-9-]+$/.test(name)) {fail('name must be lowercase letters, numbers, and hyphens only');}

  const specDir = path.join(root, 'docs/specs', name);

  if (fs.existsSync(specDir)) {
    fail(`Spec already exists: ${rel(specDir)}`);
  }

  ensure(specDir);

  const featurePath = path.join(specDir, `${name}.feature`);
  fs.writeFileSync(featurePath, `Feature: ${name}
  # What this feature does and what it explicitly does not do (non-goals).

  Rule: <invariant — something always true regardless of scenario>

  Example: <scenario title>
    Given <precondition>
    When <action>
    Then <outcome>
`, 'utf8');
  log(`created  ${rel(featurePath)}`);

  const designPath = path.join(specDir, 'design.md');
  fs.writeFileSync(designPath, `# Design: ${name}

## Overview

<!-- How this feature is built. Reference ARCHITECTURE.md for system context. -->

## Components

<!-- New or modified components and their responsibilities. -->

## Data flow

<!-- API contracts, GraphQL operations, state management. -->

## Decisions

<!-- Architectural choices specific to this feature and their rationale. -->
`, 'utf8');
  log(`created  ${rel(designPath)}`);

  const tasksPath = path.join(specDir, 'tasks.md');
  fs.writeFileSync(tasksPath, `# Tasks: ${name}

<!-- Ordered implementation checklist. Each task should be completable in one session. -->
<!-- Trace each task to a scenario or rule in ${name}.feature. -->

- [ ] <!-- task 1 -->
- [ ] <!-- task 2 -->
`, 'utf8');
  log(`created  ${rel(tasksPath)}`);
}

// ─── Dispatch ────────────────────────────────────────────────────────────────

const commands = {
  init: cmdInit,
  'sprint:new': cmdSprintNew,
  'sprint:close': cmdSprintClose,
  'session:new': cmdSessionNew,
  'session:close': cmdSessionClose,
  'spec:new': cmdSpecNew,
};

if (!command || !commands[command]) {
  const available = Object.keys(commands).join(', ');
  fail(`unknown command: "${command ?? ''}". available: ${available}`);
}

commands[command]();
