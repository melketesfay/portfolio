# Next Actions: Portfolio Performance

## Purpose

Make the portfolio feel butter smooth on desktop and mobile while preserving the handmade interactive identity. This is not a redesign into a generic portfolio. The goal is to keep the custom browser-native features and change the implementation so the browser can render them reliably.

Current first branch: `docs/performance-plan`

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

- [ ] Start site with VS Code Live Server on port `5958`.
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

## Phase 1: Runtime Gating

Goal: stop animation code from running when it cannot be seen or used.

Tasks:

- [ ] Create a single source of truth for active page state.
- [ ] Ensure page-specific scripts check whether their page is active before doing work.
- [ ] Pause pointer/touch effects when the related element is not active.
- [ ] Avoid document-level listeners where element-level listeners are enough.
- [ ] Use `IntersectionObserver` or active-page events for effects that should pause offscreen.
- [ ] Keep decorative animations only if they are transform/opacity based and cheap.

Implementation rule:

- A hidden page may keep CSS state, but it should not keep measuring DOM nodes, processing pointer movement, or writing animation styles.

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

## Phase 3: Profile Strip Reveal

Goal: keep the digital shutter/rain reveal, but remove listener duplication and per-strip touch overhead.

Tasks:

- [ ] Replace per-strip touch listeners with one delegated pointer/touch handler on `.image-bottom`.
- [ ] Keep strip setup idempotent so calling setup again does not add duplicate listeners.
- [ ] Keep toggle behavior: switch which image is background and which is revealed.
- [ ] Prefer class changes or CSS variables over repeated long `style.cssText` writes.

Acceptance:

- Hover/touch still reveals alternate portrait strips.
- Toggle still changes visual mode.
- Repeated toggle changes do not multiply listeners.

## Phase 4: Wave Navigation

Goal: keep the rectangular tile wave where the current page disappears in a wave and reveals the target page.

Tasks:

- [ ] Keep visual behavior: page transition must read as a wave, not a plain fade.
- [ ] Reduce tile count on mobile if needed.
- [ ] Move inline wave logic from `index.html` into a module in a later implementation branch.
- [ ] Keep target page available underneath before the outgoing page finishes fading.
- [ ] Prevent overlapping transitions from building up animation state.
- [ ] Respect reduced motion with a quick fade or immediate page switch.

Acceptance:

- Navigation still feels like a digital wave transition.
- Mobile no longer shows severe flickering during page changes.
- Rapid repeated nav clicks do not corrupt page state.

## Phase 5: Text Effects And Spiral Text

Goal: preserve text personality without constant layout cost.

Text repel tasks:

- [ ] Keep rich repel on desktop.
- [ ] Disable or simplify on coarse pointer/mobile.
- [ ] Measure character positions only when layout changes, not every pointer move.
- [ ] Use transform-only writes for character movement.

Spiral text tasks:

- [ ] Keep double-helix upward movement.
- [ ] Confirm animation is transform-only.
- [ ] Reduce text count, shadow intensity, or animation complexity on mobile if needed.
- [ ] Respect reduced motion.

Acceptance:

- About page still feels interactive on desktop.
- Mobile remains readable and smooth.
- Spiral text still gives an upward rotating helix impression.

## Phase 6: Cube

Goal: keep the draggable 3D project object but stop unnecessary idle work.

Tasks:

- [ ] Replace fixed interval loop with RAF while dragging/inertia is active.
- [ ] Stop updates when torque/inertia falls below threshold.
- [ ] Do not process cube events when main page is hidden.
- [ ] Keep active-side highlighting.

Acceptance:

- Cube drag still feels physical.
- Cube does not consume continuous work when idle.

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
