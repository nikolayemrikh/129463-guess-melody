import config from '../config';
import App from '../app';
import ResultView from './result-view';
import changeView from '../utils/change-view';
import {Status} from '../enums';
import {getWinResultFromAnswers} from '../utils';

class ResultScreen {
  init({status, answers}) {
    const gameResult = getWinResultFromAnswers(answers);
    App.postResult(gameResult);
    this._view = new ResultView(status, gameResult);
    this._view.onReplayClick = () => {
      App.showGame();
    };
    changeView(this._view);
    if (status === Status.WIN) {
      fetch(config.statsUrl).then((resp) => {
        if (resp.ok) {
          resp.json().then((results) => {
            this._view.setComparisonText(results);
          });
        }
      });
    }
  }
}


export default new ResultScreen();
