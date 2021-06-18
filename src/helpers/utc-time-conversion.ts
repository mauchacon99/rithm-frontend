

/**
 * Represents methods that help display the passage of utc time.
 */
export class UtcTimeConversion {
  /**
   * Method converting timeEnteredStation to utc milliseconds.
   *
   * @param entered A utc time formatted string.
   * @returns Returns conversion.
   */
   convertTimeEntered(entered: string): number {
    const timeEntered = new Date(entered);
    return timeEntered.getTime();
  }

  /**
   * Method meant to update the Document timeInStation parameter.
   *
   * @param entered A utc time formatted string.
   * @returns Returns time in milliseconds.
   */
  updateTimeInStation(entered: string): number {
    const timeEntered = this.convertTimeEntered(entered);
    return Date.now() - timeEntered;
  }

  /**
   * Tells how much time has elapsed in either minutes, hours, or days.
   *
   * @param elapsed An amount of milliseconds representing elapsed time.
   * @returns A string with the appropriate expression for how much time has passed.
   */
  convertElapsedTime(elapsed: number): string {
    /*for clarity we will always display millisecond time as an equation representing:
    --milliseconds * seconds * minutes * hours * days--
    eg: an hour is broken into 60 minutes, there are 60 seconds in a minute,and 1000 ms in a second.
    this is written as 1000*60*60 */

    //if elapsed time is less than an hour.
    if (elapsed < 1000 * 60 * 60) {
      if (elapsed < 1000 * 60 * 2) {
        return '1 minute';
      }
      return `${Math.floor(elapsed / (1000 * 60))} minutes`;
    }

    //if elapsed time is less than a day.
    if (elapsed < 1000 * 60 * 60 * 24) {
      if (elapsed < 1000 * 60 * 60 * 2) {
        return `1 hour`;
      }
      return `${Math.floor(elapsed / (1000 * 60 * 60))} hours`;
    }

    //if elapsed time is greater than a day.
    if (elapsed < 1000 * 60 * 60 * 24 * 2) {
      return '1 day';
    }
    return `${Math.floor(elapsed / (1000 * 60 * 60 * 24))} days`;
  }

}
