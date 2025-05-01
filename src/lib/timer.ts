export type CountDownTimerOptions = {
  isRunning?: boolean;
  startTime?: number;
  onEnd?: (timer: CountDownTimer) => void;
  onChange?: (timer: CountDownTimer) => void;
};

export class CountDownTimer {
  /** How long the timer has before it's finished */
  private _remainingTime: number = 0;
  /** The time that the timer was started */
  private _startTime: number = 0;
  /** Flag to indicate if the timer is running */
  private _isRunning: boolean = false;
  /** The function to call when the timer ends */
  private _onEnd?: (timer: CountDownTimer) => void;
  private _endTimeout?: number;
  /** The function to call when the timer changes */
  private _onChange?: (timer: CountDownTimer) => void;

  constructor({
    isRunning = false,
    startTime = 0,
    onEnd,
    onChange,
  }: CountDownTimerOptions = {}) {
    this._onEnd = onEnd;
    this._onChange = onChange;
    this._remainingTime = Math.max(0, startTime);
    this.setTime(startTime);
    this.setRunning(isRunning);
  }

  onEnd(callback: (timer: CountDownTimer) => void) {
    this._onEnd = callback;
  }

  removeEndCallback() {
    this._onEnd = undefined;
  }

  onChange(callback: (timer: CountDownTimer) => void) {
    this._onChange = callback;
  }

  removeChangeCallback() {
    this._onChange = undefined;
  }

  private clearEndTimeout() {
    if (this._endTimeout) {
      clearTimeout(this._endTimeout);
      this._endTimeout = undefined;
    }
  }

  private setEndTimeout() {
    this.clearEndTimeout();
    if (this._isRunning) {
      this._endTimeout = window.setTimeout(() => {
        this._isRunning = false;
        this._remainingTime = 0;
        this._endTimeout = undefined;
        this._onChange?.(this);
        this?._onEnd?.(this);
      }, this._remainingTime);
    }
  }

  isRunning(): boolean {
    return this._isRunning;
  }

  /** Returns the time remaining in the timer */
  getTime(): number {
    if (this._isRunning) {
      const now = performance.now();
      const elapsed = now - this._startTime;
      const remaining = this._remainingTime - elapsed;
      return Math.max(0, remaining);
    }
    return this._remainingTime;
  }

  /** Sets the time remaining in the timer */
  setTime(time: number) {
    this._startTime = performance.now();
    this._remainingTime = Math.max(0, time);
    this.setEndTimeout();
    this._onChange?.(this);
  }

  addTime(time: number) {
    const currentTime = this.getTime();
    this.setTime(currentTime + time);
  }

  /** Starts the timer */
  start() {
    if (this._isRunning || this._remainingTime <= 0) {
      return;
    }

    this._startTime = performance.now();
    this._isRunning = true;
    this.setEndTimeout();
    this._onChange?.(this);
  }

  /** Stops the timer */
  pause() {
    if (!this._isRunning) {
      return;
    }

    this._remainingTime = this.getTime();
    this._isRunning = false;

    this.clearEndTimeout();
    this._onChange?.(this);
  }

  setRunning(running: boolean) {
    if (running === this._isRunning) {
      return;
    }
    if (running) {
      this.start();
    } else {
      this.pause();
    }
  }

  /** Toggles the timer */
  toggle() {
    if (this._isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  /** Returns the time in seconds remaining in the timer */
  getTimeSeconds(): number {
    return this.getTime() / 1000;
  }

  /** Returns the time in minutes remaining in the timer */
  getTimeMinutes(): number {
    return this.getTime() / 1000 / 60;
  }

  /** Returns the minutes and seconds remaining rounding up to the nearest second */
  getClockTime(): { minutes: number; seconds: number } {
    const time = Math.ceil(this.getTime() / 1000);
    const minutesTime = Math.floor(time / 60);
    const secondsTime = time % 60;
    return { minutes: minutesTime, seconds: secondsTime };
  }

  getClockTimeString(): string {
    const { minutes, seconds } = this.getClockTime();
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}
