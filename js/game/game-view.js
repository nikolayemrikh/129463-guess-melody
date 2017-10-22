import AbstractView from '../views/abstract';

export default class GameView extends AbstractView {
  constructor(model) {
    super();
    this.model = model;
  }

  get template() {
    return `<section class="main main--level main--level-${this.model.type}"><div>
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
    ${new Array(this.model.remainingNotes)
      .fill(`<img class="main-mistake" src="img/wrong-answer.png" width="35" height="49">`)
      .join(``)}
  </div>
</div>`;
  }
}
