import AbstractView from '../../abstract-view';

export default class GameGenreView extends AbstractView {
  constructor(currentQuestion) {
    super();
    this._currentQuestion = currentQuestion;
  }

  get template() {
    return `<div class="main-wrap">
  <h2 class="title">Выберите инди-рок треки</h2>
  <form class="genre">
  ${this._currentQuestion.tracks.map((track, i) => `
    <div class="genre-answer">
      <div class="player-wrapper">
        <div class="player">
          <audio src="${track.src}"></audio>
          <button class="player-control player-control--play"></button>
          <div class="player-track">
            <span class="player-status"></span>
          </div>
        </div>
      </div>
      <input type="checkbox" name="answer" value="${i}" id="a-${i}">
      <label class="genre-answer-check" for="a-${i}"></label>
    </div>`).join(``)}

    <button class="genre-answer-send" type="submit">Ответить</button>
  </form>
</div>`;
  }

  bind() {
    this.element.addEventListener(`click`, (evt) => {
      const btn = evt.target;
      if (btn.classList.contains(`player-control`)) {
        evt.preventDefault();
        const playerEl = btn.closest(`.player`);
        const closestAudioEl = playerEl.querySelector(`audio`);
        btn.classList.toggle(`player-control--pause`);
        btn.classList.toggle(`player-control--play`);
        if (closestAudioEl.paused) {
          closestAudioEl.play();
        } else {
          closestAudioEl.pause();
        }
      }
    });

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

  _checkAnswer(checkedTracksIndexes) {
    return this._currentQuestion.tracks.every((track, i) => {
      const hasCheckedIndex = checkedTracksIndexes.indexOf(i) !== -1;
      return track.isCorrect ? hasCheckedIndex : !hasCheckedIndex;
    });
  }

  onPlayPauseClick() {}

  onTrackCheck() {}

  onSubmit() {}
}
