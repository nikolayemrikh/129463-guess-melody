import config from '../config';
import AbstractView from '../abstract-view';
import GameArtistView from './subviews/artist-view';
import GameGenreView from './subviews/genre-view';

export default class GameView extends AbstractView {
  constructor(model) {
    super();
    this._model = model;
  }

  get template() {
    return `<section class="main main--level main--level-${this._model.currentQuestion.type}"><div>
    <svg xmlns="http://www.w3.org/2000/svg" class="timer" viewBox="0 0 780 780">
      <circle
        cx="390" cy="390" r="370"
        class="timer-line"
        style="filter: url(.#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center"></circle>

      <div class="timer-value" xmlns="http://www.w3.org/1999/xhtml">
        <span class="timer-value-mins">${this._getTimeText().minutesStr}</span><!--
        --><span class="timer-value-dots">:</span><!--
        --><span class="timer-value-secs">${this._getTimeText().secondsStr}</span>
      </div>
    </svg>
    <div class="main-mistakes">${this._getMistakesMarkup(this._model.mistakesCnt)}</div>
  </div>
  <div class="game-container"></div>
</section>`;
  }

  bind() {
    this._containerEl = this.element.querySelector(`.game-container`);
    this._mistakesContainerEl = this.element.querySelector(`.main-mistakes`);

    this._timerValueMins = this.element.querySelector(`.timer-value-mins`);
    this._timerValueSecs = this.element.querySelector(`.timer-value-secs`);
  }

  _getMistakesMarkup() {
    return new Array(this._model.mistakesCnt)
        .fill(`<img class="main-mistake" src="img/wrong-answer.png" width="35" height="49">`)
        .join(``);
  }

  updateMistakes() {
    this._mistakesContainerEl.innerHTML = this._getMistakesMarkup(this._model.mistakesCnt);
  }

  update() {
    if (this._model.previousQuestion &&
      this._model.previousQuestion.type !== this._model.currentQuestion.type) {
      this.element.classList.toggle(`main--level-artist`);
      this.element.classList.toggle(`main--level-genre`);
    }
    const wrapEl = this._containerEl.querySelector(`.main-wrap`);
    if (wrapEl) {
      this._containerEl.removeChild(wrapEl);
    }
    switch (this._model.currentQuestion.type) {
      case `artist`:
        this._subView = new GameArtistView(this._model.currentQuestion);
        this._subView.onSelectChange = this.onAnswer;
        break;
      case `genre`:
        this._subView = new GameGenreView(this._model.currentQuestion);
        this._subView.onSubmit = this.onAnswer;
        break;
    }
    this._containerEl.appendChild(this._subView.element);
  }

  _getTimeText() {
    const minutes = Math.floor(this._model.timer.remainingTime / 60);
    let minutesStr = minutes.toString();
    minutesStr = minutesStr.length === 1 ? `0` + minutesStr : minutesStr;
    const seconds = this._model.timer.remainingTime - (minutes * 60);
    let secondsStr = seconds.toString();
    secondsStr = secondsStr.length === 1 ? `0` + secondsStr : secondsStr;
    return {
      minutesStr,
      secondsStr
    };
  }

  updateTimer() {
    this._updateStroke();
    this._updateTimeText();
  }

  _updateStroke() {
    if (!this._circleEl) {
      this._circleEl = this.element.querySelector(`circle`);
      this._circleRadius = this._circleEl.getAttribute(`r`);
      this._circleLength = 2 * Math.PI * this._circleRadius;
      this._circleEl.setAttribute(`stroke-dasharray`, this._circleLength);
    }
    const pastTime = config.maxTimeInSec - this._model.timer.remainingTime;
    const ratio = pastTime / config.maxTimeInSec;
    const circleLength = 2 * Math.PI * this._circleRadius;

    const offset = Math.round(circleLength - circleLength * ratio);
    this._circleEl.setAttribute(`stroke-dashoffset`, this._circleLength - offset);
  }

  _updateTimeText() {
    const {minutesStr, secondsStr} = this._getTimeText();
    this._timerValueMins.textContent = minutesStr;
    this._timerValueSecs.textContent = secondsStr;
  }

  onAnswer() {}
}
