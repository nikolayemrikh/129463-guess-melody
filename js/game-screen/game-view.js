import config from '../config';
import AbstractView from '../abstract-view';
import GameArtistView from './subviews/artist-view';
import GameGenreView from './subviews/genre-view';
import {getTimeStrFromNumber} from '../utils';
import {GameType} from '../enums';

const circleRadius = 370;
const circleLength = 2 * Math.PI * circleRadius;

export default class GameView extends AbstractView {
  constructor(model) {
    super();
    this._model = model;
  }

  get template() {
    return `<section class="main main--level"><div>
    <svg xmlns="http://www.w3.org/2000/svg" class="timer" viewBox="0 0 780 780">
      <circle
        cx="390" cy="390" r="${circleRadius}"
        stroke-dasharray="${circleLength}"
        class="timer-line"
        style="filter: url(.#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center"></circle>

      <div class="timer-value" xmlns="http://www.w3.org/1999/xhtml">
        <span class="timer-value-mins"></span><!--
        --><span class="timer-value-dots">:</span><!--
        --><span class="timer-value-secs"></span>
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

    this._circleEl = this.element.querySelector(`circle`);
  }

  _getMistakesMarkup() {
    return new Array(this._model.mistakesCnt)
        .fill(`<img class="main-mistake" src="img/wrong-answer.png" width="35" height="49">`)
        .join(``);
  }

  updateMistakes() {
    this._mistakesContainerEl.innerHTML = this._getMistakesMarkup(this._model.mistakesCnt);
  }

  updateSubViews() {
    const wrapEl = this._containerEl.querySelector(`.main-wrap`);
    if (wrapEl) {
      this._containerEl.removeChild(wrapEl);
    }
    switch (this._model.currentQuestion.type) {
      case GameType.ARTIST:
        this._subView = new GameArtistView(this._model);
        this._subView.onSelectChange = this.onAnswer;
        break;
      case GameType.GENRE:
        this._subView = new GameGenreView(this._model);
        this._subView.onSubmit = this.onAnswer;
        break;
    }
    this._containerEl.appendChild(this._subView.element);
  }

  _getTimeText(remainingTime) {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime - (minutes * 60);
    return [minutes, seconds].map((num) => getTimeStrFromNumber(num));
  }

  updateTimer(remainingTime) {
    const offset = this._getStrokeOffset(remainingTime);
    this._circleEl.setAttribute(`stroke-dashoffset`, circleLength - offset);
    [
      this._timerValueMins.textContent,
      this._timerValueSecs.textContent
    ] = this._getTimeText(remainingTime);
  }

  _getStrokeOffset(remainingTime) {
    const pastTime = config.maxTimeInSec - remainingTime;
    const ratio = pastTime / config.maxTimeInSec;

    return Math.round(circleLength - circleLength * ratio);
  }

  onAnswer() {}
}
