export default (answers, remainingNotes) => {
  if (!Array.isArray(answers)) {
    throw new TypeError(`First passed argument is not instance of Array`);
  }
  if (!Number.isInteger(remainingNotes)) {
    throw new TypeError(`Second passed argument is not integer`);
  }
  if (answers.length !== 10 || remainingNotes < 0 || remainingNotes > 3) {
    return -1;
  }
  let sum = 0;
  for (let i = 0; i < answers.length; i++) {
    const ans = answers[i];
    if (ans.timeInSec < 30) {
      sum += 2;
    } else {
      sum += 1;
    }
  }
  return sum - (3 - remainingNotes) * 2;
};
