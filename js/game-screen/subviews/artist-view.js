import AbstractView from '../../abstract-view';
import PlayerView from '../../player';

export default class GameArtistView extends AbstractView {
  constructor(currentQuestion) {
    super();
    this._currentQuestion = currentQuestion;
    this._player = new PlayerView(true, currentQuestion.src);
  }

  get template() {
    return `<div class="main-wrap">
  <h2 class="title main-title">${this._currentQuestion.question}</h2>
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
    form.insertAdjacentElement(`beforebegin`, this._player.element);

    this.element.querySelector(`.main-list`).addEventListener(`change`, (evt) => {
      evt.preventDefault();
      const checkedIndex = Number.parseInt(form.answer.value, 10);
      this.onSelectChange(this._checkAnswer(checkedIndex));
    });
  }

  _checkAnswer(index) {
    return this._currentQuestion.answers[index].isCorrect;
  }

  onSelectChange() {}
}
