import * as utils from "https://cdn.skypack.dev/@material/material-color-utilities";

const target = document.body;
const input = document.querySelector("#seed");
const random = document.querySelector("#random");
const reset = document.querySelector("#reset");
const brightness = document.querySelector("#brightness");
const svgBackground = document.querySelector("#svg-background");

function setupBackground() {
  svgBackground.setAttribute(
    "viewBox",
    `0 0 ${window.innerWidth} ${window.innerHeight}`
  );
  svgBackground.innerHTML = "";
  // Create random shapes
  const shapes = [];
  for (let i = 0; i < 100; i++) {
    const shape = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    shape.setAttribute("cx", Math.random() * window.innerWidth);
    shape.setAttribute("cy", Math.random() * window.innerHeight);
    shape.setAttribute("r", Math.random() * 50);
    const colors = [
      "--md-sys-color-primary",
      "--md-sys-color-primary-container",
      "--md-sys-color-secondary",
      "--md-sys-color-secondary-container",
      "--md-sys-color-tertiary",
      "--md-sys-color-tertiary-container",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    shape.setAttribute("fill", `var(${randomColor})`);
    shapes.push(shape);
    // Animate x position
    const animationX = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "animate"
    );
    animationX.setAttribute("attributeName", "cx");
    const from = Math.random() * window.innerWidth;
    const to = Math.random() * window.innerWidth;
    let duration = Math.random() * 100;
    // Ensure more than 5 seconds
    if (duration < 5) {
      duration = 5;
    }
    animationX.setAttribute("dur", duration + "s");
    animationX.setAttribute("values", `${from};${to};${from}`);
    animationX.setAttribute("repeatCount", "indefinite");
    shape.appendChild(animationX);

    // Animate y position
    const animationY = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "animate"
    );
    animationY.setAttribute("attributeName", "cy");
    const fromY = Math.random() * window.innerHeight;
    const toY = Math.random() * window.innerHeight;
    animationY.setAttribute("dur", duration + "s");
    animationY.setAttribute("values", `${fromY};${toY};${fromY}`);
    animationY.setAttribute("repeatCount", "indefinite");
    shape.appendChild(animationY);

    // Animate radius
    const animationR = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "animate"
    );
    animationR.setAttribute("attributeName", "r");
    const fromR = Math.random() * 50;
    const toR = Math.random() * 50;
    animationR.setAttribute("dur", duration + "s");
    animationR.setAttribute("values", `${fromR};${toR};${fromR}`);
    animationR.setAttribute("repeatCount", "indefinite");
    shape.appendChild(animationR);

    svgBackground.appendChild(shape);
  }
}

setupBackground();

window.addEventListener("resize", () => {
  setupBackground();
});

function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function setTheme(color, dark) {
  if (color === null) {
    return;
  }
  if (color === "") {
    localStorage.removeItem("theme");
    localStorage.removeItem("brightness");
    brightness.value = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    target.classList.remove("dark-theme");
    target.classList.remove("light-theme");
    target.setAttribute("style", "");
    reset.setAttribute("disabled", "");
    return;
  }
  reset.removeAttribute("disabled");
  localStorage.setItem("theme", color);
  const intColor = utils.argbFromHex(color);
  const theme = utils.themeFromSourceColor(intColor);
  utils.applyTheme(theme, { target, dark });
}

input.addEventListener("input", (event) => {
  const color = event.target.value;
  setTheme(color, brightness.value === "dark");
});

random.addEventListener("click", () => {
  const color = randomColor();
  input.value = color;
  setTheme(color, brightness.value === "dark");
});

reset.addEventListener("click", () => {
  input.value = "";
  setTheme("", brightness.value === "dark");
});

brightness.addEventListener("change", (e) => {
  const value = e.target.value;
  const isDark = value === "dark";
  if (isDark) {
    target.classList.remove("light-theme");
    target.classList.add("dark-theme");
  } else {
    target.classList.remove("dark-theme");
    target.classList.add("light-theme");
  }
  const color = localStorage.getItem("theme");
  if (color) {
    setTheme(color, isDark);
  }
  localStorage.setItem("brightness", value);
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    const isDark = event.matches;
    const color = localStorage.getItem("theme");
    setTheme(color, isDark);
  });

const savedTheme = localStorage.getItem("theme");
const savedBrightness = localStorage.getItem("brightness");
brightness.value =
  savedBrightness || window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
if (savedTheme) {
  setTheme(savedTheme, savedBrightness === "dark");
}
