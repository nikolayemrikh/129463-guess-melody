import greetingScreen from './greeting-screen/greeting';
import gameScreen from './game-screen/game';
import resultScreen from './result-screen/result';

// #game?{"answers": [{"timeInSec": 20, "isCorrect": false}]}
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
          gameScreen.init();
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

  static showGame() {
    location.hash = ScreenHash.GAME;
  }

  static showResult(gameResult) {
    location.hash = `${ScreenHash.RESULT}?${JSON.stringify(gameResult)}`;
  }
}
