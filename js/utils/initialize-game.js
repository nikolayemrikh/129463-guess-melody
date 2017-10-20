import config from '../config';
import state from '../state';
import Timer from './timer';
import router from './router';
import getGameArtistData from './get-game-artist-random-data';
import getGameGenreData from './get-game-genre-random-data';

export default () => {
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
      router.updateRoute();
    }
  }, 1000);
};
