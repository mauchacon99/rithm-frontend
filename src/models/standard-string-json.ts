/**
 * Standard JSON format for requests/responses to/from the API where the only item concerned is a single string.
 */
export interface StandardStringJSON {
  /** The actual string value. */
  data: string;
}
