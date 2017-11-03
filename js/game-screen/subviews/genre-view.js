import AbstractView from '../../abstract-view';
import {PlayerControlClass} from '../../enums';

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
    const playerCtrls = new Map();
    for (const ctrlBtn of [...this.element.querySelectorAll(`.player .player-control`)]) {
      const audioEl = ctrlBtn.parentElement.querySelector(`audio`);
      playerCtrls.set(ctrlBtn, audioEl);
    }
    let currCtrlBtn = null;
    let lastPromise = null;

    this.element.addEventListener(`click`, (evt) => {
      const ctrlBtn = evt.target;
      if (ctrlBtn.classList.contains(`player-control`)) {
        evt.preventDefault();
        // Если нажали на стоп играющего
        if (ctrlBtn.classList.contains(PlayerControlClass.PAUSE) &&
          ctrlBtn === currCtrlBtn) {
          const audioEl = playerCtrls.get(ctrlBtn);
          audioEl.pause();
          ctrlBtn.classList.remove(PlayerControlClass.PAUSE);
          ctrlBtn.classList.add(PlayerControlClass.PLAY);
          currCtrlBtn = null;
        } else {
          // Если нажали на плей, но есть играющий
          if (currCtrlBtn !== null) {
            const currAudioEl = playerCtrls.get(currCtrlBtn);
            currAudioEl.pause();
            currAudioEl.currentTime = 0; // Остановим играющий и скинем время
            currCtrlBtn.classList.remove(PlayerControlClass.PAUSE);
            currCtrlBtn.classList.add(PlayerControlClass.PLAY);
          }
          const nextAudioEl = playerCtrls.get(ctrlBtn);

          const playPromise = nextAudioEl.play();
          lastPromise = playPromise;
          playPromise.then(() => {
            // Если загрузился и запустился последний нажатый
            if (playPromise === lastPromise) {
              ctrlBtn.classList.add(PlayerControlClass.PAUSE);
              ctrlBtn.classList.remove(PlayerControlClass.PLAY);
              currCtrlBtn = ctrlBtn;
            } else { // Нажатые ранее, но загруженные остановим
              nextAudioEl.pause();
            }
          }).catch(() => {
            // Если не загрузился последний нажатый — сбросим текущий
            if (playPromise === lastPromise) {
              currCtrlBtn = null;
            }
          });
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

  onPlayPauseClick() {}

  onTrackCheck() {}

  onSubmit() {}
}
