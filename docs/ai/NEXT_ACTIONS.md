# Next Actions: Portfolio Performance

## Purpose

Make the portfolio feel butter smooth on desktop and mobile while preserving the handmade interactive identity. This is not a redesign into a generic portfolio. The goal is to keep the custom browser-native features and change the implementation so the browser can render them reliably.

Current implementation branch: `perf/mobile-animation-runtime`

Recommended implementation branches after this documentation branch:

- `perf/mobile-animation-runtime`
- `perf/profile-reveal`
- `perf/wave-transition`
- `perf/text-effects`
- `perf/cube-idle-loop`
- `perf/final-performance-qa`

## Visual Model To Preserve

- Retro CRT atmosphere: noise GIF, scanlines, dark purple/red/orange palette, glowing shadows, custom cursor.
- Layered page system: main, about, projects, contact, and mobile nav are stacked sections, not separate pages.
- Navigation wave: selecting another page makes the current page fade away in a rectangular tile wave, revealing the clicked page underneath.
- Hero spotlight: the visible frontend/design hero hides a backend/full-stack layer, revealed through a circular cursor/touch spotlight.
- Profile strip reveal: the portrait is split into vertical strips that reveal/hide an alternate image like a digital shutter.
- Project cube: a draggable 3D cube acts as a project/category selector.
- Spiral text: technology words move upward while rotating around the vertical axis, creating a double-helix illusion.
- About page text: letters/words repel from the cursor.
- Zurich image reveal: a circular mask reveals color over a grayscale Zurich image.
- Contact page: large text types out with a typewriter feel.
- Game mode: toggle can activate a playful text/keyboard interaction with score and explosion feedback.

## Success Criteria

- Desktop interactions feel smooth in modern Chrome/Edge, Firefox, and Safari.
- Mobile no longer flickers badly during navigation or hero interaction.
- Mobile keeps the same identity, even when effects use cheaper fallbacks.
- Hidden pages do not keep processing their page-specific animation logic.
- No framework or dependency is added.
- Major animation removals require a documented measurement and reason.

Target quality:

- No obvious jank during common interactions.
- No scroll blocking from global touch handlers.
- No uncontrolled listener duplication after toggles or page switches.
- Animation code is understandable enough to continue safely in later branches.

## Current Known Risks

These are suspected hotspots from the current codebase and must be confirmed during audit.

- `hide-and-seek.js` uses an always-running `requestAnimationFrame` loop and moves `clip-path`.
- `hide-and-seek.js` uses global touch handling with `preventDefault()`, which can fight mobile scrolling.
- `image-animation.js` attaches touch listeners inside loops and can duplicate listeners after toggle changes.
- `textrepellant.js` measures many letters with `getBoundingClientRect()` during pointer movement.
- The inline wave transition in `index.html` animates many SVG mask rect opacity values from JavaScript.
- `cube.js` updates on a fixed interval and can keep doing work while idle or offscreen.
- Several scripts attach document-level listeners without checking active page state.
- Heavy visual styles such as large text shadows, GIF noise, masks, filters, and clip paths may amplify paint cost.

## Baseline Audit Checklist

Record results here before changing animation behavior.

- [x] Start site with VS Code Live Server on port `5958`.
- [ ] Capture desktop screenshot of main page.
- [ ] Capture mobile viewport screenshot of main page.
- [ ] Test wave navigation: main -> about -> projects -> contact -> main.
- [ ] Test hero spotlight on desktop.
- [ ] Test hero spotlight/touch behavior on mobile viewport.
- [ ] Test profile strip reveal.
- [ ] Test cube drag/inertia.
- [ ] Test spiral text movement.
- [ ] Test about text repel and Zurich reveal.
- [ ] Test contact typewriter.
- [ ] Test game mode toggle.

Baseline notes table:

| Area | Desktop Result | Mobile Result | Suspected Cause | Priority |
| --- | --- | --- | --- | --- |
| Wave navigation | TBD | TBD | SVG mask rect animation | High |
| Hero spotlight | TBD | TBD | Moving `clip-path` and always-on RAF | High |
| Profile reveal | TBD | TBD | Many listeners and style writes | High |
| Cube | TBD | TBD | Fixed interval loop | Medium |
| Spiral text | TBD | TBD | Large continuous transform/text animation | Medium |
| Text repel | TBD | TBD | Many layout reads on pointer move | Medium |
| Contact typewriter | TBD | TBD | Interval text mutation and scroll | Low |
| Game mode | TBD | TBD | Many animated spans | Optional |

