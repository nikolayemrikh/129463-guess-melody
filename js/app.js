import greetingScreen from './greeting-screen/greeting';
import GameScreen from './game-screen/game';
import resultScreen from './result-screen/result';
import config from './config';
// #game?{"answers": [{"timeInSec": 20, "isCorrect": false}]}
// #result?{"status": "time-over"}
// #result?{"status": "attempts-over"}
// #result?{"status": "win", "score"; 17, "winInSeconds": 68, "fastAnswersCount": 7, "mistakesCnt": 2}
// https://github.com/diafygi/webcrypto-examples#rsa-oaep---encrypt

const cryptoKeys = {};
const importKey = (key, isPrivate) => {
  return new Promise((resolve, reject) => {
    window.crypto.subtle.importKey(
        `jwk`,
        key,
        {
          name: `RSA-OAEP`,
          hash: {name: `SHA-1`},
        },
        false,
        [isPrivate ? `decrypt` : `encrypt`]
    ).then(resolve).catch(reject);
  });
};

/**
 * Перечисление идентификаторов экранов
 * @enum
 */
const ScreenHash = {
  GREETING: ``,
  GAME: `game`,
  RESULT: `result`
};

/**
  * @param {Object} gameResult — словарь состояний игры
  * @return {string} — строка, содержащая объединенные символом ":" числа,
  * описывающие состояние игры
*/
const joinGameResultValues = (gameResult) => {
  const {status, score, winInSeconds, fastAnswersCount, mistakesCnt} = gameResult;
  const arr = [status, score, winInSeconds, fastAnswersCount, mistakesCnt];
  return arr.join(`:`);
};

/**
  * Ф-ия, обратная ф-ии joinGameResultValues
  * @param {Object} strOfHexes — строка, содержащая объединенные символом ":" числа,
  * описывающие состояние игры
  * @return {Object} — словарь состояний игры
*/
const getGameResultFromJoinedHexes = (strOfHexes) => {
  const [status, score, winInSeconds, fastAnswersCount, mistakesCnt] = strOfHexes
      .split(`:`).map((str) => Number.parseInt(str, 10));
  return {
    status,
    score,
    winInSeconds,
    fastAnswersCount,
    mistakesCnt
  };
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * @async
 * @param {Object} privateKey — приватный ключ из связки
 * @param {string} strOfHexes — строка, содержащая объедененные символом ":"
 * hex-ы, в которые превращены десятичные элементы буффера Uint8Array
 * @return {Promise.<string>} — расшифрованная и раскодированная строка состояний игры
*/
const decryptResult = (privateKey, strOfHexes) => {
  if (typeof strOfHexes !== `string`) {
    throw new TypeError(`arguments[1] is not of type string`);
  }
  const arr = strOfHexes.split(`:`).map((str) => Number.parseInt(str, 16));
  const encryptedBuffer = new Uint8Array(arr);
  return new Promise((resolve, reject) => {
    window.crypto.subtle.decrypt({
      name: `RSA-OAEP`
    },
    privateKey,
    encryptedBuffer).then((decrypted) => {
      const decryptedBuffer = new Uint8Array(decrypted);
      const decoded = textDecoder.decode(decryptedBuffer);
      const gameResult = getGameResultFromJoinedHexes(decoded);
      resolve(gameResult);
    }).catch(reject);
  });
};

/**
 * @async
 * @param {Object} publicKey — публичный ключ из связки
 * @param {string} gameResult — словарь состояний игры
 * @return {Promise.<string>} — закодированная и зашифрованная строка состояний игры
*/
const encryptResult = (publicKey, gameResult) => {
  const str = joinGameResultValues(gameResult);
  const buffer = textEncoder.encode(str);
  return new Promise((resolve, reject) => {
    window.crypto.subtle.encrypt({
      name: `RSA-OAEP`
    },
    publicKey,
    buffer
    ).then((encrypted) => {
      const encryptedResult = new Uint8Array(encrypted);
      const joinedHexes = [...encryptedResult].map((num) => num.toString(16)).join(`:`);
      resolve(joinedHexes);
    }).catch(reject);
  });
};

export default class App {
  /**
   * Обрабатывает URL и вызывает метод changeScreen
   * Импортирует публичный и приватный ключи из связки в конфиге
   */
  static init() {
    const hashChangeHandler = () => {
      const hashValue = location.hash.replace(`#`, ``);
      const [hash, data] = hashValue.split(`?`);
      this.changeScreen(hash, data);
    };
    window.onhashchange = hashChangeHandler;
    const keyPromises = [
      importKey(config.keypair.public, false),
      importKey(config.keypair.private, true)
    ];
    const keyPromiseAll = Promise.all(keyPromises);
    const allPromises = [keyPromiseAll, fetch(config.dataUrl)];
    Promise.all(allPromises).then(([keys, questionsData]) => {
      [cryptoKeys.publicKey, cryptoKeys.privateKey] = keys;
      questionsData.json().then((questions) => {
        this.questions = questions;
        this.gameScreen = new GameScreen(questions);
        hashChangeHandler();
      }).catch(() => {
        hashChangeHandler();
      });
    }).catch(() => {
      hashChangeHandler();
    });
  }
  /**
   * @param {string} hash — значения якоря до символа, отделяющего данные в URL
   * @param {string} data — строка с данными из URL после отделяющего символа
   */
  static changeScreen(hash, data) {
    if (hash === ScreenHash.GREETING) {
      greetingScreen.init();
      return;
    }
    switch (hash) {
      case ScreenHash.GAME:
        if (this.questions && this.questions.length) {
          this.gameScreen.init();
        } else {
          this.showGreeting();
        }
        break;
      case ScreenHash.RESULT:
        try {
          decryptResult(cryptoKeys.privateKey, data).then((gameResult) => {
            resultScreen.init(gameResult);
          }).catch(() => {
            this.showGreeting();
          });
        } catch (err) {
          this.showGreeting();
        }
        break;
    }
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
    encryptResult(cryptoKeys.publicKey, gameResult).then((strOfHexes) => {
      location.hash = `${ScreenHash.RESULT}?${strOfHexes}`;
    });
  }
}
