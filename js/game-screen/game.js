import config from '../config';
import Timer from '../utils/timer';
import App from '../app';
import GameModel from './game-model';
import GameView from './game-view';
import getRandomData from '../utils/random-data';
import changeView from '../utils/change-view';
import {getScore} from '../utils';
import {Status, GameType} from '../enums';

const randomData = getRandomData();

class GameScreen {
  constructor(questions = randomData) {
    this._model = new GameModel(questions);
    this._view = new GameView(this._model);
  }

  init(answers = []) {
    this._model.init(answers);
    if (this._interval) {
      clearInterval(this._interval);
    }
    this._setTimer();
    this._model.nextQuestion(this._timer.remainingTime);
    this._timer.addTickListener(() => this._view.updateTimer(this._timer.remainingTime));
    this._interval = setInterval(() => {
      const isDone = this._timer.tick();
      if (isDone) {
        App.showResult({
          status: Status.TIME_OVER
        });
      }
    }, 1000);
    changeView(this._view);
    this._view.updateTimer(this._timer.remainingTime);
    this._view.onAnswer = this.onAnswer.bind(this);
    this._view.updateSubViews();
  }

  onAnswer(ans) {
    let isCorrect = false;
    switch (this._model.currentQuestion.type) {
      case GameType.ARTIST:
        isCorrect = this._checkArtistAnswer(ans);
        break;
      case GameType.GENRE:
        isCorrect = this._checkGenreAnswer(ans);
        break;
    }

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
console.log(this._model.answers)
    const hasNext = this._model.nextQuestion(this._timer.remainingTime);
    if (hasNext) {
      this._view.updateSubViews();
      App.updateGameHash(this._model.answers);
    } else {
      const fastAnswersCount = this._model.answers.filter((answ) => {
        return answ.isCorrect && (answ.timeInSec <= config.fastAnswerTimeInSec);
      }).length;
      App.showResult({
        status: Status.WIN,
        score: getScore(this._model.answers, config.maxMistakesCount - this._model.mistakesCnt - 1),
        winInSeconds: config.maxTimeInSec - this._timer.remainingTime,
        fastAnswersCount,
        mistakesCnt: this._model.mistakesCnt
      });
    }
  }

  _setTimer() {
    const maxTime = config.maxTimeInSec;
    let time = !this._model.answers.length ? maxTime : maxTime - this._model.answersSummaryTime;
    console.log(time)
    this._timer = new Timer(time);
  }

  _checkArtistAnswer(artistName) {
    const ans = {
      timeInSec: this._model.questionStartRemainingTime - this._timer.remainingTime,
      userAnswer: artistName
    };
    ans.isCorrect = artistName !== this._model.currentQuestion.correctTrack.artist;
    this._model.answers.push(ans);
  }

  _checkGenreAnswer(checkedTracksIndexes) {
    const ans = {
      checkedTracksIndexes,
      timeInSec: this._model.questionStartRemainingTime - this._timer.remainingTime
    };

    if (checkedTracksIndexes.length !== this._model.currentQuestion.correctAnswer.indexes.length) {
      ans.isCorrect = false;
    } else {
      ans.isCorrect = ans.checkedTracksIndexes.every((index) => {
        return this._model.currentQuestion.correctAnswer.indexes.indexOf(index) !== -1;
      });
    }
    this._model.answers.push(ans);
  }
}

export default new GameScreen();
