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
  constructor(status, gameResult) {
    super();
    this._status = status;
    this._gameResult = gameResult;
  }

  get template() {
    return `<section class="main main--result">
  <section class="logo" title="Угадай мелодию"><h1>Угадай мелодию</h1></section>
  <h2 class="title">${this._getTitleText()}</h2>
  <div class="main-stat">${this._getStatMarkup()}</div>
  <span class="main-comparison"></span>
  <span role="button" tabindex="0" class="main-replay">Попробовать ещё раз</span>
</section>`;
  }

  bind() {
    this._mainComparisonEl = this.element.querySelector(`.main-comparison`);
    this.element.querySelector(`.main-replay`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this.onReplayClick();
    });
  }

  _getTitleText() {
    let text;
    switch (this._status) {
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
    let text;
    switch (this._status) {
      case Status.ATTEMPTS_OVER:
        text = `У вас закончились все попытки.<br>Ничего, повезёт в следующий раз!`;
        break;
      case Status.TIME_OVER:
        text = `Время вышло!<br>Вы не успели отгадать все мелодии`;
        break;
      case Status.WIN:
        const minutes = Math.floor(this._gameResult.winInSeconds / 60);
        const seconds = this._gameResult.winInSeconds - (minutes * 60);
        text = `За ${minutes} ${getPluralForm(minutes, PluralForm.MINUTES)} \
и ${seconds} ${getPluralForm(seconds, PluralForm.SECONDS)}
    <br>вы&nbsp;набрали ${this._gameResult.score} ${getPluralForm(this._gameResult.score, PluralForm.SCORE)} \
(${this._gameResult.fastAnswersCount} ${getPluralForm(this._gameResult.fastAnswersCount, PluralForm.FAST_ANSWERS)})
    <br>совершив ${this._gameResult.mistakesCnt} ${getPluralForm(this._gameResult.mistakesCnt, PluralForm.MISTAKES)}`;
        break;
    }
    return text;
  }

  setComparisonText(otherPlayersResults) {
    if (this._status !== Status.WIN) {
      this._mainComparisonEl.textContent = ``;
      return;
    }
    const results = otherPlayersResults.slice();
    results.push(this._gameResult);
    results.sort((a, b) => {
      const num = b.score - a.score;
      if (num !== 0) {
        return num;
      } else {
        return a.winInSeconds - b.winInSeconds;
      }
    }); // Сортируем в порядке убывания
    const positionNumber = results.indexOf(this._gameResult) + 1;

    const percent = Math.round(
        (results.length - positionNumber) * 100 /
        results.length
    );

    const playerPluralForm = getPluralForm(results.length, PluralForm.PLAYERS);
    const percentPluralForm = getPluralForm(percent, PluralForm.PLAYERS);

    this._mainComparisonEl.textContent = `Вы\
${results.length === 1 ? `, как единственный сыгравший,` : ``} \
заняли ${positionNumber} место\
${results.length !== 1 ? ` из ${results.length} ${playerPluralForm}` : ``}.\
${results.length - positionNumber !== 0 ? ` Это лучше, чем у ${percent}% ${percentPluralForm}` : ``}`;
  }

  onReplayClick() {}
}
