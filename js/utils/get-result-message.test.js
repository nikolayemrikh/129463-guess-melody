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
Это лучше, чем у 66.67% игроков`;
    assert.strictEqual(result, rightResult);
  });

  it(`Should give top position between players with same score`, () => {
    const otherPlayersResults = [17, 15, 15];

    const playerResult = {
      isWin: true,
      score: 15,
      remainingTimeInSec: 20,
      remainingNotes: 2
    };

    const result = getResultMessage(playerResult, otherPlayersResults);
    const rightResult = `Вы заняли 2-ое место из 4 игроков. \
Это лучше, чем у 50% игроков`;
    assert.strictEqual(result, rightResult);
  });

  it(`Should give first place out of 1 players if player win with no other players`, () => {
    const otherPlayersResults = [];

    const playerResult = {
      isWin: true,
      score: 16,
      remainingTimeInSec: 20,
      remainingNotes: 2
    };

    const result = getResultMessage(playerResult, otherPlayersResults);
    const rightResult = `Вы заняли 1-ое место из 1 игроков. \
Это лучше, чем у 0% игроков`;
    assert.strictEqual(result, rightResult);
  });

  it(`Should throw an error if isWin in player's result object === false, \
but there're unused notes and time`, () => {
        const otherPlayersResults = [10, 15];

        const playerResult = {
          isWin: false,
          score: 16,
          remainingTimeInSec: 20,
          remainingNotes: 2
        };

        const rightResult = `Player neither did win, nor did lost, something goes wrong...`;
        assert.throws(() => {
          getResultMessage(playerResult, otherPlayersResults);
        }, (err) => {
          return err.message === rightResult;
        });
      });

  it(`Should give a message if time is over`, () => {
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

  it(`Should give a message if player ran out of notes`, () => {
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
