import config from '../config';
import getElement from '../utils/get-element';
import show from '../utils/show';
import getPluralForm from '../utils/get-plural-form';
import getResultMessage from '../utils/get-result-message';
import getScore from '../utils/get-score';
import greeting from './greeting';

const PluralForms = {
  MINUTES: [`минута`, `минуты`, `минут`],
  SECONDS: [`секунда`, `секунды`, `секунд`],
  SCORE: [`балл`, `балла`, `баллов`],
  MISTAKES: [`ошибку`, `ошибки`, `ошибок`],
  FAST_ANSWERS: [`быстрый`, `быстрых`, `быстрых`]
};

export default (state) => {
  const minutes = Math.floor(state.timeInSec / 60);
  const seconds = state.timeInSec - minutes * 60;

  const score = getScore(state.answers, state.remainingNotes);

  const fastAnswersCount = state.answers.filter((ans) => {
    return ans.isCorrectAnswer && (ans.timeInSec <= config.fastAnswerTimeInSec);
  }).length;

  const template = `<section class="main main--result">
    <section class="logo" title="Угадай мелодию"><h1>Угадай мелодию</h1></section>

    <h2 class="title">Вы настоящий меломан!</h2>
    <div class="main-stat">За ${minutes} ${getPluralForm(minutes, PluralForms.MINUTES)} \
и ${seconds} ${getPluralForm(seconds, PluralForms.SECONDS)}
      <br>вы&nbsp;набрали ${score} ${getPluralForm(score, PluralForms.SCORE)} \
(${fastAnswersCount} ${getPluralForm(fastAnswersCount, PluralForms.FAST_ANSWERS)})
      <br>совершив ${state.mistakesCnt} ${getPluralForm(state.mistakesCnt, PluralForms.MISTAKES)}</div>
    <span class="main-comparison">${getResultMessage({isWin: true}, [])}</span>
    <span role="button" tabindex="0" class="main-replay">Сыграть ещё раз</span>
  </section>`;
  const el = getElement(template);
  el.querySelector(`.main-replay`).addEventListener(`click`, () => {
    show(greeting());
  });
  return el;
};
