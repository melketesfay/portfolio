function paragraphSpan() {
  let elem = document.querySelectorAll(".about-page h3");
  elem.forEach((e) => {
    const para = document.createElement("h3");
    let chars = e.textContent.split(" ");
    // Split text into words
    let words = chars.filter((word) => word.trim() !== "");

    words.forEach((word) => {
      if (word.trim() === "") {
        word.parentNode.removeChild(word);
      }
      // Create a span for each word and ensure that each word is treated as a block element
      const wordSpan = document.createElement("span");
      wordSpan.classList.add("word"); // Add class for styling

      // Wrap each letter in a span
      word.split("").forEach((letter) => {
        const letterSpan = document.createElement("span");
        letterSpan.classList.add("repellant");
        letterSpan.textContent = letter;
        wordSpan.appendChild(letterSpan);
      });

      para.appendChild(wordSpan);
    });
    // Replace the original paragraph with the new one
    e.parentNode.replaceChild(para, e);

    para.classList.add("span-text");
  });
  elem[0].classList.add("intro");
  console.log(elem[0]);
}

function letterReppelant(target) {
  const letters = target;
  const maxDistance = 100; // Maximum distance at which letters will repel from cursor
  const moveFactor = 30; // Factor to control how far letters move (increase for stronger repulsion)

  // Mouse move event
  document.addEventListener("mousemove", (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

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
}

// document.getElementById("about-page").addEventListener("click", () => {
paragraphSpan();
letterReppelant(document.querySelectorAll(".repellant"));
// });
