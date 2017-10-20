import state from '../state';
import router from '../utils/router';
import GameGenreView from '../views/game-genre';

export default (data) => {
  const gameGenreView = new GameGenreView(data);
  const remainingTime = state.timer.remainingTime;

  gameGenreView.onSubmit = (checkedTracksIndexes) => {
    const ans = {
      checkedTracksIndexes,
      timeInSec: state.timer.remainingTime - remainingTime
    };

    if (checkedTracksIndexes.length !== gameGenreView.correctAnswer.indexes.length) {
      state.mistakesCnt++;
      ans.isCorrectAnswer = false;
    } else {
      const haveEvery = ans.checkedTracksIndexes.every((index) => {
        return gameGenreView.correctAnswer.indexes.indexOf(index) !== -1;
      });

      if (!haveEvery) {
        state.mistakesCnt++;
        ans.isCorrectAnswer = false;
      } else {
        ans.isCorrectAnswer = true;
      }
    }
    state.answers.push(ans);
    router.updateRoute();
  };

  return gameGenreView;
};
