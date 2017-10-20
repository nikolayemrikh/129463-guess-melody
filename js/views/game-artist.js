import AbstractView from './abstract';
import StateView from './state';
import getElement from '../utils/get-element';

export default class GameArtistView extends AbstractView {
  constructor({correctTrack, tracks}) {
    super();
    this.correctTrack = correctTrack;
    this.tracks = tracks;
  }

  get template() {
    return `<section class="main main--level main--level-artist">
  <div class="main-wrap">
    <h2 class="title main-title">Кто исполняет эту песню?</h2>
    <div class="player-wrapper">
      <div class="player">
        <audio src="${this.correctTrack.src}" autoplay></audio>
        <button class="player-control player-control--pause"></button>
        <div class="player-track">
          <span class="player-status"></span>
        </div>
      </div>
    </div>
    <form class="main-list">
    ${this.tracks.map((track, i) => `
      <div class="main-answer-wrapper">\
        <input class="main-answer-r" type="radio" id="answer-${i}" name="answer" value="${track.artist}"/>\
        <label class="main-answer" for="answer-${i}">\
          <img class="main-answer-preview" src="${track.image}"\
               alt="${track.artist}" width="134" height="134">\
          ${track.artist}\
        </label>\
      </div>`).join(``)}
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
      const userAnswer = evt.target.value;
      this.onSelectChange(userAnswer);
    });
  }

  onPlayerControlClick() {}

  onSelectChange() {}
}