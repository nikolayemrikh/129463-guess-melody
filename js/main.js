const keyCodes = {
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39
};

const app = document.querySelector(`.app`);
const tpls = Array.from(window.templates.content.querySelectorAll(`.main`));

let currentTplIndex = 0;

const showTemplate = (i = 0) => {
  const main = app.querySelector(`.main`);
  if (i >= 0 && i < tpls.length) {
    main.outerHTML = tpls[i].outerHTML;
    currentTplIndex = i;
  }
};

document.addEventListener(`keydown`, (key) => {
  if (!key.altKey) {
    return;
  }
  if (key.keyCode === keyCodes.LEFT_ARROW) {
    showTemplate(currentTplIndex - 1);
  } else if (key.keyCode === keyCodes.RIGHT_ARROW) {
    showTemplate(currentTplIndex + 1);
  }
});

showTemplate();
