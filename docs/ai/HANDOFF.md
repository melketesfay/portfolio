# AI Handoff

## Repository

- Git root: `portfolio/`
- Remote: `git@github.com:melketesfay/portfolio.git`
- Trunk branch: `main`
- Current planning branch: `docs/performance-plan`
- Workflow: GitHub flow, short-lived branches, Conventional Commits

## Project Intent

This site is a custom vanilla HTML/CSS/JavaScript portfolio. It should showcase frontend craft through handmade interactions. The goal is not to replace it with a standard smooth template. The goal is to make the existing visual concept performant enough to ship.

Core identity:

- retro CRT atmosphere
- layered single-page navigation
- rectangular tile wave page transition
- hero spotlight revealing hidden backend/full-stack layer
- profile strip image reveal
- draggable 3D project cube
- upward rotating double-helix technology text
- interactive text repel
- Zurich image reveal
- contact typewriter
- optional game mode

## Do Not Lose These Decisions

See `docs/ai/DECISIONS.md` for the canonical decision log.

- Preserve major animations by default.
- Mobile can use cheaper fallbacks if the desktop version is too expensive.
- No framework rewrite.
- No new dependencies without explicit approval.
- Documentation and tracking changes should stay separate from performance implementation changes when practical.
- Hidden pages should not keep processing their page-specific animation logic.

## Current Status

- [x] Baseline Git repository exists under `portfolio/`.
- [x] Trunk is `main`.
- [x] Baseline commit exists: `chore: initial baseline commit before performance optimization`.
- [x] First planning branch selected: `docs/performance-plan`.
- [ ] Durable context files merged to `main`.
- [ ] Baseline visual/performance audit completed.
- [ ] Runtime gating implemented.
- [ ] Hero spotlight optimized.
- [ ] Profile reveal optimized.
- [ ] Wave navigation optimized.
- [ ] Text effects optimized.
- [ ] Cube idle loop optimized.
- [ ] Final desktop/mobile QA completed.

## Known Hotspots To Inspect First

- `hide-and-seek.js`: always-running RAF and moving `clip-path`.
- `image-animation.js`: many touch listeners and possible listener duplication.
- `index.html`: inline SVG mask tile wave transition.
- `textrepellant.js`: many layout reads during pointer movement.
- `cube.js`: fixed interval loop.
- `game.js`: many animated character spans in optional mode.
- `style.css`, `about.css`, `pages.css`: heavy shadows, masks, filters, scanlines, and continuous decorative animations.

## Next Recommended Task

After merging `docs/performance-plan`, create:

```bash
git switch main
git pull
git switch -c perf/mobile-animation-runtime
```

Then:

1. Read `AGENTS.md`, `docs/ai/HANDOFF.md`, `docs/ai/NEXT_ACTIONS.md`, and `docs/ai/DECISIONS.md`.
2. Complete the baseline audit checklist.
3. Implement active-page/runtime gating and hero spotlight optimization first.
4. Verify desktop and mobile-sized viewport behavior.
5. Update `docs/ai/NEXT_ACTIONS.md` with findings and checklist progress.
6. Update `docs/ai/DECISIONS.md` if a scope or tradeoff decision changes.

## Prompt For The Next Codex Session

```text
Read AGENTS.md, docs/ai/HANDOFF.md, docs/ai/NEXT_ACTIONS.md, and docs/ai/DECISIONS.md. We are optimizing the custom vanilla portfolio for smooth desktop/mobile animation while preserving the visual identity. Start from the current git branch and status. For this task, complete the next unchecked phase in docs/ai/NEXT_ACTIONS.md. Keep changes focused, avoid new dependencies, verify in browser when possible, and update the tracking checklist before finalizing.
```

## Review Checklist For Pull Requests

- [ ] Branch name matches change type.
- [ ] Commit message uses Conventional Commit style.
- [ ] No framework or dependency added.
- [ ] Major visual identity remains intact.
- [ ] Mobile fallback is documented if behavior changed.
- [ ] Hidden/offscreen effects do not keep doing unnecessary work.
- [ ] `docs/ai/NEXT_ACTIONS.md` status updated when relevant.
- [ ] `docs/ai/DECISIONS.md` updated when scope or tradeoffs changed.
