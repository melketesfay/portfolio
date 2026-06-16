// --- Global DOM Elements ---
const top_layer = document.getElementById("top-layer");
const down_layer = document.getElementById("down-layer");
const top_layer_content = document.getElementById("top-layer-content");
const down_layer_content = document.getElementById("down-layer-content");
const zuerich = document.querySelector(".about-page-main-top-image");
const zuerich_top_img = document.getElementById("zuerich-top-img");
const zuerich_bottom_img = document.getElementById("zuerich-bottom-img");

// We select all pages to show/hide. We exclude the main page.
const down_layer_pages = Array.from(
  document.querySelectorAll("body > div"),
).slice(1);

// --- Global State Variables for All Scripts ---
// This object stores the current mouse/touch position. Other scripts can read this.
window.globalMousePosition = { x: 0, y: 0 };

// --- Main Animation Loop for this file ---
function animateHideAndSeek() {
  const isOverTopLayer = top_layer.matches(":hover");
  if (isOverTopLayer) {
    const down_layer_pos = down_layer.getBoundingClientRect();
    const x = window.globalMousePosition.x - down_layer_pos.left;
    const y = window.globalMousePosition.y - down_layer_pos.top;

    down_layer.style.setProperty("--x", `${x}px`);
    down_layer.style.setProperty("--y", `${y}px`);
  }
  requestAnimationFrame(animateHideAndSeek);
}

// --- Event Handlers ---

// This function handles the logic for desktop devices (mouse).
function handleDesktop() {
  // We attach a single mousemove listener to the document.
  // It only updates the global position object.
  document.addEventListener("mousemove", (event) => {
    window.globalMousePosition.x = event.clientX;
    window.globalMousePosition.y = event.clientY;
  });

  top_layer.addEventListener("mouseenter", () => {
    down_layer.style.setProperty("--r", "80px");
  });

  top_layer.addEventListener("mouseleave", () => {
    down_layer.style.setProperty("--r", "0px");
  });
}

// This function handles the logic for mobile devices (touch).
function handleMobile() {
  document.addEventListener("touchmove", (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    window.globalMousePosition.x = touch.clientX;
    window.globalMousePosition.y = touch.clientY;
  });

  top_layer.addEventListener("touchstart", () => {
    down_layer.style.setProperty("--r", "70px");
  });

  top_layer.addEventListener("touchend", () => {
    down_layer.style.setProperty("--r", "0px");
  });
}

function detectDevice() {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];
  return toMatch.some((toMatchItem) => navigator.userAgent.match(toMatchItem));
}

document.addEventListener("DOMContentLoaded", () => {
  if (detectDevice()) {
    handleMobile();
  } else {
    handleDesktop();
  }

  // Start the main animation loop.
  animateHideAndSeek();
});

function updateZuerichClipPath(e) {
  e.preventDefault();
  const zuerich_pos = zuerich.getBoundingClientRect();
  const x = e.clientX - zuerich_pos.left;
  const y = e.clientY - zuerich_pos.top;
  zuerich_top_img.style.setProperty("--x", `${x}px`);
  zuerich_top_img.style.setProperty("--y", `${y}px`);
  zuerich_bottom_img.style.setProperty("--x", `${x}px`);
  zuerich_bottom_img.style.setProperty("--y", `${y}px`);
}

document.addEventListener("click", (event) => {
  if (document.querySelector(".about-page").classList.contains("page-active")) {
    zuerich.addEventListener("mousemove", (event) => {
      updateZuerichClipPath(event);
    });
    zuerich.addEventListener("touchmove", (event) => {
      updateZuerichClipPath(event.touches[0]);
    });
  }
});
