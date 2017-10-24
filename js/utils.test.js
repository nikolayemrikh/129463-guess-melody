import assert from 'assert';
import {getScore, getPluralForm} from './utils';

/**
 * Wrap for assert.throws
 * Compares expectedErrorMessage with throwed from fn with args
 * @param {Function} fn — function to call
 * @param {[]} args — arguments for fn
 * @param {string} expectedErrorMessage
 **/
const handleThrow = (fn, args, expectedErrorMessage) => {
  assert.throws(() => {
    fn(...args);
  }, (err) => {
    return err.message === expectedErrorMessage;
  });
};

const forms = [`минута`, `минуты`, `минут`];

const firstForm = [
  1, 21, 31, 41, 51, 61, 71, 81, 91, 101, 121, 131, 141, 151, 161, 171, 181,
  191, 201, 221, 231, 241, 251, 261, 271, 281, 291
];

const secondForm = [
  2, 3, 4, 22, 23, 24, 32, 33, 34, 42, 43, 44, 52, 53, 54, 62, 63, 64, 72, 73,
  74, 82, 83, 84, 92, 93, 94, 102, 103, 104, 122, 123, 124, 132, 133, 134, 142,
  143, 144, 152, 153, 154, 162, 163, 164, 172, 173, 174, 182, 183
];

const lastForm = [
  0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 26, 27, 28,
  29, 30, 35, 36, 37, 38, 39, 40, 45, 46, 47, 48, 49, 50, 55, 56, 57, 58, 59,
  60, 65, 66, 67, 68, 69, 70, 75, 76, 77
];

describe(`pluralForm()`, () => {
  it(`should give right result with numbers \
which ends with 1 excluding numbers which ends with 11`, () => {
        const rightResult = `минута`;
        firstForm.forEach((num) => {
          assert.strictEqual(getPluralForm(num, forms), rightResult, num);
        });
      });

  it(`should give right result with numbers \
which ends with 2 — 4 excluding numbers which ends with 12 — 14`, () => {
        const rightResult = `минуты`;
        secondForm.forEach((num) => {
          assert.strictEqual(getPluralForm(num, forms), rightResult, num);
        });
      });

  it(`should give right result with other numbers`, () => {
    const rightResult = `минут`;
    lastForm.forEach((num) => {
      assert.strictEqual(getPluralForm(num, forms), rightResult, num);
    });
  });

  it(`shouldn't give same result as numbers which ends with 1 excluding 11`, () => {
    const rightResult = `минута`;
    secondForm.forEach((num) => {
      assert.notStrictEqual(getPluralForm(num, forms), rightResult, num);
    });
    lastForm.forEach((num) => {
      assert.notStrictEqual(getPluralForm(num, forms), rightResult, num);
    });
  });

  it(`shouldn't give same result as numbers which ends with 2 — 4 \
excluding 12 — 14`, () => {
        const rightResult = `минуты`;
        firstForm.forEach((num) => {
          assert.notStrictEqual(getPluralForm(num, forms), rightResult, num);
        });
        lastForm.forEach((num) => {
          assert.notStrictEqual(getPluralForm(num, forms), rightResult, num);
        });
      });

  it(`shouldn't give same result as other numbers`, () => {
    const rightResult = `минут`;
    firstForm.forEach((num) => {
      assert.notStrictEqual(getPluralForm(num, forms), rightResult, num);
    });
    secondForm.forEach((num) => {
      assert.notStrictEqual(getPluralForm(num, forms), rightResult, num);
    });
  });

  it(`should throw an error if invoked with incompatible data types`, () => {
    const expectedIntegerMsg = `First passed argument is not integer`;
    handleThrow(getPluralForm, [[], []], expectedIntegerMsg);
    handleThrow(getPluralForm, [``, []], expectedIntegerMsg);
    handleThrow(getPluralForm, [`2`, []], expectedIntegerMsg);
    handleThrow(getPluralForm, [{}, []], expectedIntegerMsg);
    handleThrow(getPluralForm, [true, []], expectedIntegerMsg);
    handleThrow(getPluralForm, [false, []], expectedIntegerMsg);
    handleThrow(getPluralForm, [NaN, []], expectedIntegerMsg);
    handleThrow(getPluralForm, [Infinity, []], expectedIntegerMsg);
    handleThrow(getPluralForm, [-Infinity, []], expectedIntegerMsg);

    const expectedArrayMsg = `Second passed argument is not instance of Array`;
    handleThrow(getPluralForm, [1, ``], expectedArrayMsg);
    handleThrow(getPluralForm, [1, {}], expectedArrayMsg);
    handleThrow(getPluralForm, [1, true], expectedArrayMsg);
    handleThrow(getPluralForm, [1, false], expectedArrayMsg);
    handleThrow(getPluralForm, [1, `[1, 2]`], expectedArrayMsg);
    handleThrow(getPluralForm, [1, 3], expectedArrayMsg);
    handleThrow(getPluralForm, [1, NaN], expectedArrayMsg);
  });

  it(`should throw an error if elements in forms array are not of type string`, () => {
    const expectedMsg = `Elements in array of forms must be a strings`;
    handleThrow(getPluralForm, [1, [1, 2, 3]], expectedMsg);
    handleThrow(getPluralForm, [1, [[], `k`, {}]], expectedMsg);
    handleThrow(getPluralForm, [1, [null, `минуты`, `минут`]], expectedMsg);
  });
});

