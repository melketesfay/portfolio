(() => {
  const asideTop = document.querySelector(".inside-aside-top");
  const asideBottom = document.querySelector(".inside-aside-bottom");
  const gameBtn = document.getElementById("btn");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  const topCorners = {
    container: asideTop,
    vertical: [
      document.querySelector(".aside-top-l"),
      document.querySelector(".aside-top-r"),
    ],
    horizontal: [
      document.querySelector(".aside-top-t"),
      document.querySelector(".aside-top-b"),
    ],
  };
  const bottomCorners = {
    container: asideBottom,
    vertical: [
      document.querySelector(".aside-bottom-l"),
      document.querySelector(".aside-bottom-r"),
    ],
    horizontal: [
      document.querySelector(".aside-bottom-t"),
      document.querySelector(".aside-bottom-b"),
    ],
  };

  if (
    !asideTop ||
    !asideBottom ||
    !gameBtn ||
    topCorners.vertical.some((corner) => !corner) ||
    topCorners.horizontal.some((corner) => !corner) ||
    bottomCorners.vertical.some((corner) => !corner) ||
    bottomCorners.horizontal.some((corner) => !corner)
  ) {
    return;
  }

  let flashTimer = 0;

  function setCornerSize(corners, open) {
    const verticalHeight = open ? "70px" : "0px";
    const horizontalWidth = open ? "70px" : "0px";

    corners.vertical.forEach((corner) => {
      corner.style.height = verticalHeight;
    });
    corners.horizontal.forEach((corner) => {
      corner.style.width = horizontalWidth;
    });
  }

  function isHovered(element) {
    return finePointer.matches && element.matches(":hover");
  }

  function settleCorners() {
    setCornerSize(topCorners, isHovered(asideTop));
    setCornerSize(bottomCorners, gameBtn.checked || isHovered(asideBottom));
    asideTop.classList.remove("corner-game-flash");
    asideBottom.classList.remove("corner-game-flash");
  }

  function flashGameCorners() {
    if (!finePointer.matches) return;

    clearTimeout(flashTimer);
    setCornerSize(topCorners, true);
    setCornerSize(bottomCorners, true);

    asideTop.classList.remove("corner-game-flash");
    asideBottom.classList.remove("corner-game-flash");
    void asideTop.offsetWidth;
    asideTop.classList.add("corner-game-flash");
    asideBottom.classList.add("corner-game-flash");

    flashTimer = window.setTimeout(settleCorners, 760);
  }

  asideTop.addEventListener("mouseenter", () => {
    setCornerSize(topCorners, true);
  });

  asideTop.addEventListener("mouseleave", () => {
    if (!asideTop.classList.contains("corner-game-flash")) {
      setCornerSize(topCorners, false);
    }
  });

  asideBottom.addEventListener("mouseenter", () => {
    setCornerSize(bottomCorners, true);
  });

  asideBottom.addEventListener("mouseleave", () => {
    if (
      !gameBtn.checked &&
      !asideBottom.classList.contains("corner-game-flash")
    ) {
      setCornerSize(bottomCorners, false);
    }
  });

  gameBtn.addEventListener("change", () => {
    flashGameCorners();
  });
})();
