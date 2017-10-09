const intervalKey = Symbol(`key`);

export default class Timer {
  constructor(secondsRemaining) {
    if (!Number.isInteger(secondsRemaining)) {
      throw new TypeError(`Passed argument is not integer`);
    }
    this._secondsRemaining = secondsRemaining;
  }

  start() {
    const tickEvt = new CustomEvent(`onTimerTick`);
    const endEvt = new CustomEvent(`onTimerEnds`);

    this[intervalKey] = setInterval(() => {
      this._secondsRemaining--;
      document.dispatchEvent(tickEvt);

      if (this._secondsRemaining === 0) {
        document.dispatchEvent(endEvt);
        this.stop();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this[intervalKey]);
  }

  tick() {
    this._secondsRemaining--;
  }
}