describe(`getScore(answers, remainingNotes)`, () => {
  it(`Should return a number that lies in interval [1, 20] \
if invoked with 10 answers and 0 - 3 remaining notes`, () => {
        for (let k = 0; k < 100; k++) { // 100 раз проверим с разными данными
          const answers = [];
          for (let i = 0; i < 10; i++) { // 10 ответов
            answers[i] = {
              isCorrect: true,
              timeInSec: Math.floor(Math.random() * 45) // время от 0 до 45
            };
          }
          // от 0 до 3 оставшихся нот
          const result = getScore(answers, Math.floor(Math.random() * 4));
          assert(result >= 1 && result <= 20);
        }
      });

  it(`Should throw an error if invoked with < 10 or > 10 answers`, () => {
    const answers = [];
    for (let i = 0; i < 9; i++) {
      answers[i] = {
        isCorrect: true,
        timeInSec: Math.floor(Math.random() * 45)
      };
    }
    const expectedMsg = `Array of answers must have length === 10`;
    handleThrow(getScore, [answers, Math.floor(Math.random() * 4)], expectedMsg);

    for (let i = 9; i < 12; i++) {
      answers[i] = {
        isCorrect: true,
        timeInSec: Math.floor(Math.random() * 45)
      };
    }

    handleThrow(getScore, [answers, Math.floor(Math.random() * 4)], expectedMsg);
  });

  it(`Should throw an error if invoked with < 0 or > 3 remaining notes`, () => {
    const answers = [];
    for (let i = 0; i < 10; i++) {
      answers[i] = {
        isCorrect: true,
        timeInSec: Math.floor(Math.random() * 45)
      };
    }

    const expectedMsg = `Number of remaining notes must lie in interval 0 — 3`;
    handleThrow(getScore, [answers, -1], expectedMsg);
    handleThrow(getScore, [answers, 4], expectedMsg);
  });

  it(`Should throw an error if invoked with not integer of remaining notes`, () => {
    const answers = [];
    for (let i = 0; i < 10; i++) {
      answers[i] = {
        isCorrect: true,
        timeInSec: Math.floor(Math.random() * 45)
      };
    }

    const expectedMsg = `Second passed argument is not integer`;
    handleThrow(getScore, [answers, 0.215123], expectedMsg);
    handleThrow(getScore, [answers, 123.91823213], expectedMsg);
    handleThrow(getScore, [answers, Math.PI], expectedMsg);
  });

  it(`Should throw an error if invoked with incompatible data types`, () => {
    const expectedArrayMsg = `First passed argument is not instance of Array`;
    handleThrow(getScore, [``, 1], expectedArrayMsg);
    handleThrow(getScore, [{}, 1], expectedArrayMsg);
    handleThrow(getScore, [true, 1], expectedArrayMsg);
    handleThrow(getScore, [false, 1], expectedArrayMsg);
    handleThrow(getScore, [`[1, 2]`, 1], expectedArrayMsg);
    handleThrow(getScore, [3, 1], expectedArrayMsg);
    handleThrow(getScore, [NaN, 1], expectedArrayMsg);

    const expectedIntegerMsg = `Second passed argument is not integer`;
    handleThrow(getScore, [[], []], expectedIntegerMsg);
    handleThrow(getScore, [[], ``], expectedIntegerMsg);
    handleThrow(getScore, [[], `2`], expectedIntegerMsg);
    handleThrow(getScore, [[], {}], expectedIntegerMsg);
    handleThrow(getScore, [[], true], expectedIntegerMsg);
    handleThrow(getScore, [[], false], expectedIntegerMsg);
    handleThrow(getScore, [[], NaN], expectedIntegerMsg);
    handleThrow(getScore, [[], Infinity], expectedIntegerMsg);
    handleThrow(getScore, [[], -Infinity], expectedIntegerMsg);
  });

  it(`Should return 10 if invoked with 10 slow answers \
and 3 remaining notes`, () => {
        const answers = [];
        for (let i = 0; i < 10; i++) {
          answers[i] = {
            isCorrect: true,
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
            isCorrect: true,
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
            isCorrect: true,
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
            isCorrect: true,
            timeInSec: Math.floor(Math.random() * 29) // время от 0 до 29
          };
        }
        for (let i = 8; i < 10; i++) { // 2 медленных
          answers[i] = {
            isCorrect: true,
            timeInSec: Math.floor(Math.random() * (45 - 30) + 30) // время от 30 до 45
          };
        }
        const result = getScore(answers, 2);
        assert.strictEqual(result, 16);
      });
});
