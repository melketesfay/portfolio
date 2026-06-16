// --- START: MODIFIED TYPEWRITER SCRIPT WITH SCROLL FIX ---

function Typewriter(sSelector, nRate) {
  function clean() {
    clearInterval(nIntervId);
    bTyping = false;
    bStart = true;
    oCurrent = null;
    aSheets.length = nIdx = 0;
  }

  function scroll(oSheet, nPos, bEraseAndStop) {
    if (!oSheet.hasOwnProperty("parts") || aMap.length < nPos) {
      return true;
    }

    var oRel,
      bExit = false;

    if (aMap.length === nPos) {
      aMap.push(0);
    }

    while (aMap[nPos] < oSheet.parts.length) {
      oRel = oSheet.parts[aMap[nPos]];

      scroll(oRel, nPos + 1, bEraseAndStop) ? aMap[nPos]++ : (bExit = true);

      if (
        bEraseAndStop &&
        ((oRel.ref.nodeType - 1) | 1) === 3 &&
        oRel.ref.nodeValue
      ) {
        bExit = true;
        oCurrent = oRel.ref;
        sPart = oCurrent.nodeValue;
        oCurrent.nodeValue = "";
      }

      oSheet.ref.appendChild(oRel.ref);
      if (bExit) {
        return false;
      }
    }

    aMap.length--;
    return true;
  }

  function typewrite() {
    // Determine the currently active H1 element
    const activeH1 = aSheets[nIdx] ? aSheets[nIdx].ref : null;

    if (
      sPart.length === 0 &&
      scroll(aSheets[nIdx], 0, true) &&
      nIdx++ === aSheets.length - 1
    ) {
      clean();
      // Remove cursor on finish
      const cursor = document.getElementById("cursor");
      if (cursor) cursor.remove();
      return;
    }

    oCurrent.nodeValue += sPart.charAt(0);
    sPart = sPart.slice(1);

    // *** ADAPTED SCROLL FIX ***
    // Scroll only if the current active element's bottom edge
    // is below the viewport's bottom edge. This ensures we scroll
    // just enough to keep the writing in view.
    if (activeH1) {
      const rect = activeH1.getBoundingClientRect();
      const viewportBottom = window.innerHeight;

      if (rect.bottom > viewportBottom - 20) {
        // -20 for a small buffer
        // Scroll down by 20 pixels to keep up with the typing text
        window.scrollBy({
          top: 20,
          behavior: "smooth",
        });
      }
    }
  }

  function Sheet(oNode) {
    this.ref = oNode;
    if (!oNode.hasChildNodes()) {
      return;
    }
    this.parts = Array.prototype.slice.call(oNode.childNodes);

    for (var nChild = 0; nChild < this.parts.length; nChild++) {
      oNode.removeChild(this.parts[nChild]);
      this.parts[nChild] = new Sheet(this.parts[nChild]);
    }
  }

  var nIntervId,
    oCurrent = null,
    bTyping = false,
    bStart = true,
    nIdx = 0,
    sPart = "",
    aSheets = [],
    aMap = [];

  this.rate = nRate || 100;

  this.play = function () {
    if (bTyping) {
      return;
    }
    if (bStart) {
      var aItems = document.querySelectorAll(sSelector);

      if (aItems.length === 0) {
        return;
      }
      for (var nItem = 0; nItem < aItems.length; nItem++) {
        aSheets.push(new Sheet(aItems[nItem]));
      }

      bStart = false;
    }

    nIntervId = setInterval(typewrite, this.rate);
    bTyping = true;
  };

  this.pause = function () {
    clearInterval(nIntervId);
    bTyping = false;
  };

  this.terminate = function () {
    oCurrent.nodeValue += sPart;
    sPart = "";
    for (nIdx; nIdx < aSheets.length; scroll(aSheets[nIdx++], 0, false));
    clean();
    // Remove cursor on termination
    const cursor = document.getElementById("cursor");
    if (cursor) cursor.remove();
  };
}

// --- END: MODIFIED TYPEWRITER SCRIPT ---

window.onload = function () {
  // New selector targeting all H1 elements inside the specific div
  var typewriter = new Typewriter(
    ".contact-page-main.name h1",
    50 // Adjusted typing rate to 50ms for better visibility
  );

  // Function to handle the animation start
  const startAnimation = () => {
    const startBtn = document.getElementById("start-btn");
    if (startBtn) startBtn.remove();

    // Add blinking cursor next to the H1 (The original Typewriter script handles
    // the display, but we need the cursor element itself present.)
    const h1Container = document.querySelector(".contact-page-main.name");
    const cursor = document.createElement("span");
    cursor.id = "cursor";
    cursor.className = "cursor";
    h1Container.appendChild(cursor);

    // Delay start to give the user time to see the page
    setTimeout(() => {
      typewriter.play();
    }, 500);
  };

  // Set up click handler for the button
  let startButton = document.querySelectorAll(".head-right li:last-child");
  let startBtn = document.querySelector(".item_contact");
  startButton = Array.from(startButton);
  startButton.push(startBtn);
  console.log(startButton);
  if (startButton) {
    startButton.forEach((e) => e.addEventListener("click", startAnimation));
  }
};
