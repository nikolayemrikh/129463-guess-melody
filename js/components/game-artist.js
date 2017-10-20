import router from '../utils/router';
import state from '../state';
import GameArtistView from '../views/game-artist';

export default (data) => {
  const gameArtistView = new GameArtistView(data);
  const remainingTime = state.timer.remainingTime;

  gameArtistView.onSelectChange = (userAnswer) => {
    const ans = {
      timeInSec: state.timer.remainingTime - remainingTime,
      userAnswer
    };
    if (userAnswer !== gameArtistView.correctTrack.artist) {
      state.mistakesCnt++;
      ans.isCorrectAnswer = false;
    } else {
      ans.isCorrectAnswer = true;
    }
    state.answers.push(ans);
    router.updateRoute();
  };
  return gameArtistView;
};
