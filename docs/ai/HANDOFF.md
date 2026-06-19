# AI Handoff

## Repository

- Git root: `portfolio/`
- Remote: `git@github.com:melketesfay/portfolio.git`
- Trunk branch: `main`
- Current implementation branch: `perf/mobile-animation-runtime`
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
- [x] Durable context files merged to `main`.
- [ ] Baseline visual/performance audit fully completed.
- [x] Runtime gating mostly implemented for main interactive hotspots.
- [x] Hero spotlight optimized enough for current mobile/laptop testing.
- [x] Profile reveal optimized and accepted by the user.
- [x] Wave navigation optimized enough for current mobile/laptop testing.
- [x] Text effects partly optimized.
- [x] Cube idle loop optimized.
- [ ] Final desktop/mobile QA completed.

## Current Session State: 2026-06-19

- Current branch/work is still focused on `perf/mobile-animation-runtime`, but the working tree contains both performance fixes and content/layout polish.
- Main page is tentatively accepted by the user for current laptop/mobile testing.
- Remaining main page QA: revisit on large desktop screens before deployment.
- Desktop game mode text now uses an overlay layer so letters can detach without shifting the paragraph layout.
- Mobile toggle now runs a lightweight helium-letter burst only when toggled on; toggling off or clicking the logo restores normal text.
- Hamburger icon now morphs to an X when the mobile nav page is open.
- Hamburger mobile nav links use an elastic drop animation.
- About page content rewrite started, but the current layout is explicitly **not accepted** by the user. Do not treat the current About arrangement as done.
- The user wants the About tone to be personal and grounded, not self-promotional or pretentious.
- The About text should mention the user's real direction: Full Stack/Web, interest in Backend/Infra/Security, part-time Cyber Security study at HSLU, and personal interests such as philosophy and hiking.

## Known Hotspots To Inspect First

- `hide-and-seek.js`: always-running RAF and moving `clip-path`.
- `image-animation.js`: many touch listeners and possible listener duplication.
- `index.html`: inline SVG mask tile wave transition.
- `textrepellant.js`: many layout reads during pointer movement.
- `cube.js`: fixed interval loop.
- `game.js`: many animated character spans in optional mode.
- `style.css`, `about.css`, `pages.css`: heavy shadows, masks, filters, scanlines, and continuous decorative animations.
- `about.css`: current About layout is unstable/unsatisfactory after adding the fourth personal text block. It needs a deliberate layout pass, not more small `nth-child` patches.

## Next Recommended Task

Next session:

1. Read `AGENTS.md`, `docs/ai/HANDOFF.md`, `docs/ai/NEXT_ACTIONS.md`, and `docs/ai/DECISIONS.md`.
2. Check `git status` and confirm which changes from 2026-06-19 are committed/pushed.
3. Start with the About page. The current text direction is closer, but the layout is not good.
4. Rework About layout deliberately, preferably with clear grid areas or a simpler section structure.
5. Keep the Zurich reveal and Tigrinya visual identity unless the user explicitly asks to remove them.
6. After About is acceptable, move to Projects and Contact content/polish.
7. Update `docs/ai/NEXT_ACTIONS.md` and `docs/ai/DECISIONS.md` if scope or tradeoffs change.

## Prompt For The Next Codex Session

```text
Read AGENTS.md, docs/ai/HANDOFF.md, docs/ai/NEXT_ACTIONS.md, and docs/ai/DECISIONS.md. Continue the custom vanilla portfolio work from the current branch/status. Main page is tentatively accepted on laptop/mobile, but About page content/layout is not finished. Preserve the handmade visual identity, avoid generic self-promotional copy, avoid new dependencies, and start by fixing the About page layout/content with focused changes and browser/user verification.
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
