export const getScore = (answers, remainingNotes) => {
  if (!Array.isArray(answers)) {
    throw new TypeError(`First passed argument is not instance of Array`);
  }
  if (!Number.isInteger(remainingNotes)) {
    throw new TypeError(`Second passed argument is not integer`);
  }
  if (answers.length !== 10) {
    throw new Error(`Array of answers must have length === 10`);
  }
  if (remainingNotes < 0 || remainingNotes > 3) {
    throw new Error(`Number of remaining notes must lie in interval 0 — 3`);
  }
  let sum = 0;
  for (let i = 0; i < answers.length; i++) {
    const ans = answers[i];
    if (!ans.isCorrectAnswer) {
      continue;
    }
    sum++;
    if (ans.timeInSec < 30) {
      sum++;
    }
  }
  return sum - (3 - remainingNotes) * 2;
};

export const getPluralForm = (count, forms) => {
  if (!Number.isInteger(count)) {
    throw new TypeError(`First passed argument is not integer`);
  }
  if (!Array.isArray(forms)) {
    throw new TypeError(`Second passed argument is not instance of Array`);
  }
  if (!forms.every((title) => typeof title === `string`)) {
    throw new TypeError(`Elements in array of forms must be a strings`);
  }

  const mod10 = count % 10;
  const mod100 = count % 100;
  if ((mod10 === 1) && (count % 100 !== 11)) {
    return forms[0];
  } else if ((mod10 === 2 || mod10 === 3 || mod10 === 4) &&
    !(mod100 === 12 || mod100 === 13 || mod100 === 14)) {
    return forms[1];
  } else {
    return forms[2];
  }
};


export const getElement = (htmlMarkup) => {
  const div = document.createElement(`div`);
  div.innerHTML = htmlMarkup;
  return div.firstElementChild;
};

export const getTimeStrFromNumber = (time) => {
  return time < 10 ? `0${time}` : time;
};
