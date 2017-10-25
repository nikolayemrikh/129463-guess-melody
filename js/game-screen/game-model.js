import config from '../config';

export default class GameModel {
  constructor(questions) {
    this._questions = questions;
  }

  init(answers = []) {
    this.previousQuestion = null;
    this.currentQuestion = null;
    this.answers = answers;
  }

  get mistakesCnt() {
    let cnt = 0;
    for (let ans of this.answers) {
      if (!ans.isCorrect) {
        cnt++;
      }
    }
    return cnt;
  }

  nextQuestion(startRemainingTime) {
    const nextQuestionIndex = this.answers.length;
    this.previousQuestion = this.currentQuestion;
    if (nextQuestionIndex < this._questions.length) {
      this.currentQuestion = this._questions[nextQuestionIndex];
      this.questionStartRemainingTime = startRemainingTime;
      return true;
    }
    this.currentQuestion = null;
    return false;
  }

  // _setTimer() {
  //   let time = 0;
  //   if (!this.answers.length) {
  //     time = config.maxTimeInSec;
  //   } else {
  //     this.answers.forEach((ans) => {
  //       time += ans.timeInSec;
  //     });
  //     time = config.maxTimeInSec - time;
  //   }
  //   this.timer = new Timer(time);
  // }

  get answersSummaryTime() {
    let time = 0;
    for (let ans of this.answers) {
      time += ans.timeInSec;
    }
    return time;
  }
}
