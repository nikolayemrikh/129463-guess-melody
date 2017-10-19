import AbstractView from './abstract';
import StateView from './state';
import getElement from '../utils/get-element';

export default class GameGenreView extends AbstractView {
  constructor({correctAnswer, tracks}) {
    super();
    if (!(correctAnswer instanceof Object) ||
      typeof correctAnswer.genre !== `string` ||
      !(correctAnswer.indexes instanceof Array) ||
      !correctAnswer.indexes.every((i) => typeof i === `number`)) {
      throw new Error(`Correct answer obj must have properties \
genre and array of indexes`);
    }

    const props = [`src`, `genre`];

    if (tracks instanceof Array) {
      const isCorrectObjects = tracks.every((track) => {
        for (let prop of props) {
          if (!track.hasOwnProperty(prop) || typeof track[prop] !== `string`) {
            return false;
          }
        }
        return true;
      });
      if (!isCorrectObjects) {
        throw new Error(`Correct track objects must have properties \
          src, artist and image of type string`);
      }
    } else {
      throw new TypeError(`Second argument is not instance of Array`);
    }
    this.tracks = tracks;
    this.correctAnswer = correctAnswer;
  }

  get template() {
    return `<section class="main main--level main--level-artist">
  <div class="main-wrap">
    <h2 class="title">Выберите инди-рок треки</h2>
    <form class="genre">
    ${this.tracks.map((track, i) => `
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
  </div>
</section>`;
  }

  /**
   * @override
   */
  render() {
    const el = getElement(this.template);
    const stateView = new StateView();
    el.insertAdjacentElement(`afterbegin`, stateView.element);
    return el;
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

      this.onSubmit(checkedTracksIndexes);
    });
  }

  onPlayPauseClick() {}

  onTrackCheck() {}

  onSubmit() {}
}
