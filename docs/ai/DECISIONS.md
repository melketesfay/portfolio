# Decisions

This file records durable project decisions that future Codex sessions should not rediscover or override casually.

## 2026-06-16: Preserve The Handmade Portfolio Identity

Decision:

- Keep the custom retro/CRT visual language and handmade vanilla JavaScript interactions as the core value of the portfolio.

Reason:

- The site is meant to prove frontend craft and originality, not become a generic smooth template.

Implication:

- Performance work should optimize implementations before removing features.
- Major animation removal requires documented evidence that a cheaper implementation is still not acceptable.

## 2026-06-16: Use Root AGENTS.md Plus docs/ai Project Memory

Decision:

- Keep `AGENTS.md` in the Git root.
- Keep durable handoff and tracking files under `docs/ai/`.

Reason:

- Codex auto-discovers root `AGENTS.md`.
- `docs/ai/` keeps longer project memory organized without overloading root instructions.

Implication:

- Future sessions should read `AGENTS.md`, `docs/ai/HANDOFF.md`, `docs/ai/NEXT_ACTIONS.md`, and this file before performance work.

## 2026-06-16: First Branch Is Documentation Only

Decision:

- The first branch is `docs/performance-plan`.
- It should contain handoff/tracking documentation and `.gitignore` cleanup only.

Reason:

- The performance project needs stable context before source changes begin.

Implication:

- Do not mix animation implementation changes into this branch.

## 2026-06-16: Use GitHub Flow And Conventional Commits

Decision:

- `main` is the trunk branch.
- Use short-lived branches.
- Use Conventional Commit prefixes such as `docs:`, `perf:`, `fix:`, `feat:`, and `chore:`.

Reason:

- The project should stay easy to review and continue across machines.

Implication:

- Prefer branch names like `perf/mobile-animation-runtime`, `perf/wave-transition`, and `fix/spotlight-touch-jank`.

## 2026-06-16: Mobile May Use Cheaper Fallbacks

Decision:

- Desktop can keep richer versions of effects.
- Mobile may use cheaper versions when full effects cause jank or flicker.

Reason:

- The design identity matters, but mobile smoothness and usability are required.

Implication:

- Accept tap/press reveal, reduced tile counts, disabled text repel, or simpler decorative motion on mobile when measured performance requires it.

## 2026-06-16: No Framework Rewrite

Decision:

- Do not rewrite the portfolio in React, Vue, Tailwind, GSAP, Three.js, or another framework/library.
- Do not add new dependencies unless the user explicitly approves.

Reason:

- The no-framework, low-dependency approach is part of the portfolio message.

Implication:

- Prefer browser-native APIs, focused modules, CSS transforms, and careful runtime gating.

## 2026-06-19: About Page Tone Must Stay Grounded

Decision:

- The About page should sound personal, honest, and specific.
- Avoid self-promotional or pretentious phrasing.
- Do not imply that the user is better because they started programming later.
- Do not describe Frontend as the user's only long-term focus.

Reason:

- The user wants the portfolio to show individuality without sounding inflated.
- The actual long-term goal is to build deep expertise in Cyber Security while keeping strong Web/Full Stack skills.

Implication:

- About copy may mention Full Stack/Web, Backend, Infrastructure, Security, and the part-time Cyber Security study at HSLU.
- It may mention philosophy, hiking in the Alps, and the long personal effort behind the portfolio.
- Keep the handmade/non-generic portfolio message, but do not frame it as anti-AI posturing.

## 2026-06-19: Main Page Is Tentatively Accepted, About Page Is Not

Decision:

- Treat the current Main page as a good checkpoint for laptop/mobile testing.
- Do not treat the current About page layout as accepted.

Reason:

- The user explicitly said the Main page feels done for now except later big-screen QA.
- The current About layout became worse after adding the fourth personal text block.

Implication:

- Next session should start with About layout/content.
- Do not keep patching the About layout with fragile `nth-child`/wrap tweaks. Prefer a deliberate layout structure.
- Large-screen QA for the Main page remains required before deployment.

## 2026-06-19: Game Toggle Behavior

Decision:

