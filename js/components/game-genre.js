import state from '../state';
import updateRoute from '../utils/router';
import getElement from '../utils/get-element';
import getStateEl from './state';

const wrapperTpl = `<section class="main main--level main--level-genre"></section>`;

export default ({tracks, rightAnswerIndexes}) => {
  const stateEl = getStateEl(state);
  const template = `<div class="main-wrap">
    <h2 class="title">Выберите инди-рок треки</h2>
    <form class="genre">
    ${tracks.map((track, i) => `
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

  const wrapperEl = getElement(wrapperTpl);

  wrapperEl.appendChild(stateEl);
  wrapperEl.appendChild(getElement(template));
  wrapperEl.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    const btn = evt.target;
    if (btn.classList.contains(`player-control`)) {
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
  const form = wrapperEl.querySelector(`.genre`);
  const answerCheckboxes = [...form.answer];
  const submitBtn = form.querySelector(`.genre-answer-send`);
  submitBtn.disabled = true;

  form.addEventListener(`change`, () => {
    submitBtn.disabled = !answerCheckboxes.some((checkbox) => checkbox.checked);
  });

  form.addEventListener(`submit`, function (evt) {
    evt.preventDefault();

    const checkedTracksIndexes = [...form.answer].filter((checkbox) => {
      return checkbox.checked;
    }).map((elem) => Number.parseInt(elem.value, 10));

    const ans = {
      timeInSec: 35,
      checkedTracksIndexes,
      rightAnswerIndexes
    };
    if (checkedTracksIndexes.length !== rightAnswerIndexes.length) {
      state.mistakesCnt++;
      ans.isCorrectAnswer = false;
    } else {
      const haveEvery = checkedTracksIndexes.every((index) => {
        return rightAnswerIndexes.indexOf(index) !== -1;
      });
      if (!haveEvery) {
        state.mistakesCnt++;
        ans.isCorrectAnswer = false;
      } else {
        ans.isCorrectAnswer = true;
      }
    }

    state.answers.push(ans);
    updateRoute();
  });

  return wrapperEl;
};
