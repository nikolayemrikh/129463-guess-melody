import router from '../utils/router';
import ResultWinView from '../views/result-win';

export default () => {
  const resultWinView = new ResultWinView();

  resultWinView.onReplayClick = () => {
    router.startNewGame();
  };
  return resultWinView;
};
