export default (number, titles) => {
  if (!Number.isInteger(number)) {
    throw new TypeError(`First passed argument is not integer`);
  }
  if (!Array.isArray(titles)) {
    throw new TypeError(`Second passed argument is not instance of Array`);
  }
  if (!titles.every((title) => typeof title === `string`)) {
    throw new TypeError(`Elements in array of titles must be a strings`);
  }
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ?
    2 :
    cases[(number % 10 < 5) ? number % 10 : 5]];
};
