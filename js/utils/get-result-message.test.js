import assert from 'assert';
import getResultMessage from './get-result-message';

describe(`getResultMessage()`, () => {
  it(`Player win`, () => {
    const otherPlayersResults = [10, 15];

    const playerResult = {
      isWin: true,
      score: 16,
      remainingTimeInSec: 20,
      remainingNotes: 2
    };

    const result = getResultMessage(playerResult, otherPlayersResults);
    const rightResult = `Вы заняли 1-ое место из 3 игроков. \
Это лучше, чем у 0.67% игроков`;
    assert.strictEqual(result, rightResult);
  });

  it(`isWin in player's result object === false, \
but there're unused notes and time`, () => {
        const otherPlayersResults = [10, 15];

        const playerResult = {
          isWin: false,
          score: 16,
          remainingTimeInSec: 20,
          remainingNotes: 2
        };

        const rightResult = `Не выиграл, но не закончилось время и попытки, \
что-то тут не так...`;
        assert.throws(() => {
          getResultMessage(playerResult, otherPlayersResults);
        }, (err) => {
          return err.message === rightResult;
        });
      });

  it(`Time is over`, () => {
    const otherPlayersResults = [10, 15];

    const playerResult = {
      isWin: false,
      score: 16,
      remainingTimeInSec: 0,
      remainingNotes: 2
    };

    const result = getResultMessage(playerResult, otherPlayersResults);
    const rightResult = `Время вышло! Вы не успели отгадать все мелодии`;
    assert.strictEqual(result, rightResult);
  });

  it(`Ran out of notes`, () => {
    const otherPlayersResults = [10, 15];

    const playerResult = {
      isWin: false,
      score: 16,
      remainingTimeInSec: 20,
      remainingNotes: 0
    };

    const result = getResultMessage(playerResult, otherPlayersResults);
    const rightResult = `У вас закончились все попытки. \
Ничего, повезёт в следующий раз!`;
    assert.strictEqual(result, rightResult);
  });
});
