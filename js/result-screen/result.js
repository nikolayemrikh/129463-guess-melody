import config from '../config';
import App from '../app';
import ResultView from './result-view';
import changeView from '../utils/change-view';
import {Status} from '../enums';

class ResultScreen {
  init(gameResult) {
    this._gameResult = gameResult;
    this._view = new ResultView(this._gameResult);
    this._view.onReplayClick = () => {
      App.showGame();
    };
    changeView(this._view);
    if (gameResult.status === Status.WIN) {
      fetch(config.statsUrl).then((data) => {
        data.json().then((results) => {
          this._view.setComparisonMarkup(results);
        });
      }).catch(() => {});
    }
  }
}


export default new ResultScreen();
