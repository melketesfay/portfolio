(() => {
  const topLayer = document.getElementById("top-layer");
  const downLayer = document.getElementById("down-layer");
  const mainPage = document.querySelector(".main-page");
  const aboutPage = document.querySelector(".about-page");
  const zuerich = document.querySelector(".about-page-main-top-image");
  const zuerichTopImg = document.getElementById("zuerich-top-img");
  const zuerichBottomImg = document.getElementById("zuerich-bottom-img");

  if (!topLayer || !downLayer || !mainPage) return;

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const mobileLens = coarsePointer && !reducedMotion;

  const desktopRadius = reducedMotion ? "0px" : "80px";
  let spotlightFrame = 0;
  let spotlightRect = null;
  let spotlightActive = false;
  let pointerX = 0;
  let pointerY = 0;
  let resetWillChangeTimer = 0;
  let touchCloseTimer = 0;
  let touchPointerId = null;
  let activeRadius = desktopRadius;
  let activeLensSize = 0;
  let lastLensLeft = null;
  let lastLensTop = null;

  downLayer.classList.toggle("is-mobile-lens", mobileLens);

  function isMainActive() {
    return mainPage.classList.contains("page-active");
  }

  function isAboutActive() {
    return aboutPage?.classList.contains("page-active");
  }

  function getLensSize() {
    return Math.round(Math.min(Math.max(window.innerWidth * 0.38, 128), 156));
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function setSpotlightWillChange(active) {
    clearTimeout(resetWillChangeTimer);
    downLayer.style.willChange = active
      ? mobileLens
        ? "transform, opacity"
        : "clip-path"
      : "auto";
  }

  function setSpotlightPosition(event) {
    if (!spotlightRect) {
      spotlightRect = downLayer.getBoundingClientRect();
    }

    pointerX = event.clientX;
    pointerY = event.clientY;
    requestSpotlightDraw();
  }

  function closeSpotlight() {
    clearTimeout(touchCloseTimer);
    spotlightActive = false;
    downLayer.classList.remove("is-open");
    downLayer.style.setProperty("--r", "0px");
    resetWillChangeTimer = window.setTimeout(() => {
      setSpotlightWillChange(false);
    }, 300);
  }

  function closeTouchSpotlight(delay = 800) {
    spotlightActive = false;
    touchPointerId = null;
    clearTimeout(touchCloseTimer);
    touchCloseTimer = window.setTimeout(closeSpotlight, delay);
  }

  function drawSpotlight() {
    spotlightFrame = 0;
    if (!spotlightActive || !isMainActive()) return;

    if (!spotlightRect) {
      spotlightRect = topLayer.getBoundingClientRect();
    }

    if (mobileLens) {
      const maxLeft = Math.max(0, spotlightRect.width - activeLensSize);
      const maxTop = Math.max(0, spotlightRect.height - activeLensSize);
      const lensLeft = clamp(
        Math.round(pointerX - spotlightRect.left - activeLensSize / 2),
        0,
        maxLeft,
      );
      const lensTop = clamp(
        Math.round(pointerY - spotlightRect.top - activeLensSize / 2),
        0,
        maxTop,
      );

      if (
        lastLensLeft !== null &&
        Math.abs(lensLeft - lastLensLeft) < 2 &&
        Math.abs(lensTop - lastLensTop) < 2
      ) {
        return;
      }

      lastLensLeft = lensLeft;
      lastLensTop = lensTop;
      downLayer.style.setProperty("--lens-left", `${lensLeft}px`);
      downLayer.style.setProperty("--lens-top", `${lensTop}px`);
      downLayer.style.setProperty("--lens-content-x", `${-lensLeft}px`);
      downLayer.style.setProperty("--lens-content-y", `${-lensTop}px`);
      downLayer.classList.add("is-open");
      return;
    }

    downLayer.style.setProperty("--x", `${pointerX - spotlightRect.left}px`);
    downLayer.style.setProperty("--y", `${pointerY - spotlightRect.top}px`);
    downLayer.style.setProperty("--r", activeRadius);
  }

  function requestSpotlightDraw() {
    if (!spotlightFrame) {
      spotlightFrame = requestAnimationFrame(drawSpotlight);
    }
  }

  function handleDesktopEnter(event) {
    if (coarsePointer || !isMainActive()) return;

    spotlightActive = true;
    activeRadius = desktopRadius;
    spotlightRect = downLayer.getBoundingClientRect();
    setSpotlightWillChange(true);
    setSpotlightPosition(event);
  }

  function handleDesktopMove(event) {
    if (coarsePointer || !spotlightActive || !isMainActive()) return;

    setSpotlightPosition(event);
  }

  function handleTouchReveal(event) {
    if (!coarsePointer || !isMainActive() || event.pointerType === "mouse") {
      return;
    }

    clearTimeout(touchCloseTimer);
    touchPointerId = event.pointerId;
    spotlightActive = true;
    activeLensSize = getLensSize();
    lastLensLeft = null;
    lastLensTop = null;
    spotlightRect = topLayer.getBoundingClientRect();
    downLayer.style.setProperty("--lens-size", `${activeLensSize}px`);
    downLayer.style.setProperty(
      "--spotlight-host-width",
      `${Math.round(spotlightRect.width)}px`,
    );
    downLayer.style.setProperty(
      "--spotlight-host-height",
      `${Math.round(spotlightRect.height)}px`,
    );
    setSpotlightWillChange(true);
    downLayer.classList.remove("is-open");
    setSpotlightPosition(event);

    requestAnimationFrame(() => {
      if (!mobileLens && spotlightActive && isMainActive()) {
        downLayer.style.setProperty("--r", activeRadius);
      }
    });

    if (topLayer.setPointerCapture) {
      topLayer.setPointerCapture(event.pointerId);
    }
  }

  function handleTouchMove(event) {
    if (
      !coarsePointer ||
      !spotlightActive ||
      !isMainActive() ||
      event.pointerId !== touchPointerId
    ) {
      return;
    }

    setSpotlightPosition(event);
  }

  function handleTouchEnd(event) {
    if (
      !coarsePointer ||
      event.pointerType === "mouse" ||
      event.pointerId !== touchPointerId
    ) {
      return;
    }

    if (
      topLayer.releasePointerCapture &&
      topLayer.hasPointerCapture?.(event.pointerId)
    ) {
      topLayer.releasePointerCapture(event.pointerId);
    }

    closeTouchSpotlight();
  }

  topLayer.addEventListener("pointerenter", handleDesktopEnter);
  topLayer.addEventListener("pointermove", handleDesktopMove, {
    passive: true,
  });
  topLayer.addEventListener("pointermove", handleTouchMove, {
    passive: true,
  });
  topLayer.addEventListener("pointerleave", () => {
    if (!coarsePointer) closeSpotlight();
  });
  topLayer.addEventListener("pointerdown", handleTouchReveal, {
    passive: true,
  });
  topLayer.addEventListener("pointerup", handleTouchEnd, { passive: true });
  topLayer.addEventListener("pointercancel", handleTouchEnd, {
    passive: true,
  });

  window.addEventListener(
    "resize",
    () => {
      spotlightRect = null;
    },
    { passive: true },
  );

  const pageObserver = new MutationObserver(() => {
    if (!isMainActive()) {
      closeSpotlight();
    }
  });
  pageObserver.observe(mainPage, {
    attributes: true,
    attributeFilter: ["class"],
  });

  document.addEventListener("portfolio:pagechange", (event) => {
    spotlightRect = null;
    if (event.detail?.activePage !== "main") {
      closeSpotlight();
    }
  });

  if (!zuerich || !zuerichTopImg || !zuerichBottomImg) return;

  let zurichFrame = 0;
  let zurichRect = null;
  let zurichX = 0;
  let zurichY = 0;

  function drawZurichReveal() {
    zurichFrame = 0;
    if (!isAboutActive()) return;

    if (!zurichRect) {
      zurichRect = zuerich.getBoundingClientRect();
    }

    const x = `${zurichX - zurichRect.left}px`;
    const y = `${zurichY - zurichRect.top}px`;
    zuerichTopImg.style.setProperty("--x", x);
    zuerichTopImg.style.setProperty("--y", y);
    zuerichBottomImg.style.setProperty("--x", x);
    zuerichBottomImg.style.setProperty("--y", y);
  }

  function requestZurichDraw(event) {
    if (!isAboutActive()) return;

    zurichX = event.clientX;
    zurichY = event.clientY;
    if (!zurichFrame) {
      zurichFrame = requestAnimationFrame(drawZurichReveal);
    }
  }

  zuerich.addEventListener("pointerenter", (event) => {
    zurichRect = zuerich.getBoundingClientRect();
    requestZurichDraw(event);
  });
  zuerich.addEventListener("pointermove", requestZurichDraw, {
    passive: true,
  });
  zuerich.addEventListener("pointerleave", () => {
    zurichRect = null;
  });

  window.addEventListener(
    "resize",
    () => {
      zurichRect = null;
    },
    { passive: true },
  );
})();
