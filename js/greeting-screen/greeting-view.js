import AbstractView from '../abstract-view';

export default class GreetingView extends AbstractView {
  constructor(state) {
    super();
    this._state = state;
  }

  get template() {
    return `<section class="main main--welcome">
  <section class="logo" title="Угадай мелодию"><h1>Угадай мелодию</h1></section>
  <button class="main-play">Начать игру</button>
  <h2 class="title main-title">Правила игры</h2>
  <p class="text main-text">
    Правила просты&nbsp;— за&nbsp;5 минут ответить на все вопросы.<br>
    Ошибиться можно 3 раза.<br>
    Удачи!
  </p>
</section>`;
  }

  bind() {
    this.element.querySelector(`.main-play`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this.onPlayClick();
    });
  }

  onPlayClick() {}
}
