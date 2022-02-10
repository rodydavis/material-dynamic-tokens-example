import * as utils from "https://cdn.skypack.dev/@guidezpl/material-color-utilities";

function themeFromSeed(seed) {
  const palette = utils.CorePalette.of(seed);
  return {
    seed: seed,
    schemes: {
      light: utils.Scheme.light(seed),
      dark: utils.Scheme.dark(seed),
    },
    palettes: {
      primary: palette.a1,
      secondary: palette.a2,
      tertiary: palette.a3,
      neutral: palette.n1,
      neutralVariant: palette.n2,
      error: palette.error,
    },
    customColors: [],
  };
}

const target = document.body;

function applyTheme(theme, options) {
  const target = options?.target || document.body;
  const isDark =
    options?.dark ?? window.matchMedia("(prefers-color-scheme: dark)").matches;
  const scheme = isDark ? theme.schemes.dark : theme.schemes.light;
  const json = Object(scheme)["props"];
  for (const [key, value] of Object.entries(json)) {
    const token = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    const color = utils.hexFromArgb(value);
    target.style.setProperty(`--md-sys-color-${token}`, color);
  }
}

function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const input = document.querySelector("#seed");
input.addEventListener("input", (event) => {
  const color = event.target.value;
  setTheme(color);
});

const random = document.querySelector("#random");
random.addEventListener("click", () => {
  const color = randomColor();
  input.value = color;
  setTheme(color);
});

const reset = document.querySelector("#reset");
reset.addEventListener("click", () => {
  input.value = "";
  setTheme("");
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (event) => {
    const isDark = event.matches;
    const color = localStorage.getItem("theme");
    setTheme(color, isDark);
  });

function setTheme(color, isDark) {
  if (color === "") {
    localStorage.removeItem("theme");
    target.setAttribute("style", "");
    return;
  }
  localStorage.setItem("theme", color);
  const intColor = utils.argbFromHex(color);
  const theme = themeFromSeed(intColor);
  applyTheme(theme, target, isDark);
}

const saved = localStorage.getItem("theme");
if (saved) {
  setTheme(saved);
}
