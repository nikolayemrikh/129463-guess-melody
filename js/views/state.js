import AbstractView from './abstract';
import state from '../state';

export default class StateView extends AbstractView {
  constructor() {
    super();
    this.updateTimeText(state.timer.remainingTime);
  }

  get template() {
    return `<div>
  <svg xmlns="http://www.w3.org/2000/svg" class="timer" viewBox="0 0 780 780">
    <circle
      cx="390" cy="390" r="370"
      class="timer-line"
      style="filter: url(.#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center"></circle>

    <div class="timer-value" xmlns="http://www.w3.org/1999/xhtml">
      <span class="timer-value-mins"></span><!--
      --><span class="timer-value-dots">:</span><!--
      --><span class="timer-value-secs"></span>
    </div>
  </svg>
  <div class="main-mistakes">
    ${new Array(state.remainingNotes)
      .fill(`<img class="main-mistake" src="img/wrong-answer.png" width="35" height="49">`)
      .join(``)}
  </div>
</div>`;
  }

  bind() {
    state.timer.addTickListener(() => {
      this.updateTimeText(state.timer.remainingTime);
    });
  }

  updateTimeText(remainingTime) {
    if (!(this._timerValueMins instanceof HTMLElement) ||
      !(this._timerValueSecs instanceof HTMLElement)) {
      this._timerValueMins = this.element.querySelector(`.timer-value-mins`);
      this._timerValueSecs = this.element.querySelector(`.timer-value-secs`);
    }

    const minutes = Math.floor(remainingTime / 60);
    let minutesStr = minutes.toString();
    minutesStr = minutesStr.length === 1 ? `0` + minutesStr : minutesStr;
    const seconds = remainingTime - (minutes * 60);
    let secondsStr = seconds.toString();
    secondsStr = secondsStr.length === 1 ? `0` + secondsStr : secondsStr;
    this._timerValueMins.textContent = minutesStr;
    this._timerValueSecs.textContent = secondsStr;
  }
}
