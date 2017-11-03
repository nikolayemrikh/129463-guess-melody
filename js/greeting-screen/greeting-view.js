import config from '../config';
import {getPluralForm} from '../utils';
import AbstractView from '../abstract-view';

const PluralForm = {
  COUNT: [`раз`, `раза`, `раз`],
  MINUTES: [`минуту`, `минуты`, `минут`],
  SECONDS: [`секунду`, `секунды`, `секунд`]
};

export default class GreetingView extends AbstractView {
  constructor(state) {
    super();
    this._state = state;
  }

  get template() {
    const minutes = Math.floor(config.maxTime / 60);
    const seconds = config.maxTime - (minutes * 60);
    return `<section class="main main--welcome">
  <section class="logo" title="Угадай мелодию"><h1>Угадай мелодию</h1></section>
  <button class="main-play">Начать игру</button>
  <h2 class="title main-title">Правила игры</h2>
  <p class="text main-text">
    Правила просты&nbsp;— за&nbsp;${minutes} ${getPluralForm(minutes, PluralForm.MINUTES)} \
${seconds !== 0 ? `${seconds} ${getPluralForm(minutes, PluralForm.MINUTES)} ` : ``}\
ответить на все вопросы.<br>
    Ошибиться можно ${config.maxMistakesCount - 1} раза.<br>
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
