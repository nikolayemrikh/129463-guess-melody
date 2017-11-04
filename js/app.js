import greetingScreen from './greeting-screen/greeting';
import GameScreen from './game-screen/game';
import resultScreen from './result-screen/result';
import config from './config';

/**
 * Перечисление идентификаторов экранов
 * @enum
 */
const ScreenHash = {
  GREETING: ``,
  GAME: `game`,
  RESULT: `result`
};

export default class App {
  /**
   * Обрабатывает URL и вызывает метод changeScreen
   */
  static init() {
    const hashChangeHandler = () => {
      const hash = location.hash.replace(`#`, ``);
      if (hash !== ScreenHash.GREETING && hash !== ScreenHash.GAME) {
        location.hash = ScreenHash.GREETING;
      }
      this.changeScreen(hash);
    };
    window.onhashchange = hashChangeHandler;

    fetch(config.dataUrl).then((questionsData) => {
      questionsData.json().then((questions) => {
        this.questions = questions;
        this.gameScreen = new GameScreen(questions);
        hashChangeHandler();
      }).catch(() => {
        hashChangeHandler();
      });
    });
  }

  /**
   * @param {string} hash
   */
  static changeScreen(hash) {
    if (hash === ScreenHash.GAME && this.questions && this.questions.length) {
      this.gameScreen.init();
      return;
    }
    greetingScreen.init();
  }

  /**
   * Показывает экран приветствия
   */
  static showGreeting() {
    location.hash = ScreenHash.GREETING;
  }

  /**
   * Показывает экран игры
   */
  static showGame() {
    location.hash = ScreenHash.GAME;
  }

  /**
   * Показывает экран результатов
   * @param {Object} gameResult — словарь состояний игры
   */
  static showResult(gameResult) {
    resultScreen.init(gameResult);
    history.pushState(null, null, `#${ScreenHash.RESULT}`);
  }

  static postResult(gameResult) {
    fetch(config.statsUrl, {
      method: `POST`,
      body: JSON.stringify(gameResult),
      headers: {
        "Content-type": `application/json`
      }
    });
  }
}
