/**
 * Standard JSON format for requests/responses to/from the API where the only item concerned is a single boolean.
 */
export interface StandardBooleanJSON {
  /** The actual boolean value. */
  data: boolean;
}
