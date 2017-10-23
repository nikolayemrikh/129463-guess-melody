import App from '../app';
import GreetingView from './greeting-view';
import changeView from '../utils/change-view';
import config from '../config';

class GreetingScreen {
  constructor() {
    const state = {
      time: config.maxTimeInSec,
      maxMistakesCount: config.maxMistakesCount - 1
    };
    this._view = new GreetingView(state);
  }

  init() {
    changeView(this._view);
    this._view.onPlayClick = () => {
      App.showGame();
    };
  }
}


export default new GreetingScreen();
