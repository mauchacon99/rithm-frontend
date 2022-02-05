/**
 * Represents methods that help display the passage of utc time.
 */
export class UtcTimeConversion {
  /**
   * Method converting a timestamp into a date and time.
   *
   * @param timestamp A UTC time formatted string.
   * @returns String showing date and time.
   */
  getDateAndTime(timestamp: string): string {
    const d = new Date(timestamp),
      minutes =
        d.getMinutes().toString().length === 1
          ? '0' + d.getMinutes()
          : d.getMinutes(),
      hours = d.getHours() > 12 ? d.getHours() - 12 : d.getHours(),
      ampm = d.getHours() >= 12 ? 'pm' : 'am',
      months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
    return (
      months[d.getMonth()] +
      ' ' +
      d.getDate() +
      ', ' +
      d.getFullYear() +
      ' at ' +
      hours +
      ':' +
      minutes +
      ' ' +
      ampm
    );
  }

  /**
   * Method converting a timestamp to UTC milliseconds.
   *
   * @param timeStamp A UTC time formatted string.
   * @returns Milliseconds in Unix time.
   */
  getMilliseconds(timeStamp: string): number {
    //Check if there's been a timestamp entered.
    if (timeStamp === '') {
      return 0;
    }
    const timeEntered = new Date(timeStamp);
    return timeEntered.getTime();
  }

  /**
   * Method to get the number of milliseconds that have passed since entered timestamp.
   *
   * @param timeStamp A UTC time formatted string.
   * @returns Elapsed time in milliseconds.
   */
  getMillisecondsElapsed(timeStamp: string): number {
    const timeEntered = this.getMilliseconds(timeStamp);
    //Check if there's been a timestamp entered.
    if (timeEntered === 0) {
      return 0;
    }
    return Date.now() - timeEntered;
  }

  /**
   * Tells how much time has elapsed in either minutes, hours, or days.
   *
   * @param elapsedTime An amount of milliseconds representing elapsed time.
   * @returns A string with the appropriate expression for how much time has passed.
   */
  getElapsedTimeText(elapsedTime: number): string {
    /* For clarity we will always display millisecond time as an equation representing:
    --milliseconds * seconds * minutes * hours * days--
    eg: an hour is broken into 60 minutes, there are 60 seconds in a minute,and 1000 ms in a second.
    this is written as 1000*60*60 */

    // TODO: [RIT-679] Simplify getElapsedTimeText logic

    //If elapsedTime is set to 0 its because no string was input in a related method.
    //This prevents us from returning NaN.
    if (elapsedTime === 0) {
      return 'Unknown';
    }

    //if elapsed time is less than an hour.
    if (elapsedTime < 1000 * 60 * 60) {
      if (elapsedTime < 1000 * 60 * 2) {
        return '1 minute';
      }
      return `${Math.floor(elapsedTime / (1000 * 60))} minutes`;
    }

    //if elapsed time is less than a day.
    if (elapsedTime < 1000 * 60 * 60 * 24) {
      if (elapsedTime < 1000 * 60 * 60 * 2) {
        return `1 hour`;
      }
      return `${Math.floor(elapsedTime / (1000 * 60 * 60))} hours`;
    }

    //if elapsed time is greater than a day.
    if (elapsedTime < 1000 * 60 * 60 * 24 * 2) {
      return `1 day`;
    }
    return `${Math.floor(elapsedTime / (1000 * 60 * 60 * 24))} days`;
  }
}