Initial code audit notes:

- 2026-06-18: `hide-and-seek.js` had a permanent RAF loop, global touchmove, touch `preventDefault()`, and repeated Zurich listeners.
- 2026-06-18: Live Server runs on the remote Mac mini through VS Code/phone port forwarding; shell-side localhost checks may not reflect the Windows laptop/ADB path.
- 2026-06-18: Concurrent mobile costs remain significant: `image-animation.js` adds body `touchmove` listeners inside per-strip loops, `cube.js` runs a fixed interval and prevents touch default on cube moves, `textrepellant.js` does layout reads for many letters on document mousemove, and CSS has persistent GIF noise, scanline, masks, spiral animation, and heavy shadows.
- 2026-06-18: Fast mobile scrolling still shows random white/unrendered areas and flicker, and the user reports it can get worse after clicking the main toggle repeatedly.
- 2026-06-18: The flicker becomes significantly worse after opening the hamburger/mobile nav and triggering the wave animation.
- 2026-06-18: Current smoothness observations are with CRT/noise/scanline layers disabled; reintroduce those effects carefully later or keep a cheaper version.

## Phase 1: Runtime Gating

Goal: stop animation code from running when it cannot be seen or used.

Tasks:

- [x] Create a single source of truth for active page state.
- [ ] Ensure all page-specific scripts check whether their page is active before doing work.
- [x] Pause all pointer/touch effects when the related element is not active.
- [ ] Avoid document-level listeners where element-level listeners are enough.
- [x] Use `IntersectionObserver` or active-page events for effects that should pause offscreen.
- [ ] Keep decorative animations only if they are transform/opacity based and cheap.

Implementation rule:

- A hidden page may keep CSS state, but it should not keep measuring DOM nodes, processing pointer movement, or writing animation styles.

Progress:

- 2026-06-18: `hide-and-seek.js`, `textrepellant.js`, `cube.js`, and spiral text now use active-page events and/or `IntersectionObserver` to stop page-specific work while hidden/offscreen.
- 2026-06-18: Final runtime scan after cube/spiral gating: no cube interval remains; spiral animation is class-gated; remaining always-present items are page-level event listeners, disabled/unused legacy scripts not loaded by `index.html`, coffee steam CSS, and the contact typewriter interval after start.

## Phase 2: Hero Spotlight

Goal: preserve the frontend/backend reveal metaphor while removing mobile flicker.

Desktop behavior:

- Keep cursor-following circular reveal.
- Use `requestAnimationFrame` only while pointer is inside `#top-layer`.
- Cache the target rect on pointer enter and refresh on resize/page change.
- Write CSS variables once per frame.

Mobile behavior:

- Use a cheaper fallback by default.
- Preferred fallback: tap/press reveals a fixed or lightly-positioned circle without tracking every touchmove.
- Do not globally block scrolling.
- Use `pointerdown`, `pointerup`, and `pointercancel` where possible.

Acceptance:

- Desktop spotlight still communicates hidden backend/full-stack layer.
- Mobile does not flicker or block scroll.
- No permanent RAF loop remains for this feature.

Progress:

- 2026-06-18: Added `window.portfolioPageState` and `portfolio:pagechange` in `index.html`.
- 2026-06-18: Replaced `hide-and-seek.js` permanent RAF with interaction-driven RAF.
- 2026-06-18: Removed global touchmove and touch `preventDefault()` from the spotlight path.
- 2026-06-18: Mobile spotlight now uses tap/press reveal instead of continuous touch tracking.
- 2026-06-18: Zurich image reveal now uses stable pointer listeners and RAF batching instead of adding listeners after clicks.
- 2026-06-18: Android mobile still showed `clip-path` flicker/square artifacts, so mobile spotlight was switched to a transformed circular lens with overflow hidden.
- 2026-06-18: Mobile transformed lens improved alignment but still showed inconsistent rendering under movement, likely because Android is repainting clipped live DOM while other page animations/listeners are active.

## Phase 3: Profile Strip Reveal

Goal: keep the digital shutter/rain reveal, but remove listener duplication and per-strip touch overhead.

Tasks:

