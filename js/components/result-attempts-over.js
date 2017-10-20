import router from '../utils/router';
import ResultAttemptsOverView from '../views/result-attempts-over';

export default () => {
  const resultAttemptsOverView = new ResultAttemptsOverView();

  resultAttemptsOverView.onReplayClick = () => {
    router.startNewGame();
  };
  return resultAttemptsOverView;
};
