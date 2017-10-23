import config from '../config';
import App from '../app';
import GameModel from './game-model';
import GameView from './game-view';
import getRandomData from '../utils/random-data';
import changeView from '../utils/change-view';
import {getScore} from '../utils';
import {Status} from '../enums';

const randomData = getRandomData();

class GameScreen {
  constructor(questions = randomData) {
    this._model = new GameModel(questions);
    this._view = new GameView(this._model);
  }

  init(answers = []) {
    this._model.init(answers);
    this._model.nextQuestion();
    this._model.timer.addTickListener(() => this._view.updateTimer());
    this._model.interval = setInterval(() => {
      const isDone = this._model.timer.tick();
      if (isDone) {
        App.showResult({
          status: Status.TIME_OVER
        });
      }
    }, 1000);
    changeView(this._view);
    this._view.updateTimer();
    this._view.onAnswer = this.onAnswer.bind(this);
    this._view.update();
  }

  onAnswer(ans) {
    let isCorrectAnswer = false;
    switch (this._model.currentQuestion.type) {
      case `artist`:
        isCorrectAnswer = this._checkArtistAnswer(ans);
        break;
      case `genre`:
        isCorrectAnswer = this._checkGenreAnswer(ans);
        break;
    }

    if (!isCorrectAnswer) {
      if (this._model.mistakesCnt === 4) {
        App.showResult({
          status: Status.ATTEMPTS_OVER
        });
        return;
      } else {
        this._view.updateMistakes();
      }
    }

    const hasNext = this._model.nextQuestion();
    if (hasNext) {
      this._view.update();
    } else {
      const fastAnswersCount = this._model.answers.filter((answ) => {
        return answ.isCorrectAnswer && (answ.timeInSec <= config.fastAnswerTimeInSec);
      }).length;
      App.showResult({
        status: Status.WIN,
        score: getScore(this._model.answers, config.maxMistakesCount - this._model.mistakesCnt - 1),
        winInSeconds: config.maxTimeInSec - this._model.timer.remainingTime,
        fastAnswersCount,
        mistakesCnt: this._model.mistakesCnt
      });
    }
  }

  _onTick() {
    this._view.updateTimeText();
    this._view.updateStroke();
  }

  _checkArtistAnswer(artistName) {
    const ans = {
      timeInSec: this._model.timer.remainingTime - this._model.questionStartRemainingTime,
      userAnswer: artistName
    };
    if (artistName !== this._model.currentQuestion.correctTrack.artist) {
      ans.isCorrectAnswer = false;
    } else {
      ans.isCorrectAnswer = true;
    }
    this._model.answers.push(ans);
  }

  _checkGenreAnswer(checkedTracksIndexes) {
    const ans = {
      checkedTracksIndexes,
      timeInSec: this._model.timer.remainingTime - this._model.questionStartRemainingTime
    };

    if (checkedTracksIndexes.length !== this._model.currentQuestion.correctAnswer.indexes.length) {
      ans.isCorrectAnswer = false;
    } else {
      const haveEvery = ans.checkedTracksIndexes.every((index) => {
        return this._model.currentQuestion.correctAnswer.indexes.indexOf(index) !== -1;
      });

      if (!haveEvery) {
        ans.isCorrectAnswer = false;
      } else {
        ans.isCorrectAnswer = true;
      }
    }
    this._model.answers.push(ans);
  }
}

export default new GameScreen();
