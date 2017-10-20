import router from '../utils/router';
import GreetingView from '../views/greeting';

export default () => {
  const greetingView = new GreetingView();
  greetingView.onPlayClick = () => {
    router.startNewGame();
  };
  return greetingView;
};
