import getElement from '../utils/get-element';

export default ({timeInSec, remainingNotes}) => {
  const minutes = Math.floor(timeInSec / 60);
  const minutesStr = minutes.toString();
  const secondsStr = (timeInSec - minutes * 60).toString();
  const template = `<div>
    <svg xmlns="http://www.w3.org/2000/svg" class="timer" viewBox="0 0 780 780">
      <circle
        cx="390" cy="390" r="370"
        class="timer-line"
        style="filter: url(.#blur); transform: rotate(-90deg) scaleY(-1); transform-origin: center"></circle>

      <div class="timer-value" xmlns="http://www.w3.org/1999/xhtml">
        <span class="timer-value-mins">${minutesStr.length === 1
    ? `0` + minutesStr : minutesStr}</span><!--
        --><span class="timer-value-dots">:</span><!--
        --><span class="timer-value-secs">${secondsStr.length === 1
    ? `0` + secondsStr : secondsStr}</span>
      </div>
    </svg>
    <div class="main-mistakes">
      ${new Array(remainingNotes)
      .fill(`<img class="main-mistake" src="img/wrong-answer.png" width="35" height="49">`)
      .join(``)}
    </div>
  </div>`;
  return getElement(template);
};
