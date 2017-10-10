export default (num, titles) => {
  if (!Number.isInteger(num)) {
    throw new TypeError(`First passed argument is not integer`);
  }
  if (!Array.isArray(titles)) {
    throw new TypeError(`Second passed argument is not instance of Array`);
  }
  if (!titles.every((title) => typeof title === `string`)) {
    throw new TypeError(`Elements in array of titles must be a strings`);
  }

  if ((num % 10 === 1) && (num % 100 !== 11)) {
    return titles[0];
  } else if ((num % 10 === 2 || num % 10 === 3 || num % 10 === 4) &&
    !(num % 100 === 12 || num % 100 === 13 || num % 100 === 14)) {
    return titles[1];
  } else {
    return titles[2];
  }
};
