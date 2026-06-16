let togle = document.getElementById("btn");
function rainFall() {
  let clips = document.querySelectorAll(".image-top");
  clips.forEach(function (currentValue, currentIndex, listObj) {
    currentValue.style.cssText = `
  width: 15px;
//  height: 0px;
  display:block;
  background-color: blueviolet;
  background: var(--fg);
  background-position: ${currentIndex * 5.23}% 0px;
  background-size: 300px;
  background-repeat: no-repeat;
  transition: all 0s ease-out;
  position:relative;
  z-index:4;
  
  
  `;
  });

  if (!togle.checked) {
    document
      .querySelector(".image-bottom")
      .style.setProperty("--bg", "url(profileprint.jpg)");
    clips.forEach((e) => {
      e.style.setProperty("--fg", "url(profilewater.jpg)");
      e.addEventListener("mouseenter", (event) => {
        e.style.opacity = "0";
        e.style.height = "250px";
        e.style.transition = "all 0s ease-in-out";
      });

      // Add touch event listeners for mobile devices
      document.body.addEventListener("touchmove", (event) => {
        // Get the touch point coordinates
        const touch = event.touches[0];

        const currentElement = document.elementFromPoint(
          touch.clientX,
          touch.clientY
        );
        if (e == currentElement) {
          e.style.opacity = "0";
          e.style.height = "250px";
          e.style.transition = "all 0s ease-in-out";
        } else if (e != currentElement) {
          setTimeout(() => {
            e.style.opacity = "1";
            e.style.transition = "all 1.3s ease-in-out";
          }, 100);
        }
      });

      // END OF Add touch event listeners for mobile devices
    });

    clips.forEach((e) => {
      e.addEventListener("mouseleave", (event) => {
        setTimeout(() => {
          e.style.opacity = "1";
          e.style.transition = "all 1.3s ease-in-out";
        }, 100);
      });
    });
  } else {
    document
      .querySelector(".image-bottom")
      .style.setProperty("--bg", "url(profilewater.jpg)");
    clips.forEach((e) => {
      e.style.setProperty("--fg", "url(profileprint.jpg)");
      e.addEventListener("mouseenter", (event) => {
        e.style.height = "0px";
        e.style.opacity = "1";
        e.style.transition = "all 0s ease-in-out";
      });
      // Add touch event listeners for mobile devices
      document.body.addEventListener("touchmove", (event) => {
        // Get the touch point coordinates
        const touch = event.touches[0];

        const currentElement = document.elementFromPoint(
          touch.clientX,
          touch.clientY
        );
        if (e == currentElement) {
          e.style.height = "0px";
          e.style.opacity = "1";
          e.style.transition = "all 0s ease-in-out";
        } else if (e != currentElement) {
          setTimeout(() => {
            e.style.height = "250px";
            e.style.transition = "all 1.3s ease-in-out";
          }, 100);
        }
      });

      // END OF Add touch event listeners for mobile devices
    });

    clips.forEach((e) => {
      e.addEventListener("mouseleave", (event) => {
        setTimeout(() => {
          e.style.height = "250px";
          e.style.transition = "all 1.3s ease-in-out";
        }, 100);
      });
    });
  }
  document.querySelectorAll(".image-top")[19].style.borderRadius =
    "0 17px 17px 0";

  document.querySelectorAll(".image-top")[0].style.borderRadius =
    "17px 0 0 17px";
}

rainFall();

togle.addEventListener("change", () => {
  if (!togle.checked) {
    rainFall();
  } else {
    rainFall();
  }
});
