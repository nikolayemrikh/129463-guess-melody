import AbstractView from '../../abstract-view';
import PlayerView from '../../player';

export default class GameGenreView extends AbstractView {
  constructor(currentQuestion) {
    super();
    this._currentQuestion = currentQuestion;
    this._correctAnswerIndexes = new Set(this._getCorrectAnswerIndexes());
  }

  get template() {
    return `<div class="main-wrap">
  <h2 class="title">${this._currentQuestion.question}</h2>
  <form class="genre">
  ${this._currentQuestion.answers.map((track, i) => `
    <div class="genre-answer">
      <input type="checkbox" name="answer" value="${i}" id="a-${i}">
      <label class="genre-answer-check" for="a-${i}"></label>
    </div>`).join(``)}

    <button class="genre-answer-send" type="submit">Ответить</button>
  </form>
</div>`;
  }

  bind() {
    const answers = this._currentQuestion.answers;
    const players = [];
    const genreAnswerEls = [...this.element.querySelectorAll(`.genre .genre-answer`)];

    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const genreAnswerEl = genreAnswerEls[i];
      const player = new PlayerView(false, answer.src);
      player.onPlayClick = () => {
        for (const pl of players) {
          if (pl === player) {
            continue;
          }
          pl.pause();
        }
      };
      players.push(player);
      genreAnswerEl.insertAdjacentElement(`afterbegin`, player.element);
    }

    const form = this.element.querySelector(`.genre`);
    const answerCheckboxes = [...form.answer];
    const submitBtn = form.querySelector(`.genre-answer-send`);
    submitBtn.disabled = true;

    form.addEventListener(`change`, () => {
      submitBtn.disabled = !answerCheckboxes.some((checkbox) => checkbox.checked);
    });

    form.addEventListener(`submit`, (evt) => {
      evt.preventDefault();

      const checkedTracksIndexes = [...form.answer].filter((checkbox) => {
        return checkbox.checked;
      }).map((elem) => Number.parseInt(elem.value, 10));

      this.onSubmit(this._checkAnswer(checkedTracksIndexes));
    });
  }

  _getCorrectAnswerIndexes() {
    const indexes = [];
    this._currentQuestion.answers.forEach((ans, i) => {
      if (ans.genre === this._currentQuestion.genre) {
        indexes.push(i);
      }
    });
    return indexes;
  }

  _checkAnswer(checkedTracksIndexes) {
    return checkedTracksIndexes.every((indexEl) => {
      return this._correctAnswerIndexes.has(indexEl);
    });
  }

  onSubmit() {}
}
