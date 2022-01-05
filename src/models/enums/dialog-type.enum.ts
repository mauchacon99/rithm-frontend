/**
 * All the contexts for a dialog pop-up.
 */
export enum DialogType {
  /** A pop-up that warns a user. */
  Alert,

  /** A pop-up that asks for confirmation. */
  Confirm,

  /** A pop-up that requires input from a user. */
  Prompt,

  /** The Terms and Conditions modal. */
  Terms,
}
