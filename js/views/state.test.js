import assert from 'assert';
import getRadius from '../utils/get-radius';

describe(`Function should correctly calculate circle length`, () => {
  describe(`Normal cases`, () => {
    it(`Should return full length and 0 in initial state`, () => {
      // 2 * 3.14 * 100 = 6.28 * 100 = 628
      assert.equal(getRadius(1, 100).stroke, 628);
      assert.equal(getRadius(1, 100).offset, 0);
    });

    it(`Should return 0 and full length in the final state`, () => {
      // 2 * 3.14 * 100 = 6.28 * 100 = 628
      assert.equal(getRadius(0, 100).stroke, 0);
      assert.equal(getRadius(0, 100).offset, 628);
    });

    it(`Offset and length should be equal on a half`, () => {
      // 2 * 3.14 * 100 / 2 = 3.14 * 100 = 314
      assert.equal(getRadius(0.5, 100).stroke, 314);
      assert.equal(getRadius(0.5, 100).offset, 314);
      assert.ok(getRadius(0.5, 100).offset === getRadius(0.5, 100).stroke);
    });
  });
});
