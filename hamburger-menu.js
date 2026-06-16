let homePage = document.querySelector(".main-page");
let aboutPage = document.querySelector(".about-page");
let contactPage = document.querySelector(".contact-page");
let projectsPage = document.querySelector(".projects-page");
let mobileMenu = document.querySelector(".mobile-page");

let pages = [homePage, aboutPage, contactPage, projectsPage, mobileMenu];

pages.forEach((page) => {
  let hamburgerMenu = page.querySelector(".hamburger-icon");
  let navbarHamburger = page.querySelector(".navbar-hamburger");

  let bars = hamburgerMenu.querySelectorAll("span");

  // let dropItems = navbarHamburger.querySelectorAll("li");
  let header = page.querySelector("header");
  let barArr = Array.from(bars);

  barArr.forEach((e) => {
    e.style.transition = "all ease-in-out 0.5s";
  });

  // console.log(hamburgerMenu);
  // hamburgerMenu.forEach((e) => {
  //   e.addEventListener("click", (event) => toogleHamburgerMenue(event));
  //   e.addEventListener("click", (event) => show(event));
  //   e.addEventListener("click", (event) => animateDrop(event));
  // });
  hamburgerMenu.addEventListener("click", (event) => {
    console.log(event.target);
    console.log("clicked");
    // toogleHamburgerMenue(event);
  });
  hamburgerMenu.addEventListener("click", (event) => show(event));
  // hamburgerMenu.addEventListener("click", (event) => animateDrop(event));

  function toogleHamburgerMenue(event) {
    event.preventDefault();
    let style = navbarHamburger.style;

    if (!navbarHamburger.classList.contains("show")) {
      bars[1].style.transform = "translateX(-100vh)";
      bars[1].style.opacity = "0";
      bars[0].style.position = "absolute";
      bars[0].style.top = "50%";

      bars[0].style.transform = "rotate(45deg)";
      bars[2].style.position = "absolute";
      bars[2].style.top = "50%";

      bars[2].style.transform = "rotate(-45deg)";
      header.style.position = "relative";
      header.style.zIndex = 100000;
    } else {
      bars[1].style.opacity = "1";
      bars[1].style.transform = "translateX(0)";
      bars[0].style.position = "auto";
      bars[0].style.top = "-200%";
      bars[0].style.transform = "none";

      bars[2].style.position = "auto";
      bars[2].style.top = "200%";
      bars[2].style.transform = "rotate(0deg)";
    }
  }

  // function animateDrop(event) {
  //   event.preventDefault();
  //   setTimeout(() => {
  //     dropItems[0].classList.toggle("item_animated");
  //     dropItems[1].classList.toggle("item_animated");
  //     dropItems[2].classList.toggle("item_animated");
  //   }, 500);
  // }

  function show(event) {
    event.preventDefault();
    // navbarHamburger.classList.toggle("show");
  }

  // hamburgerMenu.addEventListener("click", () => {
  //   if (navbarHamburger.classList.contains("show")) {
  //     document.body.style.overflowY = "hidden";
  //     document.getElementById("btn").disabled = true;
  //   } else {
  //     document.body.style.overflowY = "auto";
  //     document.getElementById("btn").disabled = false;
  //   }
  // });
});