- Desktop game mode may detach letters from the aside text, but it must not shift the paragraph layout.
- Mobile toggle should not run the desktop game.
- Mobile toggle may run a lightweight helium-letter burst when switched on.
- Switching the toggle off or clicking the logo/home should restore the normal mobile text.

Reason:

- The desktop game is part of the custom playful identity.
- On mobile the full game does not make sense, but the toggle should still have a small meaningful effect.

Implication:

- Keep desktop game interactions overlay/transform-based.
- Keep mobile toggle animation one-shot and non-running after completion.
- Do not reintroduce layout-affecting font/position changes in the real paragraph flow.

## 2026-06-25: Page Color Identities Are Intentional

Decision:

- Pages may use distinct color palettes so the wave transition is more visible and each section has its own story.
- Palettes should still feel like one CRT/glow system, not random unrelated themes.

Reason:

- Similar page colors made the rectangular wave transition read like a plain fade.
- Distinct page color identities help the site feel more designed and make navigation transitions easier to perceive.

Implication:

- Main, About, Projects, Contact, and Mobile Page can have separate CSS variables.
- Keep shared typography, glow logic, footer/nav structure, and CRT atmosphere consistent.
- Refine Contact palette next; current Contact colors are not accepted yet.

## 2026-06-25: Contact Typewriter Removed

Decision:

- Remove the Contact page typewriter behavior from the runtime.
- Replace it with a more designed Contact Relay/channel interface.
- Do not use LinkedIn as a contact channel unless the user later creates and explicitly wants one.

Reason:

- The typewriter effect felt too trivial compared to the rest of the handmade site.
- The user does not have and likely does not want LinkedIn.

Implication:

- `typing-animation.js` may remain in the repo for now, but `index.html` should not load it.
- Preferred contact channels are email, GitHub, CodePen, personal website, or another authentic channel.
- Before deployment, replace placeholder contact URLs with final real links.

## 2026-06-26: Alpha Contact And Mobile Direction

Decision:

- Contact uses the Contact Relay/channel layout, not typewriter text.
- For alpha, footer and contact links are consolidated to email, GitHub, CodePen, and Mastodon.
- Mobile Page/nav may use a deliberate standalone palette and layout instead of inheriting a page color dynamically.

Reason:

- The alpha needs working links and a stable mobile navigation surface.
- Dynamic color inheritance for the mobile menu is less important than a predictable, polished nav page for the first deploy.

Implication:

- CodePen URL is confirmed by the user for alpha.
- Continue to keep Contact and Mobile Page colors within the shared CRT/glow system.

## 2026-06-26: Alpha Social Links And Image Framing

Decision:

- Replace the self-linking website/globe social with Mastodon for alpha.
- Use Mastodon as a security-community signal, using expected URL `https://infosec.exchange/@melketesfay`; the user created username `melketesfay` on `infosec.exchange`, with approval pending.
- Reduce smooth photo radii and use sharper display-like frames/corner accents for the profile and About city images.

Reason:

- Linking from the portfolio to the same website does not add value.
- Mastodon fits the user's intended security/community direction better than a generic website icon.
- The sharper image treatment better matches the CRT/cyber display language than soft app-card radii.

Implication:

- If Mastodon approval changes the final account URL, update the single profile URL before public launch.
- Keep image frames geometric and lightweight; do not turn images into soft rounded cards.

## 2026-06-26: Tigrinya Font Consistency

Decision:

- Use `Abyssinica SIL` for the visible Tigrinya/Ethiopic glyphs in the Main and About pages.
- Apply the font only through the Ethiopic-specific classes, not globally.
- Keep fallback fonts in the stack: `Noto Serif Ethiopic`, `Noto Sans Ethiopic`, and `serif`.

Reason:

- Browser/device fallback fonts rendered the Tigrinya characters inconsistently.
- The user prefers the more characterful serif look of `Abyssinica SIL` over `Noto Sans Ethiopic`.
- An explicit Ethiopic-capable font makes the personal glyph treatment more stable without changing the rest of the site's typography.

Implication:

- Current alpha uses Google Fonts because the site already depends on Google Fonts.
- Before final launch, decide whether to self-host the Ethiopic font files for stronger consistency and fewer external dependencies.
