import config from '../config';
import Timer from '../utils/timer';
import App from '../app';
import GameModel from './game-model';
import GameView from './game-view';
import changeView from '../utils/change-view';
import {Status} from '../enums';

const TIME_INTERVAL = 1000;

export default class GameScreen {
  constructor(questions) {
    this._model = new GameModel(questions);
    this._view = new GameView(this._model);
  }

  init() {
    this._model.init();
    this._timer = new Timer(config.maxTime);
    this._model.nextQuestion(this._timer.remainingTime);
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    const startTimeout = () => {
      this._timeout = setTimeout(() => {
        const isDone = this._timer.tick();
        this._view.updateTimer(this._timer.remainingTime);
        if (isDone) {
          App.showResult({
            status: Status.TIME_OVER
          });
        } else {
          startTimeout();
        }
      }, TIME_INTERVAL);
    };
    changeView(this._view);
    this._view.onAnswer = this.onAnswer.bind(this);
    this._view.updateTimer(this._timer.remainingTime);
    this._view.updateMistakes();
    this._view.updateSubViews();
    startTimeout();
  }

  onAnswer(isCorrect) {
    const answer = {
      timeInSec: this._model.questionStartRemainingTime - this._timer.remainingTime,
      isCorrect
    };

    this._model.answers.push(answer);

    if (!isCorrect) {
      if (this._model.mistakesCnt === config.maxMistakesCount) {
        App.showResult({
          status: Status.ATTEMPTS_OVER
        });
        return;
      } else {
        this._view.updateMistakes();
      }
    }

    const hasNext = this._model.nextQuestion(this._timer.remainingTime);
    if (hasNext) {
      this._view.updateSubViews();
    } else {
      App.showResult({
        status: Status.WIN,
        answers: this._model.answers
      });
    }
  }
}
