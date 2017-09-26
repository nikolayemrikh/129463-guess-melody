class App {
  constructor() {
    this._el = document.querySelector(`.app`);
    this._templates = Array.from(window.templates.content.querySelectorAll(`.main`));
    this._currentTplIndex = 0;
    this.showTemplate();
  }

  showTemplate(i = 0) {
    let main = this._el.querySelector(`.main`);
    if (i >= 0 && i < this._templates.length) {
      main.outerHTML = this._templates[i].outerHTML;
      this._currentTplIndex = i;
    }
  }

  handleSwitch() {
    document.addEventListener(`keydown`, (key) => {
      if (!key.altKey) {
        return;
      }
      if (key.keyCode === 37) {
        this.showTemplate(this._currentTplIndex - 1);
      } else if (key.keyCode === 39) {
        this.showTemplate(this._currentTplIndex + 1);
      }
    });
  }
}

const app = new App();
app.handleSwitch();
