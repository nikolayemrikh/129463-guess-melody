import config from '../config';
import AbstractView from './abstract';
import getPluralForm from '../utils/get-plural-form';
import getResultMessage from '../utils/get-result-message';
import getScore from '../utils/get-score';
import state from '../state';

const PluralForm = {
  MINUTES: [`минуту`, `минуты`, `минут`],
  SECONDS: [`секунду`, `секунды`, `секунд`],
  SCORE: [`балл`, `балла`, `баллов`],
  MISTAKES: [`ошибку`, `ошибки`, `ошибок`],
  FAST_ANSWERS: [`быстрый`, `быстрых`, `быстрых`]
};

export default class ResultWinView extends AbstractView {
  constructor() {
    super();
  }
  get template() {
    const winInSeconds = config.maxTimeInSec - state.timer.remainingTime;
    const minutes = Math.floor(winInSeconds / 60);
    const seconds = winInSeconds - (minutes * 60);
    const score = getScore(state.answers, state.remainingNotes);

    const fastAnswersCount = state.answers.filter((ans) => {
      return ans.isCorrectAnswer && (ans.timeInSec <= config.fastAnswerTimeInSec);
    }).length;
    return `<section class="main main--result">
  <section class="logo" title="Угадай мелодию"><h1>Угадай мелодию</h1></section>

  <h2 class="title">Вы настоящий меломан!</h2>
  <div class="main-stat">За ${minutes} ${getPluralForm(minutes, PluralForm.MINUTES)} \
и ${seconds} ${getPluralForm(seconds, PluralForm.SECONDS)}
    <br>вы&nbsp;набрали ${score} ${getPluralForm(score, PluralForm.SCORE)} \
(${fastAnswersCount} ${getPluralForm(fastAnswersCount, PluralForm.FAST_ANSWERS)})
    <br>совершив ${state.mistakesCnt} ${getPluralForm(state.mistakesCnt, PluralForm.MISTAKES)}</div>
  <span class="main-comparison">${getResultMessage({isWin: true}, [])}</span>
  <span role="button" tabindex="0" class="main-replay">Сыграть ещё раз</span>
</section>`;
  }

  bind() {
    this.element.querySelector(`.main-replay`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this.onReplayClick();
    });
  }

  onReplayClick() {}
}
