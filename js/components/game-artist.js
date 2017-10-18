import getElement from '../utils/get-element';
import getStateEl from './state';
import updateRoute from '../utils/router';
import state from '../state';

const wrapperTpl = `<section class="main main--level main--level-artist"></section>`;

export default ({correctAnswer, tracks}) => {
  const stateEl = getStateEl(state);
  const template = `<div class="main-wrap">
    <h2 class="title main-title">Кто исполняет эту песню?</h2>
    <div class="player-wrapper">
      <div class="player">
        <audio src="${correctAnswer.src}" autoplay></audio>
        <button class="player-control player-control--pause"></button>
        <div class="player-track">
          <span class="player-status"></span>
        </div>
      </div>
    </div>
    <form class="main-list">
    ${tracks.map((track, i) => `
      <div class="main-answer-wrapper">\
        <input class="main-answer-r" type="radio" id="answer-${i}" name="answer" value="${track.artist}"/>\
        <label class="main-answer" for="answer-${i}">\
          <img class="main-answer-preview" src="${track.image}"\
               alt="${track.artist}" width="134" height="134">\
          ${track.artist}\
        </label>\
      </div>`).join(``)}
    </form>
  </div>`;
  const wrapperEl = getElement(wrapperTpl);
  wrapperEl.appendChild(stateEl);
  wrapperEl.appendChild(getElement(template));
  const audioEl = wrapperEl.querySelector(`.player audio`);
  wrapperEl.querySelector(`.player-control`).addEventListener(`click`, (evt) => {
    evt.preventDefault();
    const btn = evt.target;
    btn.classList.toggle(`player-control--pause`);
    btn.classList.toggle(`player-control--play`);
    if (audioEl.paused) {
      audioEl.play();
    } else {
      audioEl.pause();
    }
  });
  wrapperEl.querySelector(`.main-list`).addEventListener(`change`, (evt) => {
    const userAnswer = evt.target.value;
    const ans = {
      timeInSec: 35,
      userAnswer
    };
    if (userAnswer !== correctAnswer.artist) {
      state.mistakesCnt++;
      ans.isCorrectAnswer = false;
    } else {
      ans.isCorrectAnswer = true;
    }
    state.answers.push(ans);
    updateRoute();
    evt.target.checked = false;
  });
  return wrapperEl;
};
