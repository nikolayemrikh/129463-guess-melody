import assert from 'assert';

/**
 * Wrap for assert.throws
 * Compares expectedErrorMessage with throwed from fn with args
 * @param {Function} fn — function to call
 * @param {[]} args — arguments for fn
 * @param {string} expectedErrorMessage
 **/
export default (fn, args, expectedErrorMessage) => {
  assert.throws(() => {
    fn(...args);
  }, (err) => {
    return err.message === expectedErrorMessage;
  });
};
