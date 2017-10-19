import router from '../utils/router';
import ResultTimeOverView from '../views/result-time-over';

export default () => {
  const resultTimeOverView = new ResultTimeOverView();

  resultTimeOverView.onReplayClick = () => {
    router.startNewGame();
  };
  return resultTimeOverView;
};
