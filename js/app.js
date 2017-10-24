import greetingScreen from './greeting-screen/greeting';
import gameScreen from './game-screen/game';
import resultScreen from './result-screen/result';

// #game?{"answers": [{"timeInSec": 20, "isCorrectAnswer": false}]}
//
// #result?{"status": "time-over"}
// #result?{"status": "attempts-over"}
// #result?{"status": "win", "score"; 17, "winInSeconds": 68, "fastAnswersCount": 7, "mistakesCnt": 2}

const ScreenHash = {
  GREETING: ``,
  GAME: `game`,
  RESULT: `result`
};

export default class App {
  static init() {
    const hashChangeHandler = () => {
      const hashValue = location.hash.replace(`#`, ``);
      const [hash, json] = hashValue.split(`?`);
      this.changeScreen(hash, json);
    };
    window.onhashchange = hashChangeHandler;
    hashChangeHandler();
  }

  static changeScreen(hash, json) {
    if (hash === ScreenHash.GREETING) {
      greetingScreen.init();
      return;
    }
    switch (hash) {
      case ScreenHash.GAME:
        try {
          const obj = JSON.parse(json);
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
          gameScreen.init(answers);
        } catch (err) {
          gameScreen.init();
        }
        break;
      case ScreenHash.RESULT:
        try {
          const gameResult = JSON.parse(json);
          resultScreen.init(gameResult);
        } catch (err) {
          this.showGreeting();
        }
        break;
    }
  }

  static showGreeting() {
    location.hash = ScreenHash.GREETING;
  }

  static showGame(answers = []) {
    location.hash = `${ScreenHash.GAME}?${JSON.stringify({answers})}`;
  }

  static updateGameHash(answers) {
    history.pushState(null, null, `#${ScreenHash.GAME}?${JSON.stringify({answers})}`);
  }

  static showResult(gameResult) {
    location.hash = `${ScreenHash.RESULT}?${JSON.stringify(gameResult)}`;
  }
}
