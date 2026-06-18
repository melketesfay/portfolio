(() => {
  const toggle = document.getElementById("btn");
  const score = document.querySelector(".score");
  const points = document.querySelector(".score > p");
  const asideBottom = document.querySelector(".inside-aside-bottom");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  if (!toggle || !score || !points || !asideBottom) return;

  const originalText =
    `<span class="index">Als</span> Full Stack Entwickler liebe ich es, mit ein paar Zeilen Code Ideen Wirklichkeit werden zu lassen – manchmal elegant, manchmal verrückt, aber immer mit Neugier, Leidenschaft und dem Drang, etwas Neues auszuprobieren.`;

  let gameActive = false;
  let counter = 0;

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

  function textsplitter(targets) {
    targets.forEach((target) => {
      const para = document.createElement("h3");
      para.style.whiteSpace = "pre-line";

      target.textContent.split("").forEach((letter) => {
        const wrapper = document.createElement("span");

        if (letter.trim() === "") {
          wrapper.innerHTML = letter.replace(/\s/, "&nbsp;");
        }

        wrapper.classList.add("target");
        wrapper.style.position = "relative";
        wrapper.style.zIndex = "1";
        wrapper.appendChild(document.createTextNode(letter));
        para.appendChild(wrapper);
      });

      target.parentNode.replaceChild(para, target);
      para.classList.add("aside-bottom-about-me");
    });
  }

  function randomColor(event) {
    if (!gameActive) return;

    const color = Math.floor(Math.random() * 16777215).toString(16);
    document.querySelectorAll(".target").forEach((target, index) => {
      const pos = target.getBoundingClientRect();

      if (!isNearCursor(event, pos)) return;

      target.classList.add("free");
      target.style.cssText += `
        position:relative;
        transform: translateY(-1000px);
        z-index:${index + 100};
        font-weight:700;
        min-height:fit-content;
        min-width:fit-content;
        margin:auto;
        color:#${color};
        display:inline-block;
        text-align:center;
        font-size:1.7rem;
        transition-property:transform,background-color,width,height,font-size,white-space;
        transition-duration:65s,1s,1s,1s,0.5s;
      `;
    });
  }

  function handleKeydown(event) {
    if (!gameActive) return;

    document.querySelectorAll(".free").forEach((target, index) => {
      if (
        target.innerHTML.trim().toString() !== event.key ||
        target.style.backgroundColor === "red" ||
        target.getBoundingClientRect().top <= 0
      ) {
        return;
      }

      counter++;
      points.innerHTML = counter;
      target.classList.remove("target", "free");
      target.style.cssText += `
        position:absolute;
        z-index:${index + 100};
        padding-top:5%;
        width:50px;
        height:50px;
        background-image:url('explosion.gif');
        background-size:cover;
        background-repeat:no-repeat;
        background-position:center;
        color:black;
      `;

      window.setTimeout(() => {
        target.style.opacity = 0;
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

  function startGame() {
    if (gameActive || !finePointer.matches) return;

    const currentText = getAsideTextElement();
    if (!currentText) return;

    gameActive = true;
    counter = 0;
    document.body.classList.add("darkMode");
    textsplitter([currentText]);
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
    } else {
      stopGame();
    }

    if (typeof makePageSameHeight === "function") {
      makePageSameHeight();
    }
  });
})();
