import config from '../config';
import Timer from '../utils/timer';

export default class GameModel {
  constructor(questions) {
    this._questions = questions;
  }

  init(answers = []) {
    this.previousQuestion = null;
    this.currentQuestion = null;
    this.answers = answers;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this._setTimer();
  }

  get mistakesCnt() {
    let cnt = 0;
    this.answers.forEach((ans) => {
      if (!ans.isCorrectAnswer) {
        cnt++;
      }
    });
    return cnt;
  }

  nextQuestion() {
    const nextQuestionIndex = this.answers.length;
    this.previousQuestion = this.currentQuestion;
    if (nextQuestionIndex < this._questions.length) {
      this.currentQuestion = this._questions[nextQuestionIndex];
      this.questionStartRemainingTime = this.timer.remainingTime;
      return true;
    }
    this.currentQuestion = null;
    return false;
  }

  _setTimer() {
    let time = 0;
    if (!this.answers.length) {
      time = config.maxTimeInSec;
    } else {
      this.answers.forEach((ans) => {
        time += ans.timeInSec;
      });
      time = config.maxTimeInSec - time;
    }
    this.timer = new Timer(time);
  }
}
