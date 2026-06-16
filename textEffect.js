function paragraphSpan() {
  let t = document.body
    .querySelector(".inside-aside-bottom")
    .querySelector("p");

  t.forEach((e) => {
    var para = document.createElement("p");
    text = e.textContent.split("");
    text.forEach((t) => {
      var wrapper = document.createElement("span");

      wrapper.classList.add("wabble-letter");
      const newtext = document.createTextNode(t);
      wrapper.appendChild(newtext);
      if (wrapper.innerHTML != " ") {
        wrapper.style.margin = "0px";
      }
      para.appendChild(wrapper);
    });

    e.parentNode.replaceChild(para, e);
    para.classList.add("wabble-text");
  });
}

paragraphSpan();

const letters = document.querySelectorAll(".wabble-letter");
const maxDistance = 100; // Maximum distance at which letters will repel from cursor
const moveFactor = 30; // Factor to control how far letters move (increase for stronger repulsion)

// Mouse move event
document.addEventListener("mousemove", (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  // console.log(mouseX, mouseY, letters[0].getBoundingClientRect());
  letters.forEach((letter) => {
    const rect = letter.getBoundingClientRect();
    const letterX = rect.left + rect.width / 2;
    const letterY = rect.top + rect.height / 2;

    // Calculate distance between cursor and letter
    const distanceX = letterX - mouseX; // Inverted to repel from cursor
    const distanceY = letterY - mouseY; // Inverted to repel from cursor
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Repel letter from cursor if within range
    if (distance < maxDistance) {
      const moveX =
        (distanceX / distance) *
        (maxDistance - distance) *
        (moveFactor / maxDistance);
      const moveY =
        (distanceY / distance) *
        (maxDistance - distance) *
        (moveFactor / maxDistance);
      letter.style.transform = `translate(${moveX}px, ${moveY}px)`;
    } else {
      // Reset position when outside of maxDistance
      letter.style.transform = `translate(0, 0)`;
    }
  });
});
