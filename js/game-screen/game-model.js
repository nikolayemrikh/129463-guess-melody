import {getMistacesCnt} from '../utils';

export default class GameModel {
  constructor(questions) {
    this._questions = questions;
    this._cachedMistacesCnt = 0;
  }

  init() {
    this.currentQuestion = null;
    this.answers = [];
    this._lastAnswersLength = this.answers.length;
  }

  get mistakesCnt() {
    if (this.answers.length !== this._lastAnswersLength) {
      this._cachedMistacesCnt = getMistacesCnt(this.answers);
    }
    return this._cachedMistacesCnt;
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
}
