import config from '../config';
import state from '../state';
import Timer from './timer';
import show from './show';
import gameArtist from '../components/game-artist';
import gameGenre from '../components/game-genre';
import resultWin from '../components/result-win';
import resultTimeOver from '../components/result-time-over';
import resultAttemptsOver from '../components/result-attempts-over';
import getGameArtistData from './get-game-artist-random-data';
import getGameGenreData from './get-game-genre-random-data';

const updateRoute = () => {
  state.remainingNotes = config.maxMistakesCount - 1 - state.mistakesCnt;
  if (state.mistakesCnt === config.maxMistakesCount) {
    clearInterval(state.interval);
    return show(resultAttemptsOver().element);
  } else if (state.timer.remainingTime === 0) {
    clearInterval(state.interval);
    return show(resultTimeOver().element);
  } else if (state.answers.length === state.questions.length) {
    clearInterval(state.interval);
    return show(resultWin().element);
  }
  const nextQuestionIndex = state.answers.length;
  const gameType = state.questions[nextQuestionIndex].type;
  let currentGame = null;
  switch (gameType) {
    case `artist`:
      currentGame = gameArtist;
      break;
    case `genre`:
      currentGame = gameGenre;
      break;
  }
  return show(currentGame(state.questions[nextQuestionIndex]).element);
};

const initGame = () => {
  Object.assign(state, {
    mistakesCnt: 0,
    remainingNotes: config.maxMistakesCount - 1,
    answers: [],
    questions: [],
    currentQuestionIndex: 0,
    timer: new Timer(config.maxTimeInSec)
  });

  const questionsLength = config.maxGameRounds;
  const gameArtistLength = questionsLength / 2;
  const gameGenreLength = questionsLength / 2;

  for (let i = 0; i < gameArtistLength; i++) {
    state.questions.push(Object.assign(getGameArtistData(), {
      type: `artist`
    }));
  }
  for (let i = 0; i < gameGenreLength; i++) {
    state.questions.push(Object.assign(getGameGenreData(), {
      type: `genre`
    }));
  }

  state.interval = setInterval(() => {
    const isDone = state.timer.tick();
    if (isDone) {
      updateRoute();
    }
  }, 1000);
};

const startNewGame = () => {
  initGame();
  updateRoute();
};

export default {
  startNewGame,
  updateRoute
};
