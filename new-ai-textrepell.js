/**
 * Letter Wave Repel — spacing-safe version
 * - Only non-whitespace characters are wrapped in <span.class="char">
 * - Spaces remain native text nodes (no &nbsp;), preserving natural spacing/line breaks
 * - Animation/measurement iterate only over the wrapped characters
 */

function initLetterWave(selector = ".hover-text") {
  const para = document.querySelector(selector);
  if (!para) return;

  // --- Wrap only non-space characters ---
  const original = para.textContent; // capture original text
  para.textContent = ""; // clear paragraph
  const els = []; // array of animatable spans

  for (const ch of original) {
    if (/\s/.test(ch)) {
      // Keep whitespace as-is (space/newline/tab) so browser handles spacing naturally
      para.appendChild(document.createTextNode(ch));
    } else {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = ch;
      para.appendChild(span);
      els.push(span);
    }
  }

  // Physics state per wrapped character
  const state = els.map(() => ({ x0: 0, y0: 0, ox: 0, oy: 0, vx: 0, vy: 0 }));

  // Tunables
  const RADIUS = 140; // px
  const STRENGTH = 1200; // force scale
  const SPRING_K = 0.08; // spring back
  const DAMPING = 0.85; // velocity damping (0..1)
  const MAX_STEP = 20; // per-frame displacement clamp

  let mouseX = null,
    mouseY = null;
  let animId = null;
  let measured = false;

  function measure() {
    // Measure center point of each wrapped character in viewport coords
    for (let i = 0; i < els.length; i++) {
      const r = els[i].getBoundingClientRect();
      state[i].x0 = r.left + r.width / 2;
      state[i].y0 = r.top + r.height / 2;
    }
    measured = true;
  }

  // Pointer tracking
  document.addEventListener(
    "pointermove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!animId) animId = requestAnimationFrame(tick);
    },
    { passive: true }
  );

  document.addEventListener("pointerleave", () => {
    mouseX = null;
    mouseY = null;
    if (!animId) animId = requestAnimationFrame(tick);
  });

  // Recalculate baselines on resize (font metrics/layout can change)
  const ro = new ResizeObserver(() => {
    measure();
  });
  ro.observe(para);

  // Also re-measure after scroll because viewport-relative coords change
  window.addEventListener(
    "scroll",
    () => {
      measured = false;
      if (!animId) animId = requestAnimationFrame(tick);
    },
    { passive: true }
  );

  // Animation loop
  function tick() {
    if (!measured) measure();

    let anyActive = false;

    for (let i = 0; i < els.length; i++) {
      const s = state[i];

      // Repel if pointer is near
      if (mouseX !== null && mouseY !== null) {
        const dx = s.x0 - mouseX;
        const dy = s.y0 - mouseY;
        const dist = Math.hypot(dx, dy) || 1e-6;

        if (dist < RADIUS) {
          const falloff = 1 - dist / RADIUS; // 0..1
          const force = falloff * falloff * STRENGTH; // quadratic falloff
          const ax = (dx / dist) * force * 0.0015;
          const ay = (dy / dist) * force * 0.0015;
          s.vx += ax;
          s.vy += ay;
        }
      }

      // Spring back to origin
      s.vx += -s.ox * SPRING_K;
      s.vy += -s.oy * SPRING_K;

      // Damping
      s.vx *= DAMPING;
      s.vy *= DAMPING;

      // Integrate position
      let nextOx = s.ox + s.vx;
      let nextOy = s.oy + s.vy;

      // Clamp jumpiness
      const stepMag = Math.hypot(nextOx - s.ox, nextOy - s.oy);
      if (stepMag > MAX_STEP) {
        const ratio = MAX_STEP / stepMag;
        nextOx = s.ox + (nextOx - s.ox) * ratio;
        nextOy = s.oy + (nextOy - s.oy) * ratio;
      }

      const moving =
        Math.abs(s.vx) + Math.abs(s.vy) + Math.abs(nextOx) + Math.abs(nextOy) >
        0.05;
      anyActive = anyActive || moving;

      s.ox = nextOx;
      s.oy = nextOy;

      // Apply transform
      els[i].style.transform = `translate3d(${s.ox.toFixed(
        2
      )}px, ${s.oy.toFixed(2)}px, 0)`;
    }

    animId = anyActive ? requestAnimationFrame(tick) : null;
  }

  // Initial measure + tiny jitter so it's not perfectly static
  requestAnimationFrame(() => {
    measure();
    for (let i = 0; i < state.length; i++) {
      state[i].ox = (Math.random() - 0.5) * 0.2;
      state[i].oy = (Math.random() - 0.5) * 0.2;
    }
    animId = requestAnimationFrame(tick);
  });
}

// Go!
initLetterWave(".hover-text");
