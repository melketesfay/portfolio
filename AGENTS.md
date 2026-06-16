# AGENTS.md

## Project Goal

This repository is a handmade vanilla HTML/CSS/JavaScript portfolio for Melke Tesfay. The site is meant to prove frontend craft through custom browser-native interactions, not through a framework or template.

Preserve the visual identity: retro CRT atmosphere, wave page transitions, spotlight reveal, profile strip reveal, draggable 3D cube, double-helix spiral text, text repulsion, typewriter contact page, and optional game mode.

## Workflow

- Git root is this `portfolio/` directory.
- Main branch is `main`.
- Use GitHub flow with short-lived branches.
- Branch names should match the change type, for example `docs/performance-plan`, `perf/mobile-animation-runtime`, `fix/spotlight-touch-jank`, or `chore/project-cleanup`.
- Use Conventional Commits: `docs:`, `perf:`, `fix:`, `feat:`, `chore:`.
- Keep each PR focused and easy to review.

## Development Commands

- The project is static HTML/CSS/JS.
- Use VS Code Live Server on port `5958` from `.vscode/settings.json`.
- Do not add frameworks, build tools, package managers, or production dependencies unless the user explicitly approves.
- Prefer browser-native APIs and small local modules.

## AI Project Memory

- Keep `AGENTS.md` at the Git root so Codex can auto-discover project instructions.
- Keep durable handoff and tracking files in `docs/ai/`.
- Read `docs/ai/HANDOFF.md` before continuing a partially completed performance task.
- Read `docs/ai/NEXT_ACTIONS.md` before changing animation behavior.
- Read `docs/ai/DECISIONS.md` before revisiting scope, tradeoffs, or feature removal.

## Performance Work Rules

- Preserve major visual features by default.
- Do not remove a major animation unless `docs/ai/NEXT_ACTIONS.md` or `docs/ai/DECISIONS.md` records why it cannot be made acceptable.
- Desktop may keep richer interactions; mobile may use cheaper fallbacks when needed.
- Hidden pages should not keep running page-specific pointer/touch animation logic.
- Avoid always-running animation loops unless they are intentionally decorative and proven cheap.
- Prefer `transform` and `opacity` for animation.
- Avoid layout reads and writes in the same frame when possible.
- Use passive listeners for scroll/touch paths unless cancellation is required.

## Verification

Before finalizing animation or layout changes:

- Smoke test the site in a desktop browser through Live Server.
- Verify mobile-sized viewport behavior.
- Check main navigation wave, hero spotlight, profile reveal, cube, spiral text, projects page, contact typewriter, and mobile nav.
- Note any performance or visual tradeoffs in `docs/ai/NEXT_ACTIONS.md` or `docs/ai/DECISIONS.md`.

## Source Control Safety

- Do not revert user changes.
- Do not run destructive Git commands unless explicitly requested.
- Keep documentation/tracking commits separate from animation implementation commits when practical.
