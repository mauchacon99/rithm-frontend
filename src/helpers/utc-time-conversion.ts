

/**
 * Represents methods that help display the passage of utc time.
 */
export class UtcTimeConversion {

  /**
   * Method to show elapsed time from when a document entered it's current station.
   *
   * @param timeEnteredStation gets the timeInStation from a given document.
   */
  timeInStation(timeEnteredStation: number): void {
    /** Determines how many milliseconds have passed from when a document entered a station. */
    const elapsedTime: number = Date.now() - timeEnteredStation;

    if (timeEnteredStation) {

    }
  }
}
