import assert from 'assert';
import getScore from './get-score';

describe(`getScore(answers, remainingNotes)`, () => {
  it(`Should return a number that lies in interval [1, 20] \
    if invoked with 10 answers and 0 - 3 remaining notes`, () => {
        for (let k = 0; k < 100; k++) { // 100 раз проверим с разными данными
          const answers = [];
          for (let i = 0; i < 10; i++) { // 10 ответов
            answers[i] = {
              timeInSec: Math.floor(Math.random() * 45) // время от 0 до 45
            };
          }
          // от 0 до 3 оставшихся нот
          const result = getScore(answers, Math.floor(Math.random() * 4));
          assert(result >= 1 && result <= 20);
        }
      });

  it(`Should return -1 if invoked with < 10 or > 10 answers`, () => {
    const answers = [];
    for (let i = 0; i < 9; i++) {
      answers[i] = {
        timeInSec: Math.floor(Math.random() * 45)
      };
    }
    const result1 = getScore(answers, Math.floor(Math.random() * 4));
    assert.strictEqual(result1, -1, `invoked with 9 answers`);

    for (let i = 9; i < 12; i++) {
      answers[i] = {
        timeInSec: Math.floor(Math.random() * 45)
      };
    }

    const result2 = getScore(answers, Math.floor(Math.random() * 4));
    assert.strictEqual(result2, -1, `invoked with 11 answers`);
  });

  it(`Should return -1 if invoked with < 0 or > 3 remaining notes`, () => {
    const answers = [];
    for (let i = 0; i < 10; i++) {
      answers[i] = {
        timeInSec: Math.floor(Math.random() * 45)
      };
    }
    assert.strictEqual(getScore(answers, -1), -1, `invoked with -1 remaining notes`);
    assert.strictEqual(getScore(answers, 4), -1, `invoked with 4 remaining notes`);
  });

  it(`Should return -1 if invoked with not round number of remaining notes`, () => {
    const answers = [];
    for (let i = 0; i < 10; i++) {
      answers[i] = {
        timeInSec: Math.floor(Math.random() * 45)
      };
    }
    assert.strictEqual(getScore(answers, 0.215123), -1, `invoked with 0.21512 remaining notes`);
    assert.strictEqual(getScore(answers, 2.5), -1, `invoked with 2.5 remaining notes`);
    assert.strictEqual(getScore(answers, Math.PI), -1, `invoked with Math.PI remaining notes`);
  });

  it(`Should return -1 if invoked with incompatible data types`, () => {
    assert.strictEqual(getScore(``, []), -1);
    assert.strictEqual(getScore({}, `2`), -1);
    assert.strictEqual(getScore(true, {}), -1);
    assert.strictEqual(getScore(false), -1);
    assert.strictEqual(getScore(`[1, 2]`, NaN), -1);
    assert.strictEqual(getScore(3, Infinity), -1);
    assert.strictEqual(getScore(NaN, -Infinity), -1);
  });

  it(`Should return 10 if invoked with 10 slow answers \
and 3 remaining notes`, () => {
        const answers = [];
        for (let i = 0; i < 10; i++) {
          answers[i] = {
            timeInSec: Math.floor(Math.random() * (50 - 30) + 30) // время от 30 до 50
          };
        }
        const result = getScore(answers, 3);
        assert.strictEqual(result, 10);
      });

  it(`Should return 20 if invoked with 10 fast answers \
and 3 remaining notes`, () => {
        const answers = [];
        for (let i = 0; i < 10; i++) {
          answers[i] = {
            timeInSec: Math.floor(Math.random() * 29) // время от 0 до 29
          };
        }
        const result = getScore(answers, 3);
        assert.strictEqual(result, 20);
      });

  it(`Should return 16 if invoked with 10 fast answers \
and 1 remaining note`, () => {
        const answers = [];
        for (let i = 0; i < 10; i++) {
          answers[i] = {
            timeInSec: Math.floor(Math.random() * 29) // время от 0 до 29
          };
        }
        const result = getScore(answers, 1);
        assert.strictEqual(result, 16);
      });

  it(`Should return 16 if invoked with 8 fast answers, 2 slow answers \
and 2 remaining note`, () => {
        const answers = [];
        for (let i = 0; i < 8; i++) { // 8 быстрых
          answers[i] = {
            timeInSec: Math.floor(Math.random() * 29) // время от 0 до 29
          };
        }
        for (let i = 8; i < 10; i++) { // 2 медленных
          answers[i] = {
            timeInSec: Math.floor(Math.random() * (45 - 30) + 30) // время от 30 до 45
          };
        }
        const result = getScore(answers, 2);
        assert.strictEqual(result, 16);
      });
});
