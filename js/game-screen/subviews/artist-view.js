import AbstractView from '../../abstract-view';

export default class GameArtistView extends AbstractView {
  constructor(currentQuestion) {
    super();
    this._currentQuestion = currentQuestion;
  }

  get template() {
    return `<div class="main-wrap">
  <h2 class="title main-title">${this._currentQuestion.question}</h2>
  <div class="player-wrapper">
    <div class="player">
      <audio src="${this._currentQuestion.src}" autoplay></audio>
      <button class="player-control player-control--pause"></button>
      <div class="player-track">
        <span class="player-status"></span>
      </div>
    </div>
  </div>
  <form class="main-list">
  ${this._currentQuestion.answers.map((ans, i) => `
    <div class="main-answer-wrapper">\
      <input class="main-answer-r" type="radio" id="answer-${i}" name="answer" value="${i}"/>\
      <label class="main-answer" for="answer-${i}">\
        <img class="main-answer-preview" src="${ans.image.url}"\
             alt="${ans.artist}" width="${ans.image.width}" height="${ans.image.height}">\
        ${ans.title}\
      </label>\
    </div>`).join(``)}
  </form>
</div>`;
  }

  bind() {
    const form = this.element.querySelector(`.main-list`);
    this.element.querySelector(`.player-control`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const audioEl = this.element.querySelector(`.player audio`);
      const btn = evt.target;
      btn.classList.toggle(`player-control--pause`);
      btn.classList.toggle(`player-control--play`);
      if (audioEl.paused) {
        audioEl.play();
      } else {
        audioEl.pause();
      }
    });
    this.element.querySelector(`.main-list`).addEventListener(`change`, (evt) => {
      evt.preventDefault();
      const checkedIndex = Number.parseInt(form.answer.value, 10);
      this.onSelectChange(this._checkAnswer(checkedIndex));
    });
  }

  _checkAnswer(index) {
    return this._currentQuestion.answers[index].isCorrect;
  }

  onPlayerControlClick() {}

  onSelectChange() {}
}
