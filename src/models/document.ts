/**
 * Previously Started documents data.
 */
export class Document {

  constructor() {
    //setup
  }

  /** Name of the document. */
  docName = '';

  /** Name of the Station. */
  stationName = '';

  /** Date at which the doc entered current station. */
  timeEnteredStation = '';

  /** Time the document has spent in current station. */
  timeInStation? = 0;

  /** Priority of the document. */
  priority = 0;

  /** The user's first name. */
  firstName = '';

  /** The user's last name. */
  lastName = '';

  /**
   * Method converting timeEnteredStation to utc milliseconds.
   *
   * @returns Returns conversion.
   */
  convertTimeEntered(): number {
    const timeEntered = new Date(this.timeEnteredStation);
    return timeEntered.getTime();
  }

  /**
   * Method that updates timeInStation with time elapsed since timeEnteredStation.
   */
  updateTimeInStation?(): void {
    const timeEntered = this.convertTimeEntered();
    this.timeInStation = Date.now() - timeEntered;
  }
}
