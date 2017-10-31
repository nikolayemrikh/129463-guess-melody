import config from '../config';
import Timer from '../utils/timer';
import App from '../app';
import GameModel from './game-model';
import GameView from './game-view';
import changeView from '../utils/change-view';
import {getScore} from '../utils';
import {Status} from '../enums';

export default class GameScreen {
  constructor(questions) {
    this._model = new GameModel(questions);
    this._view = new GameView(this._model);
  }

  init() {
    this._model.init();
    this._timer = new Timer(config.maxTimeInSec);
    this._model.nextQuestion(this._timer.remainingTime);
    this._timer.addTickListener(() => this._view.updateTimer(this._timer.remainingTime));
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    const startTimeout = () => {
      this._timeout = setTimeout(() => {
        const isDone = this._timer.tick();
        if (isDone) {
          App.showResult({
            status: Status.TIME_OVER
          });
          clearTimeout(this._timeout);
        } else {
          startTimeout();
        }
      }, 1000);
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
      if (this._model.mistakesCnt === 4) {
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
      const fastAnswersCount = this._model.answers.filter((answ) => {
        return answ.isCorrect && (answ.timeInSec <= config.fastAnswerTimeInSec);
      }).length;
      const result = {
        status: Status.WIN,
        score: getScore(this._model.answers, config.maxMistakesCount - this._model.mistakesCnt - 1),
        winInSeconds: config.maxTimeInSec - this._timer.remainingTime,
        fastAnswersCount,
        mistakesCnt: this._model.mistakesCnt
      };
      App.postResult(result);
      App.showResult(result);
    }
  }
}
