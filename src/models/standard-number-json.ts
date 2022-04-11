/**
 * Standard JSON format for requests/responses to/from the API where the only item concerned is a single number.
 */
export interface StandardNumberJSON {
  /** The actual number value. */
  data: number;
}
