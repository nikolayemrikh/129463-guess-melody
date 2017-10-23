import greetingScreen from './greeting-screen/greeting';
import gameScreen from './game-screen/game';
import resultScreen from './result-screen/result';

// #game?{"answers": [{"timeInSec": 20, "isCorrectAnswer": false}]}
//
// #result?{"status": "time-over"}
// #result?{"status": "attempts-over"}
// #result?{"status": "win", "score"; 17, "winInSeconds": 68, "fastAnswersCount": 7, "mistakesCnt": 2}

export default class App {
  static init() {
    const hashChangeHandler = () => {
      if (!location.hash) {
        this.showGreeting();
        return;
      }
      const hashValue = location.hash.replace(`#`, ``);
      const [hash, json] = hashValue.split(`?`);
      try {
        const obj = JSON.parse(json);
        switch (hash) {
          case `game`:
            const answers = obj.answers;
            if (!(answers instanceof Array)) {
              throw new TypeError(`No answers or wrong type`);
            }
            const correctArray = answers.every((ans) => {
              return ans.hasOwnProperty(`isCorrectAnswer`) && ans.hasOwnProperty(`timeInSec`);
            });
            if (!correctArray) {
              throw new Error(`Array has wrong data`);
            }
            this.showGame(answers);
            break;
          case `result`:
            this.showResult(obj);
            break;
        }
      } catch (err) {
        switch (hash) {
          case `game`:
            this.showGame();
            break;
          case `result`:
            this.showGreeting();
            break;
        }
      }
    };
    window.onhashchange = hashChangeHandler;
    hashChangeHandler();
  }

  static showGreeting() {
    greetingScreen.init();
  }

  static showGame(answers) {
    gameScreen.init(answers);
  }

  static showResult(gameResult) {
    resultScreen.init(gameResult);
  }
}
