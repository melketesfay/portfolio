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
- User does not have and likely does not want LinkedIn; do not add LinkedIn as a contact channel. Prefer email, GitHub, CodePen, Mastodon, or another authentic channel.
- Current Contact palette is not accepted yet. The user finds the center/rim color contrast unusual; continue tomorrow by refining the Contact color story first.
- Remaining page work after Contact: Mobile Page/nav visual polish and color consistency.
- Current Live Server workflow is on port `5500` in this renamed `landing_page` folder.


## Current Session State: 2026-06-26

- Branch is clean at start and synced with `origin/perf/mobile-animation-runtime` before today's changes.
- Goal for today: produce an alpha deploy candidate.
- Contact page palette was refined away from the unusual blue/gold split into a more cohesive aubergine/rose/coral palette with a small gold signal accent. This still needs user visual acceptance.
- Footer/contact links were consolidated for alpha: email `melketesfay@gmail.com`, GitHub `https://github.com/melketesfay`, CodePen `https://codepen.io/melketesfay`, Mastodon `https://infosec.exchange/@melketesfay`. CodePen URL confirmed by user for alpha.
- Mobile Page/nav received a dedicated stable grid layout: header, centered nav, footer pinned to the bottom row. It now has its own violet/rose/gold palette and scoped nav item styles.
- Shell-side `curl http://127.0.0.1:5500/` still cannot reach the user's VS Code Live Server, so visual QA must be done in the user's browser/device path.
- About city image references were switched to lighter JPEG exports (`asmara.jpg`, `zuerich.jpg`) for alpha performance; original PNGs remain in the repo.
- Alpha technical checks passed locally: `git diff --check`, HTML parser, JS syntax check, local asset reference check, local HTTP 200 checks, and Chrome DevTools overflow probe.
- Attempted global X-overflow guard in `style.css` (`html { overflow-x: hidden; }` and replacing page-shell `100vw`) caused the user's browser view to become blank/dark except CRT overlay; it was reverted. Do not reapply this blindly.
- Image treatment was sharpened for the current alpha direction: reduced rounded corners and added display-like frames/corner accents instead of smooth card-style photo radii.
- The old self-linking website/globe social was replaced with Mastodon in footers and Contact Relay. Mastodon username `melketesfay` on `infosec.exchange` was created by the user; profile approval may still be pending, but the expected URL is `https://infosec.exchange/@melketesfay`.
- Tigrinya/Ethiopic characters now use explicit `Abyssinica SIL` via Google Fonts for a more characterful serif rendering across browsers/devices. Later final-launch polish may self-host the font files if desired.
- Still required before deploy: user visual acceptance of the Contact palette and Mobile Page/nav via user-shared screenshots or the user's live browser view, plus the concrete deploy target/workflow. No deploy script/config exists in this folder yet.

## Known Hotspots To Inspect First

- `hide-and-seek.js`: always-running RAF and moving `clip-path`.
- `image-animation.js`: many touch listeners and possible listener duplication.
- `index.html`: inline SVG mask tile wave transition.
- `textrepellant.js`: many layout reads during pointer movement.
- `cube.js`: fixed interval loop.
- `game.js`: many animated character spans in optional mode.
- `style.css`, `about.css`, `pages.css`: heavy shadows, masks, filters, scanlines, and continuous decorative animations.
- `about.css`: About is accepted for the current alpha pass; later polish should focus on Tigrinya font consistency and large-screen QA, not another broad rewrite.

## Next Recommended Task

Next session or next phase today:

1. Read `AGENTS.md`, `docs/ai/HANDOFF.md`, `docs/ai/NEXT_ACTIONS.md`, and `docs/ai/DECISIONS.md`.
2. Check `git status`.
3. Visually verify Contact palette in the user's browser/device path; adjust if the aubergine/rose/coral direction is still not right.
4. Verify Mobile Page/nav on a small mobile viewport: hamburger X, elastic nav drop, footer visibility, no horizontal overflow.
5. Run final alpha smoke test across Main, About, Projects, Contact, and Mobile.
6. Update docs, commit, push, then deploy alpha.

## Prompt For The Next Codex Session

```text
Read AGENTS.md, docs/ai/HANDOFF.md, docs/ai/NEXT_ACTIONS.md, and docs/ai/DECISIONS.md. Continue the custom vanilla portfolio work from the current branch/status. Main, About, and Projects are good enough for the current pass. Contact page is in progress: the typewriter was removed and replaced with a Contact Relay/channel layout; the current color palette should be visually verified before alpha deploy. Preserve the handmade visual identity, avoid generic self-promotional copy, avoid new dependencies, and start by refining Contact colors and real contact links before moving to Mobile Page polish.
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

## Current Session State: 2026-06-26 Large Display QA

- Branch: `chore/predeploy-desktop-qa`.
- Large-display testing exposed three regressions from the old global `body` scale hack: CRT/noise/scan covered only part of the page, the main hide-and-seek circle was offset from the mouse, and game-mode text layout became distorted.
- The body transform was removed and CRT/noise/scan layers were pinned to the viewport with `100vw`, `100vh`, and `100dvh`. This restored correct behavior.
- A quick controlled wide-screen expansion using CSS variables was tested, but the Main page still shifted enough that it should not be shipped.
- Current alpha fallback: keep the stable laptop-width stage on large displays and handle true wide-display design in a later branch.
- Untracked `logo.png` may exist locally; it was not part of this QA work and should not be added unless the user explicitly wants it.
