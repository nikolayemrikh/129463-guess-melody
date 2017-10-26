export default class GameModel {
  constructor(questions) {
    this._questions = questions;
  }

  init(answers = []) {
    this.currentQuestion = null;
    this.answers = answers;
  }

  get mistakesCnt() {
    let cnt = 0;
    for (const ans of this.answers) {
      if (!ans.isCorrect) {
        cnt++;
      }
    }
    return cnt;
  }

  nextQuestion(startRemainingTime) {
    const nextQuestionIndex = this.answers.length;
    if (nextQuestionIndex < this._questions.length) {
      this.currentQuestion = this._questions[nextQuestionIndex];
      this.questionStartRemainingTime = startRemainingTime;
      return true;
    }
    this.currentQuestion = null;
    return false;
  }

  get answersSummaryTime() {
    let time = 0;
    for (const ans of this.answers) {
      time += ans.timeInSec;
    }
    return time;
  }
}
