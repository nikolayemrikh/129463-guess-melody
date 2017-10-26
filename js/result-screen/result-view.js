import AbstractView from '../abstract-view';
import {getPluralForm} from '../utils';
import {Status} from '../enums';

const PluralForm = {
  MINUTES: [`минуту`, `минуты`, `минут`],
  SECONDS: [`секунду`, `секунды`, `секунд`],
  SCORE: [`балл`, `балла`, `баллов`],
  MISTAKES: [`ошибку`, `ошибки`, `ошибок`],
  FAST_ANSWERS: [`быстрый`, `быстрых`, `быстрых`],
  PLAYERS: [`игрока`, `игроков`, `игроков`]
};

export default class ResultView extends AbstractView {
  constructor(gameResult, otherPlayersResults = []) {
    super();
    this._otherPlayersResults = otherPlayersResults;
    this._gameResult = gameResult;
  }

  get template() {
    return `<section class="main main--result">
  <section class="logo" title="Угадай мелодию"><h1>Угадай мелодию</h1></section>

  <h2 class="title">${this._getTitleText()}</h2>
  <div class="main-stat">${this._getStatMarkup()}</div>
  ${this._getComparisonMarkup()}
  <span role="button" tabindex="0" class="main-replay">Попробовать ещё раз</span>
</section>`;
  }

  bind() {
    this.element.querySelector(`.main-replay`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this.onReplayClick();
    });
  }

  _getTitleText() {
    let text;
    switch (this._gameResult.status) {
      case Status.ATTEMPTS_OVER:
        text = `Какая жалость!`;
        break;
      case Status.TIME_OVER:
        text = `Увы и ах!`;
        break;
      case Status.WIN:
        text = `Вы настоящий меломан!`;
        break;
    }
    return text;
  }

  _getStatMarkup() {
    const minutes = Math.floor(this._gameResult.winInSeconds / 60);
    const seconds = this._gameResult.winInSeconds - (minutes * 60);

    let text;
    switch (this._gameResult.status) {
      case Status.ATTEMPTS_OVER:
        text = `У вас закончились все попытки.<br>Ничего, повезёт в следующий раз!`;
        break;
      case Status.TIME_OVER:
        text = `Время вышло!<br>Вы не успели отгадать все мелодии`;
        break;
      case Status.WIN:
        text = `За ${minutes} ${getPluralForm(minutes, PluralForm.MINUTES)} \
и ${seconds} ${getPluralForm(seconds, PluralForm.SECONDS)}
    <br>вы&nbsp;набрали ${this._gameResult.score} ${getPluralForm(this._gameResult.score, PluralForm.SCORE)} \
(${this._gameResult.fastAnswersCount} ${getPluralForm(this._gameResult.fastAnswersCount, PluralForm.FAST_ANSWERS)})
    <br>совершив ${this._gameResult.mistakesCnt} ${getPluralForm(this._gameResult.mistakesCnt, PluralForm.MISTAKES)}`;
        break;
    }
    return text;
  }

  _getComparisonMarkup() {
    if (this._gameResult.status !== Status.WIN) {
      return ``;
    }
    const results = this._otherPlayersResults.slice();
    results.push(this._gameResult.score);
    results.sort((a, b) => b - a); // Сортируем в порядке убывания
    const positionNumber = results.indexOf(this._gameResult.score) + 1;
    const percent = Math.round(
        (results.length - positionNumber) * 100 /
        results.length
    );

    const playerPluralForm = getPluralForm(results.length, PluralForm.PLAYERS);
    const percentPluralForm = getPluralForm(percent, PluralForm.PLAYERS);

    return `<span class="main-comparison">\
Вы\
${results.length === 1 ? `, как единственный сыгравший,` : ``} \
заняли ${positionNumber} место\
${results.length !== 1 ? ` из ${results.length} ${playerPluralForm}` : ``}.\
${results.length - positionNumber !== 0 ? ` Это лучше, чем у ${percent}% ${percentPluralForm}` : ``}\
</span>`;
  }

  onReplayClick() {}
}
