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
      fetch(config.statsUrl).then((resp) => {
        if (resp.ok) {
          resp.json().then((results) => {
            this._view.setComparisonMarkup(results);
          });
        }
      });
    }
  }
}


export default new ResultScreen();
