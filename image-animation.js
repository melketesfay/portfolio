(() => {
  const toggle = document.getElementById("btn");
  const imageBottom = document.querySelector(".image-bottom");
  const clips = Array.from(document.querySelectorAll(".image-top"));

  if (!toggle || !imageBottom || clips.length === 0) return;

  const activeClips = new Set();
  const resetTimers = new Map();
  let pointerActive = false;
  let currentIndex = null;

  function isInWaterMode() {
    return toggle.checked;
  }

  function configureClip(clip, index) {
    clip.style.width = `${100 / clips.length}%`;
    clip.style.display = "block";
    clip.style.background = "var(--fg)";
    clip.style.backgroundPosition = `${index * (100 / (clips.length - 1))}% 0`;
    clip.style.backgroundSize = "300px";
    clip.style.backgroundRepeat = "no-repeat";
    clip.style.position = "relative";
    clip.style.zIndex = "4";
    clip.style.flex = "0 0 auto";
    clip.style.height = "250px";
    clip.style.opacity = "1";
    clip.style.transition = "none";
  }

  function resetClip(clip) {
    if (!clip) return;

    clip.style.height = "250px";
    clip.style.opacity = "1";
    clip.style.transition = "height 1.3s ease-in-out, opacity 1.3s ease-in-out";
    activeClips.delete(clip);
  }

  function scheduleClipReset(clip, delay = 100) {
    clearTimeout(resetTimers.get(clip));
    resetTimers.set(
      clip,
      window.setTimeout(() => {
        resetTimers.delete(clip);
        resetClip(clip);
      }, delay),
    );
  }

  function resetActiveClips(delay = 100) {
    activeClips.forEach((clip) => {
      scheduleClipReset(clip, delay);
    });
    currentIndex = null;
  }

  function applyReveal(index) {
    const clip = clips[index];
    if (!clip) return;

    clearTimeout(resetTimers.get(clip));
    resetTimers.delete(clip);
    activeClips.add(clip);
    clip.style.transition = "none";

    if (isInWaterMode()) {
      clip.style.height = "0px";
      clip.style.opacity = "1";
    } else {
      clip.style.height = "250px";
      clip.style.opacity = "0";
    }
  }

  function revealClip(index, autoReset = false) {
    if (!clips[index]) return;

    if (currentIndex !== null && currentIndex !== index) {
      scheduleClipReset(clips[currentIndex]);

      const step = index > currentIndex ? 1 : -1;
      for (let i = currentIndex + step; i !== index + step; i += step) {
        applyReveal(i);
        if (i !== index) {
          scheduleClipReset(clips[i]);
        }
      }
    } else {
      applyReveal(index);
    }

    if (autoReset) {
      scheduleClipReset(clips[index]);
    }

    currentIndex = index;
  }

  function indexFromPointer(event) {
    const rect = imageBottom.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const ratio = Math.min(Math.max(x / rect.width, 0), 0.999);
    return Math.floor(ratio * clips.length);
  }

  function handlePointerMove(event) {
    if (event.pointerType === "touch" && !pointerActive) return;

    revealClip(indexFromPointer(event), false);
  }

  function applyMode() {
    imageBottom.style.setProperty(
      "--bg",
      isInWaterMode() ? "url(profilewater.jpg)" : "url(profileprint.jpg)",
    );

    clips.forEach((clip, index) => {
      clip.style.setProperty(
        "--fg",
        isInWaterMode() ? "url(profileprint.jpg)" : "url(profilewater.jpg)",
      );
      configureClip(clip, index);
    });

    clips[0].style.borderRadius = "17px 0 0 17px";
    clips[clips.length - 1].style.borderRadius = "0 17px 17px 0";
    activeClips.clear();
    resetTimers.forEach((timer) => clearTimeout(timer));
    resetTimers.clear();
    currentIndex = null;
  }

  imageBottom.addEventListener("pointerdown", (event) => {
    pointerActive = true;
    resetTimers.forEach((timer) => clearTimeout(timer));
    resetTimers.clear();
    currentIndex = null;
    revealClip(indexFromPointer(event));

    if (imageBottom.setPointerCapture) {
      imageBottom.setPointerCapture(event.pointerId);
    }
  });

  imageBottom.addEventListener("pointermove", handlePointerMove, {
    passive: true,
  });

  imageBottom.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "touch") {
      pointerActive = true;
      revealClip(indexFromPointer(event), true);
    }
  });

  imageBottom.addEventListener("pointerleave", () => {
    pointerActive = false;
    resetActiveClips();
  });

  imageBottom.addEventListener("pointerup", (event) => {
    pointerActive = false;
    if (
      imageBottom.releasePointerCapture &&
      imageBottom.hasPointerCapture?.(event.pointerId)
    ) {
      imageBottom.releasePointerCapture(event.pointerId);
    }
    resetActiveClips();
  });

  imageBottom.addEventListener("pointercancel", () => {
    pointerActive = false;
    resetActiveClips();
  });

  toggle.addEventListener("change", applyMode);
  applyMode();
})();
