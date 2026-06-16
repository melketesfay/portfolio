function resetAllHamburgers() {
  document.querySelectorAll(".navbar-hamburger").forEach((menu) => {
    menu.classList.remove("show");
    menu
      .querySelectorAll("li")
      .forEach((li) => li.classList.remove("item_animated"));
  });

  document.querySelectorAll(".hamburger-icon").forEach((icon) => {
    const bars = icon.querySelectorAll("span");
    if (bars[1]) {
      bars[1].style.opacity = "";
      bars[1].style.transform = "";
    }
    if (bars[0]) {
      bars[0].style.position = "";
      bars[0].style.top = "";
      bars[0].style.transform = "";
    }
    if (bars[2]) {
      bars[2].style.position = "";
      bars[2].style.top = "";
      bars[2].style.transform = "";
    }
  });

  document.body.style.overflowY = "auto";
  const btn = document.getElementById("btn");
  if (btn) btn.disabled = false;
}

function openMenuFor(container) {
  const menu = container.querySelector(".navbar-hamburger");
  if (!menu) return;
  menu.classList.add("show");

  const items = menu.querySelectorAll("li");
  items.forEach((li) => {
    li.classList.remove("item_animated");
    void li.offsetWidth; // reflow trick
    li.classList.add("item_animated");
  });

  document.body.style.overflowY = "hidden";
  const btn = document.getElementById("btn");
  if (btn) btn.disabled = true;

  const icon = container.querySelector(".hamburger-icon");
  const bars = icon ? icon.querySelectorAll("span") : [];
  if (bars[1]) {
    bars[1].style.opacity = "0";
    bars[1].style.transform = "translateX(-100vh)";
  }
  if (bars[0]) {
    bars[0].style.position = "absolute";
    bars[0].style.top = "50%";
    bars[0].style.transform = "rotate(45deg)";
  }
  if (bars[2]) {
    bars[2].style.position = "absolute";
    bars[2].style.top = "50%";
    bars[2].style.transform = "rotate(-45deg)";
  }
}

function closeMenuFor(container) {
  const menu = container.querySelector(".navbar-hamburger");
  if (!menu) return;
  menu.classList.remove("show");
  menu
    .querySelectorAll("li")
    .forEach((li) => li.classList.remove("item_animated"));

  const icon = container.querySelector(".hamburger-icon");
  const bars = icon ? icon.querySelectorAll("span") : [];
  if (bars[1]) {
    bars[1].style.opacity = "";
    bars[1].style.transform = "";
  }
  if (bars[0]) {
    bars[0].style.position = "";
    bars[0].style.top = "";
    bars[0].style.transform = "";
  }
  if (bars[2]) {
    bars[2].style.position = "";
    bars[2].style.top = "";
    bars[2].style.transform = "";
  }

  document.body.style.overflowY = "auto";
  const btn = document.getElementById("btn");
  if (btn) btn.disabled = false;
}

// // Toggle when clicking on the icon
// document.addEventListener("click", (e) => {
//   const icon = e.target.closest(".hamburger-icon");
//   if (!icon) {
//     console.warn("No .hamburger-icon found for", e.target);
//     return;
//   }

//   const container = icon.closest(".container");
//   const menu = container?.querySelector(".navbar-hamburger");
//   if (!menu) return;

//   if (menu.classList.contains("show")) {
//     closeMenuFor(container);
//   } else {
//     resetAllHamburgers(); // close any other open menus first
//     openMenuFor(container); // open the clicked one
//   }
// });

// Close when clicking any link inside a mobile menu
document.addEventListener("click", (e) => {
  const link = e.target.closest(".navbar-hamburger a");
  if (!link) return;
  const container = link.closest(".container");
  if (container) closeMenuFor(container);
});

document.addEventListener("click", (e) => {
  const icon = e.target.closest(".hamburger-icon");
  if (!icon) return;

  // scope everything to the SAME container as the clicked icon
  const container = icon.closest(".container");
  const menu = container?.querySelector(".navbar-hamburger");
  if (!menu) {
    console.warn("No .navbar-hamburger found for", icon);
    return;
  }

  // toggle menu
  menu.classList.toggle("show");
  const open = menu.classList.contains("show");

  // animate bars (inline style to match your current behavior)
  const bars = icon.querySelectorAll("span");
  if (bars[1]) {
    bars[1].style.opacity = open ? "0" : "1";
    bars[1].style.transform = open ? "translateX(-100vh)" : "translateX(0)";
  }
  if (bars[0]) {
    bars[0].style.position = open ? "absolute" : "auto";
    bars[0].style.top = open ? "50%" : "-200%";
    bars[0].style.transform = open ? "rotate(45deg)" : "none";
  }
  if (bars[2]) {
    bars[2].style.position = open ? "absolute" : "auto";
    bars[2].style.top = open ? "50%" : "200%";
    bars[2].style.transform = open ? "rotate(-45deg)" : "rotate(0deg)";
  }

  // drop animation on items (if present)
  container
    .querySelectorAll(".navbar-hamburger li")
    .forEach((li) => li.classList.toggle("item_animated", open));

  // lock/unlock scroll + disable the toggle button if it exists
  document.body.style.overflowY = open ? "hidden" : "auto";
  const btn = document.getElementById("btn");
  if (btn) btn.disabled = open;
});

// close menu when clicking any link inside the open menu (for all sections)
document.addEventListener("click", (e) => {
  const link = e.target.closest(".navbar-hamburger a");
  if (!link) return;
  const menu = link.closest(".navbar-hamburger");
  if (!menu) return;
  const container = menu.closest(".container");
  // remove show + reverse bar styles on that section's icon
  menu.classList.remove("show");
  const icon = container?.querySelector(".hamburger-icon");
  if (icon) {
    const bars = icon.querySelectorAll("span");
    if (bars[1]) {
      bars[1].style.opacity = "1";
      bars[1].style.transform = "translateX(0)";
    }
    if (bars[0]) {
      bars[0].style.position = "auto";
      bars[0].style.top = "-200%";
      bars[0].style.transform = "none";
    }
    if (bars[2]) {
      bars[2].style.position = "auto";
      bars[2].style.top = "200%";
      bars[2].style.transform = "rotate(0deg)";
    }
  }
  document.body.style.overflowY = "auto";
  const btn = document.getElementById("btn");
  if (btn) btn.disabled = false;
});
