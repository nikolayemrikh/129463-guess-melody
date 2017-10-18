import config from '../config';
import state from '../state';
import show from './show';
import gameArtist from '../components/game-artist';
import gameGenre from '../components/game-genre';
import resultWin from '../components/result-win';
// import resultTimeOver from '../components/result-time-over';
import resultAttemptsOver from '../components/result-attempts-over';

export default () => {
  state.remainingNotes = config.maxMistakesCount - state.mistakesCnt;
  if (state.mistakesCnt === 4) {
    return show(resultAttemptsOver());
  } else if (state.answers.length === state.questions.length) {
    return show(resultWin(state));
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
  return show(currentGame(state.questions[nextQuestionIndex]));
};