- [x] Replace per-strip touch listeners with one delegated pointer/touch handler on `.image-bottom`.
- [x] Keep strip setup idempotent so calling setup again does not add duplicate listeners.
- [x] Keep toggle behavior: switch which image is background and which is revealed.
- [x] Prefer class changes or CSS variables over repeated long `style.cssText` writes.

Acceptance:

- Hover/touch still reveals alternate portrait strips.
- Toggle still changes visual mode.
- Repeated toggle changes do not multiply listeners.

Progress:

- 2026-06-18: Rewrote `image-animation.js` as one idempotent module with delegated pointer events on `.image-bottom`.
- 2026-06-18: Removed body-level `touchmove` listeners and per-strip listener duplication.
- 2026-06-18: Kept the two-image strip reveal concept and toggle mode.
- 2026-06-18: Restored swipe-paint behavior across multiple strips, added `touch-action: none` on the image surface, and restored original single-value background sizing to avoid vertical image distortion.
- 2026-06-18: Restored per-strip timing feel: previous stripes begin their fade-back timer as the pointer enters the next stripe instead of waiting for touch end.
- 2026-06-18: User confirmed the profile strip reveal is the first full success: it preserves the intended feel and is smoother than the original.

## Phase 3.5: Toggle And Game Runtime

Goal: prevent repeated toggle clicks from multiplying global work or triggering expensive mobile-only rendering problems.

Tasks:

- [x] Make game mode start/stop idempotent.
- [x] Remove `mousemove` and `keydown` listeners when game mode stops.
- [x] Keep game mode desktop/fine-pointer only.
- [x] Disable whole-page `.darkMode` filter on coarse pointer/mobile.
- [x] Remove `corners-animation.js` dependency on the old global `toggle` variable.
- [ ] Retest fast mobile scroll before and after repeated toggle clicks.

Progress:

- 2026-06-18: Reworked `game.js` into one scoped module with explicit `startGame()` and `stopGame()` cleanup.
- 2026-06-18: Game mode now uses the current aside text element after DOM replacement, so toggling off/on does not rely on stale references.
- 2026-06-18: Main toggle still controls profile image mode, but the expensive text game and body filter are avoided on mobile/coarse pointer.

## Phase 4: Wave Navigation

Goal: keep the rectangular tile wave where the current page disappears in a wave and reveals the target page.

Tasks:

- [ ] Keep visual behavior: page transition must read as a wave, not a plain fade.
- [x] Reduce tile count on mobile if needed.
- [ ] Move inline wave logic from `index.html` into a module in a later implementation branch.
- [x] Keep target page available underneath before the outgoing page finishes fading.
- [x] Prevent overlapping transitions from building up animation state.
- [ ] Respect reduced motion with a quick fade or immediate page switch.

Acceptance:

- Navigation still feels like a digital wave transition.
- Mobile no longer shows severe flickering during page changes.
- Rapid repeated nav clicks do not corrupt page state.

Progress:

- 2026-06-18: Wave transition now masks only the outgoing page; the target page is visible underneath unmasked.
- 2026-06-18: Page masks are removed outside transitions, inactive pages are hidden, and persistent `will-change` pressure is disabled on page shells.
- 2026-06-18: Mobile wave grid is reduced from 12x12 to 7x7 tiles with shorter stagger/duration.
- 2026-06-18: Hamburger click handling is consolidated into one inline handler, so the mobile nav no longer fires competing open/close page changes.
- 2026-06-18: Added a dark root background so any remaining compositor checkerboarding is not a white flash.
- 2026-06-18: Corrected the wave model after testing: every transition now keeps exactly two visible page layers, with the outgoing page locked above the incoming page so it can disappear in a tile wave and reveal the target.
- 2026-06-18: Added a hidden measurement state so `makePageSameHeight()` does not collapse page heights when `.main-page` is currently not displayed.
- 2026-06-18: Tried a transition-only outgoing-page tint for wave readability, then removed it; keep route-based wave direction and revisit page color/contrast later instead.
- 2026-06-18: Observed that repeating the target nav click during a wave could cancel the animation and show the target instantly; added a guard so repeated target clicks are ignored while the wave is active.
- 2026-06-18: Added route-based wave origins so adjacent, jump, and mobile transitions can start from different corners without adding new DOM or paint layers.

## Phase 5: Text Effects And Spiral Text

Goal: preserve text personality without constant layout cost.

Text repel tasks:

