import AbstractView from './abstract-view';
import {PlayerControlClass} from './enums';

export default class PlayerView extends AbstractView {
  constructor(autoplay, src) {
    super();
    this._autoplay = autoplay;
    this._src = src;
  }

  get template() {
    return `\
<div class="player-wrapper">
  <div class="player">
    <audio src="${this._src}" preload="auto"></audio>
    <button class="player-control player-control--play"></button>
    <div class="player-track">
      <span class="player-status"></span>
    </div>
  </div>
</div>`;
  }

  bind() {
    this.audioEl = this.element.querySelector(`.player audio`);
    this.audioBtn = this.element.querySelector(`.player .player-control`);
    if (this._autoplay) {
      this.play();
    }
    this.element.querySelector(`.player-control`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      const btn = evt.target;
      if (btn.classList.contains(PlayerControlClass.PLAY)) {
        this.play();
      } else if (btn.classList.contains(PlayerControlClass.PAUSE)) {
        this.pause();
      }
      this.onPlayClick();
    });
  }

  play() {
    this.audioEl.play().then(() => {
      this.audioBtn.classList.remove(PlayerControlClass.PLAY);
      this.audioBtn.classList.add(PlayerControlClass.PAUSE);
    }).catch(() => {});
  }

  pause() {
    this.audioEl.pause();
    this.audioBtn.classList.remove(PlayerControlClass.PAUSE);
    this.audioBtn.classList.add(PlayerControlClass.PLAY);
  }

  stop() {
    this.pause();
    this.audioEl.currentTime = 0;
  }

  onPlayClick() {}
}
