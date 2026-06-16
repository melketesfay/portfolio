function playTypingGame() {
  let t = document.body
    .querySelector(".inside-aside-bottom")
    .querySelectorAll("h3");
  textsplitter(t);

  document.addEventListener("mousemove", randomColor);

  function randomColor(event) {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);

    let spans = document.querySelectorAll(".target");
    let containerPos = document
      .querySelector(".inside-aside-bottom")
      .getBoundingClientRect();
    spans.forEach((e, i) => {
      let pos = e.getBoundingClientRect();

      if (isNearCursor(event, pos)) {
        e.classList.add("free");
        e.style.cssText += `
        position:relative;
     
        transform: translateY(${-1000}px);
        z-index:${i + 100};
            font-weight:700;
            min-height: fit-content;
            min-width: fit-content;
          margin:auto;
            color:#${randomColor};
            display:inline-block;
            text-align: center;
            
         
            
            font-size:1.7rem;

            transition-property:transform,background-color,width,height,font-size,white-space;
      transition-duration: 65s,1s,1s,1s,0.5s;

          

            `;
      }
    });
  }

  let counter = 0;

  let points = document.querySelector(".score > p");
  let score = document.querySelector(".score");

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
  console.log(points.getBoundingClientRect().width);
  document.addEventListener("keydown", (k) => {
    // console.log(k.key)
    let killed = "red";

    let prey = document.querySelectorAll(".free");
    prey.forEach((e, i) => {
      // console.log(e.innerText);
      if (
        e.innerHTML.trim().toString() == k.key &&
        e.style.backgroundColor != killed &&
        e.getBoundingClientRect().top > 0
      ) {
        counter++;
        points.innerHTML = counter;
        let pos = e.getBoundingClientRect();
        e.classList.remove("target", "free");
        e.style.cssText += `
      
        position:absolute;
    
        z-index:${i + 100};
        padding-top:5%;
            width:50px;
            height:50px;
      
            background-image:url('explosion.gif');
           
            background-size:cover;
            background-repeat:no-repeat;
            background-position:center;
            color:black;
        
          
            `;
        setTimeout(() => {
          e.style.opacity = 0;
        }, 700);
      }
    });
  });
}

let toggle = document.getElementById("btn");
toggle.addEventListener("change", (event) => {
  if (toggle.checked) {
    console.log("play time");
    document.body.classList.toggle("darkMode");
    playTypingGame();
    makePageSameHeight();
  } else {
    document.body.classList.toggle("darkMode");
    let elements = document.querySelectorAll(".target");
    let score = document.querySelector(".score");
    let originPara = document.querySelector(".aside-bottom-about-me");
    originPara.innerHTML = `<span class="index">Als</span> Full Stack Entwickler liebe ich es, mit ein paar Zeilen Code Ideen Wirklichkeit werden zu lassen – manchmal elegant, manchmal verrückt, aber immer mit Neugier, Leidenschaft und dem Drang, etwas Neues auszuprobieren.`;
    score.style.display = "none";
    makePageSameHeight();
  }
});

function isNearCursor(event, pos) {
  const distance = Math.sqrt(
    Math.pow(pos.left + pos.width / 2 - event.clientX, 2) +
      Math.pow(pos.top + pos.height / 2 - event.clientY, 2)
  );

  return distance <= 20; // Check if within 20px
}

// change textelements in to span elements
function textsplitter(t) {
  t.forEach((e) => {
    var para = document.createElement("h3");
    para.style.whiteSpace = "pre-line";
    text = e.textContent.split("");
    text.forEach((t) => {
      var wrapper = document.createElement("span");
      // Check if the character is a space
      if (t.trim() == "") {
        wrapper.innerHTML = t.replace(/\s/, "&nbsp;"); // Convert the space to a non-breaking space (&nbsp; = "/\s/";
        // wrapper.style.whiteSpace = "pre"; // Preserve the whitespace
      }
      wrapper.classList.add("target");
      wrapper.style.cssText = `
      position:relative;
      z-index:1;
      `;
      const newtext = document.createTextNode(t);
      wrapper.appendChild(newtext);

      para.appendChild(wrapper);
    });

    e.parentNode.replaceChild(para, e);
    para.classList.add("aside-bottom-about-me");
  });
}
