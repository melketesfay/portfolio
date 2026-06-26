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

  function setSpotlightWillChange(active) {
    clearTimeout(resetWillChangeTimer);
    downLayer.style.willChange = active ? "clip-path" : "auto";
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

  function isPointInsideSpotlightHost(x, y) {
    if (!spotlightRect) return false;

    return (
      x >= 0 && x <= spotlightRect.width && y >= 0 && y <= spotlightRect.height
    );
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
      const touchOffsetY = Math.round(activeLensSize * 0.55);
      const centerX = pointerX - spotlightRect.left;
      const centerY = pointerY - spotlightRect.top - touchOffsetY;
      if (!isPointInsideSpotlightHost(centerX, centerY)) {
        closeTouchSpotlight(120);
        return;
      }

      const lensX = Math.round(centerX);
      const lensY = Math.round(centerY);

      if (
        lastLensLeft !== null &&
        Math.abs(lensX - lastLensLeft) < 2 &&
        Math.abs(lensY - lastLensTop) < 2
      ) {
        return;
      }

      lastLensLeft = lensX;
      lastLensTop = lensY;
      downLayer.style.setProperty("--x", `${lensX}px`);
      downLayer.style.setProperty("--y", `${lensY}px`);
      downLayer.style.setProperty("--r", `${Math.round(activeLensSize / 2)}px`);
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
  let zurichPointerId = null;
  let zurichTouchActive = false;

  function drawZurichReveal() {
    zurichFrame = 0;
    if (!isAboutActive()) return;

    if (!zurichRect) {
      zurichRect = zuerich.getBoundingClientRect();
    }

    const touchOffsetY = zurichTouchActive ? 44 : 0;
    const x = `${zurichX - zurichRect.left}px`;
    const y = `${zurichY - zurichRect.top - touchOffsetY}px`;
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

  function handleZurichPointerEnter(event) {
    if (event.pointerType !== "mouse") return;

    zurichRect = zuerich.getBoundingClientRect();
    requestZurichDraw(event);
  }

  function handleZurichPointerDown(event) {
    if (!isAboutActive() || event.pointerType === "mouse") return;

    zurichPointerId = event.pointerId;
    zurichTouchActive = true;
    zurichRect = zuerich.getBoundingClientRect();
    requestZurichDraw(event);

    if (zuerich.setPointerCapture) {
      zuerich.setPointerCapture(event.pointerId);
    }
  }

  function handleZurichPointerMove(event) {
    if (event.pointerType === "mouse") {
      requestZurichDraw(event);
      return;
    }

    if (event.pointerId !== zurichPointerId) return;
    requestZurichDraw(event);
  }

  function handleZurichPointerEnd(event) {
    if (event.pointerId !== zurichPointerId) return;

    if (
      zuerich.releasePointerCapture &&
      zuerich.hasPointerCapture?.(event.pointerId)
    ) {
      zuerich.releasePointerCapture(event.pointerId);
    }

    zurichPointerId = null;
    zurichTouchActive = false;
  }

  zuerich.addEventListener("pointerenter", handleZurichPointerEnter);
  zuerich.addEventListener("pointerdown", handleZurichPointerDown, {
    passive: true,
  });
  zuerich.addEventListener("pointermove", handleZurichPointerMove, {
    passive: true,
  });
  zuerich.addEventListener("pointerup", handleZurichPointerEnd, {
    passive: true,
  });
  zuerich.addEventListener("pointercancel", handleZurichPointerEnd, {
    passive: true,
  });
  zuerich.addEventListener("pointerleave", () => {
    if (zurichPointerId === null) {
      zurichRect = null;
    }
  });

  document.addEventListener("portfolio:pagechange", (event) => {
    if (event.detail?.activePage !== "about") {
      zurichPointerId = null;
      zurichTouchActive = false;
      zurichRect = null;
    }
  });

  window.addEventListener(
    "resize",
    () => {
      zurichRect = null;
    },
    { passive: true },
  );
})();
