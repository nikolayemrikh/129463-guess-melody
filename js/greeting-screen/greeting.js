import App from '../app';
import GreetingView from './greeting-view';
import changeView from '../utils/change-view';

class GreetingScreen {
  constructor() {
    this._view = new GreetingView();
  }

  init() {
    changeView(this._view);
    this._view.onPlayClick = () => {
      App.showGame();
    };
  }
}


export default new GreetingScreen();
