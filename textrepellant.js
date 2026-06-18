(() => {
  const aboutPage = document.querySelector(".about-page");
  const textTargets = Array.from(
    document.querySelectorAll(".about-page-main .hover-text h3"),
  );
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  if (!aboutPage || textTargets.length === 0) return;

  const MAX_DISTANCE = 100;
  const MOVE_FACTOR = 30;
  const WAVE_DURATION_MS = 920;
  const WAVE_STAGGER_MS = 6;

  let letters = [];
  let letterPositions = [];
  let pointerX = 0;
  let pointerY = 0;
  let pointerInside = false;
  let repelFrame = null;
  let repelActive = false;
  let positionsDirty = true;
  let waveObserver = null;
  let waveBlocks = [];
  let activeWaveCount = 0;
  const waveTimers = new Map();
  const triggeredBlocks = new Set();

  function isAboutActive() {
    return window.portfolioPageState?.activePage === "about";
  }

  function wrapAboutText() {
    const blockIndexes = new Map();

    textTargets.forEach((target) => {
      if (target.dataset.repellantReady === "true") return;

      const block = target.closest(".hover-text") || target;
      const sourceText = target.textContent.trim();
      const wrappedHeading = document.createElement("h3");
      wrappedHeading.className = target.className;
      wrappedHeading.classList.add("span-text");
      wrappedHeading.style.whiteSpace = "normal";

      sourceText.split(/\s+/).forEach((word) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "word";

        word.split("").forEach((letter) => {
          const letterSpan = document.createElement("span");
          const letterIndex = blockIndexes.get(block) || 0;

          letterSpan.className = "repellant";
          letterSpan.textContent = letter;
          letterSpan.style.setProperty("--i", String(letterIndex));
          wordSpan.appendChild(letterSpan);
          blockIndexes.set(block, letterIndex + 1);
        });

        wrappedHeading.appendChild(wordSpan);
      });

      wrappedHeading.dataset.repellantReady = "true";
      target.parentNode.replaceChild(wrappedHeading, target);
    });

    letters = Array.from(aboutPage.querySelectorAll(".repellant"));
    waveBlocks = Array.from(aboutPage.querySelectorAll(".hover-text")).filter(
      (block) => block.querySelector(".repellant"),
    );
  }

  function measureLetters() {
    letterPositions = letters.map((letter) => {
      const rect = letter.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    });
    positionsDirty = false;
  }

  function resetLetters() {
    letters.forEach((letter) => {
      letter.style.transform = "";
    });
  }

  function drawRepel() {
    repelFrame = null;

    if (!repelActive || !isAboutActive()) return;

    if (positionsDirty) {
      measureLetters();
    }

    letters.forEach((letter, index) => {
      const pos = letterPositions[index];
      const distanceX = pos.x - pointerX;
      const distanceY = pos.y - pointerY;
      const distance = Math.hypot(distanceX, distanceY);

      if (!pointerInside || distance < 0.001 || distance >= MAX_DISTANCE) {
        letter.style.transform = "translate3d(0, 0, 0)";
        return;
      }

      const moveX =
        (distanceX / distance) *
        (MAX_DISTANCE - distance) *
        (MOVE_FACTOR / MAX_DISTANCE);
      const moveY =
        (distanceY / distance) *
        (MAX_DISTANCE - distance) *
        (MOVE_FACTOR / MAX_DISTANCE);

      letter.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  }

  function requestRepelDraw() {
    if (!repelFrame) {
      repelFrame = requestAnimationFrame(drawRepel);
    }
  }

  function handlePointerMove(event) {
    pointerX = event.clientX;
    pointerY = event.clientY;
    pointerInside = true;
    requestRepelDraw();
  }

  function handlePointerLeave() {
    pointerInside = false;
    requestRepelDraw();
  }

  function markPositionsDirty() {
    positionsDirty = true;
  }

  function enableRepel() {
    if (repelActive || !finePointer.matches || !isAboutActive()) return;

    repelActive = true;
    positionsDirty = true;
    measureLetters();
    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", markPositionsDirty, { passive: true });
    window.addEventListener("scroll", markPositionsDirty, { passive: true });
  }

  function disableRepel() {
    if (!repelActive) {
      resetLetters();
      return;
    }

    repelActive = false;
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerleave", handlePointerLeave);
    window.removeEventListener("resize", markPositionsDirty);
    window.removeEventListener("scroll", markPositionsDirty);

    if (repelFrame) {
      cancelAnimationFrame(repelFrame);
      repelFrame = null;
    }

    pointerInside = false;
    resetLetters();
  }

  function shouldTriggerBlock(block) {
    if (triggeredBlocks.has(block)) return false;

    const rect = block.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    return (
      rect.top < viewportHeight * 0.82 && rect.bottom > viewportHeight * 0.12
    );
  }

  function finishBlockWave(block) {
    waveTimers.delete(block);
    activeWaveCount = Math.max(0, activeWaveCount - 1);
    block.classList.remove("about-text-enter");

    if (activeWaveCount === 0 && isAboutActive() && finePointer.matches) {
      enableRepel();
    }
  }

  function triggerBlockWave(block) {
    if (!block || triggeredBlocks.has(block)) return;

    triggeredBlocks.add(block);
    if (repelActive) {
      disableRepel();
    }
    activeWaveCount++;

    window.clearTimeout(waveTimers.get(block));
    block.classList.remove("about-text-enter");
    void block.offsetWidth;
    block.classList.add("about-text-enter");

    const letterCount = block.querySelectorAll(".repellant").length;
    const totalDuration = WAVE_DURATION_MS + letterCount * WAVE_STAGGER_MS;
    waveTimers.set(
      block,
      window.setTimeout(() => finishBlockWave(block), totalDuration),
    );
  }

  function triggerVisibleBlockWaves() {
    if (!isAboutActive()) return;

    waveBlocks.forEach((block) => {
      if (shouldTriggerBlock(block)) {
        triggerBlockWave(block);
      }
    });
  }

  function startViewportWaves() {
    stopViewportWaves();
    triggeredBlocks.clear();

    if ("IntersectionObserver" in window) {
      waveObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              triggerBlockWave(entry.target);
              waveObserver?.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          threshold: 0.28,
          rootMargin: "0px 0px -12% 0px",
        },
      );

      waveBlocks.forEach((block) => waveObserver.observe(block));
    }

    requestAnimationFrame(triggerVisibleBlockWaves);
  }

  function stopViewportWaves() {
    if (waveObserver) {
      waveObserver.disconnect();
      waveObserver = null;
    }

    waveTimers.forEach((timer) => window.clearTimeout(timer));
    waveTimers.clear();
    activeWaveCount = 0;
    waveBlocks.forEach((block) => {
      block.classList.remove("about-text-enter");
    });
  }

  function handlePageChange(event) {
    if (event.detail?.previousPage === "about") {
      stopViewportWaves();
      disableRepel();
    }
  }

  function handlePageRevealed(event) {
    if (event.detail?.activePage !== "about") return;
    startViewportWaves();
  }

  function handlePointerModeChange() {
    disableRepel();
    if (isAboutActive() && finePointer.matches) {
      enableRepel();
    }
  }

  wrapAboutText();
  document.addEventListener("portfolio:pagechange", handlePageChange);
  document.addEventListener("portfolio:pagerevealed", handlePageRevealed);

  if (finePointer.addEventListener) {
    finePointer.addEventListener("change", handlePointerModeChange);
  } else {
    finePointer.addListener(handlePointerModeChange);
  }
})();
