import greetingScreen from './greeting-screen/greeting';
import gameScreen from './game-screen/game';
import resultScreen from './result-screen/result';

export default class App {
  static showGreeting() {
    greetingScreen.init();
  }

  static showGame() {
    gameScreen.init();
  }

  static showResult(state) {
    resultScreen.init(state);
  }
}
