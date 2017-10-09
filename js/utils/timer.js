export default class Timer {
  constructor(secondsRemaining) {
    if (!Number.isInteger(secondsRemaining)) {
      throw new TypeError(`Passed argument is not integer`);
    }
    this._secondsRemaining = secondsRemaining;

    const tickEvt = new CustomEvent(`onTimerTick`);
    const endEvt = new CustomEvent(`onTimerEnds`);

    const interval = setInterval(() => {
      this._secondsRemaining--;
      document.dispatchEvent(tickEvt);

      if (this._secondsRemaining === 0) {
        document.dispatchEvent(endEvt);
        clearInterval(interval);
      }
    }, 1000);
  }
}
