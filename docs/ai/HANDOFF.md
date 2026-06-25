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
- contact relay/channel interface (typewriter removed)
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


## Current Session State: 2026-06-25

- Branch: `perf/mobile-animation-runtime`.
- Latest committed checkpoint before current edits: `c21a71b fix: changed theme color of projects page`.
- Current uncommitted source changes are expected in `about.css`, `contact.css`, and `index.html` plus documentation updates.
- About page is now visually accepted enough for the current pass: new indigo/night-blue palette, warm glow, coordinated header/logo shadow, and large Tigrinya glyph styling. Font consistency for Tigrinya remains a later polish topic.
- Projects page structure and new cyber/tech display look were committed before this session checkpoint and are considered a good direction.
- Contact page is in progress: the trivial typewriter interaction was removed from the runtime, and the page now uses a static Contact Relay/channel interface.
- User does not have and likely does not want LinkedIn; do not add LinkedIn as a contact channel. Prefer email, GitHub, CodePen, website, or another authentic channel.
- Current Contact palette is not accepted yet. The user finds the center/rim color contrast unusual; continue tomorrow by refining the Contact color story first.
- Remaining page work after Contact: Mobile Page/nav visual polish and color consistency.
- Current Live Server workflow is on port `5500` in this renamed `landing_page` folder.

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
2. Check `git status` and confirm the 2026-06-25 changes were committed and pushed.
3. Start with the Contact page. The typewriter is intentionally removed, and the channel layout is a good structural start, but the current color palette is not accepted yet.
4. Refine Contact color story so it contrasts with Main/About/Projects while still belonging to the CRT/glow system.
5. Replace placeholder contact links before deployment, especially `mailto:hello@melke.ch` and generic CodePen/GitHub URLs if needed.
6. After Contact is accepted, move to Mobile Page/nav visual polish and color consistency.
7. Keep About and Projects stable unless the user explicitly asks to revisit them.
8. Update `docs/ai/NEXT_ACTIONS.md` and `docs/ai/DECISIONS.md` if scope or tradeoffs change.

## Prompt For The Next Codex Session

```text
Read AGENTS.md, docs/ai/HANDOFF.md, docs/ai/NEXT_ACTIONS.md, and docs/ai/DECISIONS.md. Continue the custom vanilla portfolio work from the current branch/status. Main, About, and Projects are good enough for the current pass. Contact page is in progress: the typewriter was removed and replaced with a Contact Relay/channel layout, but the current color palette is not accepted yet. Preserve the handmade visual identity, avoid generic self-promotional copy, avoid new dependencies, and start by refining Contact colors and real contact links before moving to Mobile Page polish.
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
