(() => {
  const toggle = document.getElementById("btn");
  const score = document.querySelector(".score");
  const points = document.querySelector(".score > p");
  const asideBottom = document.querySelector(".inside-aside-bottom");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!toggle || !score || !points || !asideBottom) return;

  const originalText =
    `<span class="index">Als</span> Full Stack Entwickler liebe ich es, mit ein paar Zeilen Code Ideen Wirklichkeit werden zu lassen – manchmal elegant, manchmal verrückt, aber immer mit Neugier, Leidenschaft und dem Drang, etwas Neues auszuprobieren.`;

  let gameActive = false;
  let counter = 0;
  let gameTextLayer = null;

  function getAsideTextElement() {
    return asideBottom.querySelector(".aside-bottom-about-me");
  }

  function isNearCursor(event, pos) {
    const distance = Math.sqrt(
      Math.pow(pos.left + pos.width / 2 - event.clientX, 2) +
        Math.pow(pos.top + pos.height / 2 - event.clientY, 2),
    );

    return distance <= 20;
  }

  function getTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    return nodes;
  }

  function clearGameTextLayer() {
    if (gameTextLayer) {
      gameTextLayer.remove();
      gameTextLayer = null;
    }

    const currentText = getAsideTextElement();
    if (currentText) {
      currentText.classList.remove("game-text-active");
    }
  }

  function buildGameTextLayer(target) {
    clearGameTextLayer();

    const parent = target.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const layer = document.createElement("span");
    layer.className = "game-text-layer";

    getTextNodes(target).forEach((node) => {
      for (let index = 0; index < node.nodeValue.length; index++) {
        const letter = node.nodeValue[index];
        if (letter.trim() === "") continue;

        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + 1);
        const rect = range.getBoundingClientRect();
        range.detach();

        if (!rect.width && !rect.height) continue;

        const wrapper = document.createElement("span");
        wrapper.classList.add("target");
        if (node.parentElement?.closest(".index")) {
          wrapper.classList.add("index");
        }
        wrapper.textContent = letter;
        wrapper.style.left = `${rect.left - parentRect.left}px`;
        wrapper.style.top = `${rect.top - parentRect.top}px`;
        wrapper.style.width = `${rect.width}px`;
        wrapper.style.height = `${rect.height}px`;
        layer.appendChild(wrapper);
      }
    });

    parent.appendChild(layer);
    target.classList.add("game-text-active");
    gameTextLayer = layer;
  }

  function randomColor(event) {
    if (!gameActive) return;

    const color = Math.floor(Math.random() * 16777215).toString(16);
    document
      .querySelectorAll(".game-text-layer .target")
      .forEach((target, index) => {
        if (
          target.classList.contains("free") ||
          target.classList.contains("caught")
        ) {
          return;
        }

        const pos = target.getBoundingClientRect();

        if (!isNearCursor(event, pos)) return;

        target.classList.add("free");
        target.style.zIndex = `${index + 100}`;
        target.style.setProperty(
          "--game-letter-color",
          `#${color.padStart(6, "0")}`,
        );
        target.style.setProperty(
          "--game-float-x",
          `${Math.round((Math.random() - 0.5) * 80)}px`,
        );
        target.style.setProperty(
          "--game-rotate",
          `${Math.round((Math.random() - 0.5) * 28)}deg`,
        );
      });
  }

  function handleKeydown(event) {
    if (!gameActive) return;

    document
      .querySelectorAll(".game-text-layer .free")
      .forEach((target, index) => {
        if (
          target.innerHTML.trim().toString() !== event.key ||
          target.style.backgroundColor === "red" ||
          target.getBoundingClientRect().top <= 0
        ) {
          return;
        }

        const layer = target.closest(".game-text-layer");
        const layerRect = layer.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const currentCenterX = targetRect.left + targetRect.width / 2;
        const currentCenterY = targetRect.top + targetRect.height / 2;

        counter++;
        points.innerHTML = counter;
        target.classList.remove("free");
        target.classList.add("caught");
        target.style.zIndex = `${index + 100}`;
        target.style.left = `${
          currentCenterX - layerRect.left - target.offsetWidth / 2
        }px`;
        target.style.top = `${
          currentCenterY - layerRect.top - target.offsetHeight / 2
        }px`;

        window.setTimeout(() => {
          target.classList.add("caught-fade");
        }, 700);
      });
  }

  function showScore() {
    points.innerHTML = "0";
    score.style.cssText = `
      position:fixed;
      top:10%;
      width:fit-content;
      height:fit-content;
      background-color:#F05941;
      left:calc(50% - 45px);
      display:flex;
      gap:1rem;
      flex-direction:column;
      text-align:center;
      justify-content:center;
      align-items:center;
      font-weight:bold;
      font-size:2rem;
      z-index:10;
      opacity:0.8;
      border-radius:0.7rem;
    `;
  }

  function clearMobileHeliumBurst() {
    const currentText = getAsideTextElement();
    if (!currentText || gameActive) return;

    currentText.classList.remove("mobile-helium-text");
    currentText.innerHTML = originalText;
  }

  function runMobileHeliumBurst() {
    if (finePointer.matches || reducedMotion.matches || gameActive) return;

    const currentText = getAsideTextElement();
    if (!currentText) return;

    clearMobileHeliumBurst();
    const text = currentText.textContent;
    currentText.innerHTML = "";
    currentText.classList.add("mobile-helium-text");

    const letters = Array.from(text).map((letter, index) => {
      const wrapper = document.createElement("span");
      const isWhitespace = letter.trim() === "";

      wrapper.className = "mobile-helium-letter";
      wrapper.style.setProperty("--helium-index", index);
      wrapper.style.setProperty(
        "--helium-x",
        `${Math.round((Math.random() - 0.5) * 72)}px`,
      );
      wrapper.style.setProperty(
        "--helium-y",
        `${Math.round(120 + Math.random() * 190)}px`,
      );
      wrapper.style.setProperty(
        "--helium-rotate",
        `${Math.round((Math.random() - 0.5) * 34)}deg`,
      );
      wrapper.style.animationDelay = `${Math.min(index * 12, 620)}ms`;
      wrapper.textContent = isWhitespace ? "\u00a0" : letter;

      currentText.appendChild(wrapper);
      return wrapper;
    });

    letters
      .filter((letter) => letter.textContent.trim() && Math.random() > 0.34)
      .forEach((letter) => {
        letter.addEventListener(
          "animationend",
          () => {
            const style = window.getComputedStyle(letter);

            letter.style.opacity = style.opacity;
            letter.style.transform = style.transform;
            letter.classList.remove("mobile-helium-letter-active");
            letter.classList.add("mobile-helium-letter-frozen");
          },
          { once: true },
        );
        letter.classList.add("mobile-helium-letter-active");
      });
  }

  function startGame() {
    if (gameActive || !finePointer.matches) return;

    const currentText = getAsideTextElement();
    if (!currentText) return;

    gameActive = true;
    counter = 0;
    document.body.classList.add("darkMode");
    buildGameTextLayer(currentText);
    showScore();
    document.addEventListener("mousemove", randomColor);
    document.addEventListener("keydown", handleKeydown);
  }

  function stopGame() {
    if (gameActive) {
      document.removeEventListener("mousemove", randomColor);
      document.removeEventListener("keydown", handleKeydown);
    }

    gameActive = false;
    counter = 0;
    document.body.classList.remove("darkMode");
    clearGameTextLayer();
    const currentText = getAsideTextElement();
    if (currentText) {
      currentText.innerHTML = originalText;
    }
    score.style.display = "none";
  }

  function handlePointerModeChange() {
    if (!finePointer.matches) {
      stopGame();
    }
  }

  if (finePointer.addEventListener) {
    finePointer.addEventListener("change", handlePointerModeChange);
  } else {
    finePointer.addListener(handlePointerModeChange);
  }

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      startGame();
      runMobileHeliumBurst();
    } else {
      stopGame();
      clearMobileHeliumBurst();
    }

    if (typeof makePageSameHeight === "function") {
      makePageSameHeight();
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".a-logo")) return;

    toggle.checked = false;
    stopGame();
    clearMobileHeliumBurst();

    if (typeof makePageSameHeight === "function") {
      makePageSameHeight();
    }
  });
})();