- [ ] Keep rich repel on desktop.
- [x] Disable or simplify on coarse pointer/mobile.
- [x] Measure character positions only when layout changes, not every pointer move.
- [x] Use transform-only writes for character movement.

Spiral text tasks:

- [ ] Keep double-helix upward movement.
- [x] Confirm animation is transform-only.
- [x] Reduce text count, shadow intensity, or animation complexity on mobile if needed.
- [ ] Respect reduced motion.

Acceptance:

- About page still feels interactive on desktop.
- Mobile remains readable and smooth.
- Spiral text still gives an upward rotating helix impression.

Progress:

- 2026-06-18: Added `portfolio:pagerevealed` so page effects can start after the wave reveal actually finishes.
- 2026-06-18: Reworked `textrepellant.js` so mobile/coarse pointer never attaches repel pointer listeners.
- 2026-06-18: Added one-shot transform-only about text waves that run per text block when the block enters the viewport.
- 2026-06-18: Desktop about text repel now attaches only while the about page is active and after active text-block waves finish; it removes listeners when leaving the page.
- 2026-06-18: Spiral text animation now runs only when the main page is active and the spiral section is in the viewport.
- 2026-06-18: Spiral text now uses negative stagger delays so the helix is already populated when the section enters the viewport instead of starting from an empty state.
- 2026-06-18: Spiral text now prewarms before the section reaches the viewport so fast scrolling is less likely to show an empty dark spiral area.

## Phase 6: Cube

Goal: keep the draggable 3D project object but stop unnecessary idle work.

Tasks:

- [x] Replace fixed interval loop with RAF while dragging/inertia is active.
- [x] Stop updates when torque/inertia falls below threshold.
- [x] Do not process cube events when main page is hidden.
- [x] Keep active-side highlighting.

Acceptance:

- Cube drag still feels physical.
- Cube does not consume continuous work when idle.

Progress:

- 2026-06-18: Removed the fixed cube `setInterval` and replaced it with a self-stopping RAF loop.
- 2026-06-18: Cube loop now starts on drag/inertia and pauses when the cube is idle, offscreen, or the main page is hidden.

## Phase 7: Final QA

Desktop checks:

- [ ] Main page loads with CRT identity intact.
- [ ] Header nav links work.
- [ ] Wave transition works between all pages.
- [ ] Hero spotlight works.
- [ ] Profile reveal works.
- [ ] Cube works.
- [ ] Spiral text works.
- [ ] Projects cards hover/focus correctly.
- [ ] Contact typewriter works.

Mobile checks:

- [ ] Hamburger opens mobile nav page.
- [ ] Mobile nav links route correctly.
- [ ] Wave transition is usable without heavy flicker.
- [ ] Hero reveal fallback is usable.
- [ ] Page scroll is not blocked by animation listeners.
- [ ] Text does not overlap in a broken way.

Reduced motion checks:

- [ ] Major motion-heavy effects degrade gracefully.
- [ ] Navigation remains understandable.

## Branch And Commit Tracking

| Branch | Purpose | Suggested Commit |
| --- | --- | --- |
| `docs/performance-plan` | Add durable Codex context and project tracking | `docs: add portfolio performance plan` |
| `perf/mobile-animation-runtime` | Active-page gating and hero spotlight optimization | `perf: gate mobile animation runtime` |
| `perf/profile-reveal` | Rewrite profile strip interaction | `perf: optimize profile reveal listeners` |
| `perf/wave-transition` | Optimize tile wave transition | `perf: optimize page wave transition` |
| `perf/text-effects` | Optimize text repel and spiral text | `perf: reduce text effect layout cost` |
| `perf/cube-idle-loop` | Stop cube updates when idle | `perf: pause cube loop when idle` |
| `perf/final-performance-qa` | Final polish and documented audit results | `perf: complete portfolio animation qa` |

## Decision Source

Locked decisions live in `docs/ai/DECISIONS.md`. Update that file when a scope or tradeoff decision changes.

## Handoff Prompt Template

Use this prompt when starting the next Codex session:

```text
Read AGENTS.md, docs/ai/HANDOFF.md, docs/ai/NEXT_ACTIONS.md, and docs/ai/DECISIONS.md first. Continue the portfolio performance optimization from the current branch/status. Preserve the custom visual identity. Do not remove major animations unless the tracking files record why. Start by checking git status and the current phase checklist, then implement the next unchecked task with focused changes and verification.
```
