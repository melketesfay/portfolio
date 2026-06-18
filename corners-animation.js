// aside aside_top_b
let aside_top = document.querySelector(".inside-aside-top");
let aside_top_t = document.querySelector(".aside-top-t");
let aside_top_l = document.querySelector(".aside-top-l");
let aside_top_r = document.querySelector(".aside-top-r");
let aside_top_b = document.querySelector(".aside-top-b");
// aside bottom
let aside_bottom = document.querySelector(".inside-aside-bottom");
let aside_bottom_t = document.querySelector(".aside-bottom-t");
let aside_bottom_l = document.querySelector(".aside-bottom-l");
let aside_bottom_r = document.querySelector(".aside-bottom-r");
let aside_bottom_b = document.querySelector(".aside-bottom-b");

// game button

let gameBtn = document.getElementById("btn");

aside_top.addEventListener("mouseenter", (event) => {
  aside_top_r.style.cssText = aside_top_l.style.cssText = `

height: 70px;

`;
  aside_top_b.style.cssText = aside_top_t.style.cssText = `

width: 70px;

`;
});

aside_bottom.addEventListener("mouseenter", (event) => {
  aside_bottom_r.style.cssText = aside_bottom_l.style.cssText = `

height: 70px;

`;
  aside_bottom_b.style.cssText = aside_bottom_t.style.cssText = `

width: 70px;

`;
});

aside_top.addEventListener("mouseleave", (event) => {
  aside_top_r.style.height = aside_top_l.style.height = "0px";
  aside_top_b.style.width = aside_top_t.style.width = "0px";
});

aside_bottom.addEventListener("mouseleave", (event) => {
  aside_bottom_r.style.height = aside_bottom_l.style.height = "0px";
  aside_bottom_b.style.width = aside_bottom_t.style.width = "0px";
});

gameBtn.addEventListener("change", (event) => {
  if (gameBtn.checked) {
    console.log("gameBtn checked");

    aside_bottom_r.style.cssText = aside_bottom_l.style.cssText = `

height: 70px;

`;
    aside_bottom_b.style.cssText = aside_bottom_t.style.cssText = `

width: 70px;

`;
  } else {
    console.log("gameBtn unchecked");
    aside_bottom_r.style.cssText = aside_bottom_l.style.cssText = `

height: 0px;

`;
    aside_bottom_b.style.cssText = aside_bottom_t.style.cssText = `

width: 0px;

`;
  }
});
