import App from '../app';
import ResultView from './result-view';
import changeView from '../utils/change-view';

class ResultScreen {
  constructor() {
  }

  init(gameResult) {
    this._gameResult = gameResult;
    this._view = new ResultView(this._gameResult);
    this._view.onReplayClick = () => {
      App.showGame();
    };
    changeView(this._view);
  }
}


export default new ResultScreen();
