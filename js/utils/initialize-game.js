import config from '../config';
import state from '../state';
import getGameArtistData from './get-game-artist-random-data';
import getGameGenreData from './get-game-genre-random-data';

export default () => {
  Object.assign(state, {
    timeInSec: config.maxTimeInSec,
    mistakesCnt: 0,
    remainingNotes: config.maxMistakesCount - 0,
    answers: [],
    questions: [],
    currentQuestionIndex: 0
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
};
