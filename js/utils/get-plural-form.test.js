import assert from 'assert';
import handleThrow from './handle-assert-throw';
import getPluralForm from './get-plural-form';

const titles = [`минута`, `минуты`, `минут`];

describe(`check plural form`, () => {
  it(`ends with 1 excluding numbers that ends with 11`, () => {
    const rightResult = `минута`;
    assert.strictEqual(getPluralForm(1, titles), rightResult);
    assert.strictEqual(getPluralForm(21, titles), rightResult);
    assert.strictEqual(getPluralForm(31, titles), rightResult);
    assert.strictEqual(getPluralForm(61, titles), rightResult);
    assert.strictEqual(getPluralForm(101, titles), rightResult);
  });

  it(`ends with 2 — 4 excluding numbers that ends with 12 — 14`, () => {
    const rightResult = `минуты`;
    assert.strictEqual(getPluralForm(2, titles), rightResult);
    assert.strictEqual(getPluralForm(3, titles), rightResult);
    assert.strictEqual(getPluralForm(4, titles), rightResult);
    assert.strictEqual(getPluralForm(22, titles), rightResult);
    assert.strictEqual(getPluralForm(23, titles), rightResult);
    assert.strictEqual(getPluralForm(24, titles), rightResult);
    assert.strictEqual(getPluralForm(102, titles), rightResult);
    assert.strictEqual(getPluralForm(103, titles), rightResult);
    assert.strictEqual(getPluralForm(104, titles), rightResult);
  });

  it(`other numbers`, () => {
    const rightResult = `минут`;
    assert.strictEqual(getPluralForm(0, titles), rightResult);
    assert.strictEqual(getPluralForm(5, titles), rightResult);
    assert.strictEqual(getPluralForm(6, titles), rightResult);
    assert.strictEqual(getPluralForm(7, titles), rightResult);
    assert.strictEqual(getPluralForm(8, titles), rightResult);
    assert.strictEqual(getPluralForm(9, titles), rightResult);
    assert.strictEqual(getPluralForm(10, titles), rightResult);
    assert.strictEqual(getPluralForm(11, titles), rightResult);
    assert.strictEqual(getPluralForm(12, titles), rightResult);
    assert.strictEqual(getPluralForm(13, titles), rightResult);
    assert.strictEqual(getPluralForm(14, titles), rightResult);
    assert.strictEqual(getPluralForm(15, titles), rightResult);
    assert.strictEqual(getPluralForm(16, titles), rightResult);
    assert.strictEqual(getPluralForm(17, titles), rightResult);
    assert.strictEqual(getPluralForm(18, titles), rightResult);
    assert.strictEqual(getPluralForm(19, titles), rightResult);
    assert.strictEqual(getPluralForm(20, titles), rightResult);
    assert.strictEqual(getPluralForm(111, titles), rightResult);
    assert.strictEqual(getPluralForm(112, titles), rightResult);
    assert.strictEqual(getPluralForm(113, titles), rightResult);
    assert.strictEqual(getPluralForm(114, titles), rightResult);
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

  it(`should throw an error if elements in titles array are not of type string`, () => {
    const expectedMsg = `Elements in array of titles must be a strings`;
    handleThrow(getPluralForm, [1, [1, 2, 3]], expectedMsg);
    handleThrow(getPluralForm, [1, [[], `k`, {}]], expectedMsg);
    handleThrow(getPluralForm, [1, [null, `минуты`, `минут`]], expectedMsg);
  });
});
