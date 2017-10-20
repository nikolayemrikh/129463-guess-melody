import config from '../config';
import state from '../state';
import show from './show';
import initGame from '../utils/initialize-game';
import gameArtist from '../components/game-artist';
import gameGenre from '../components/game-genre';
import resultWin from '../components/result-win';
import resultTimeOver from '../components/result-time-over';
import resultAttemptsOver from '../components/result-attempts-over';

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

const startNewGame = () => {
  initGame();
  updateRoute();
};

export default {
  startNewGame,
  updateRoute
};
