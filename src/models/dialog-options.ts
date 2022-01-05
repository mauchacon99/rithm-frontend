/**
 * Represents all options to configure a dialog.
 */
export interface DialogOptions {
  /** The title to be displayed on the dialog. */
  title: string;

  /** The message text to be displayed on the dialog. */
  message: string;

  /** Whether the dialog is important and should be highlighted in red. */
  important?: boolean;

  /** The text to display for the okay/confirm/dismiss button. */
  okButtonText?: string;

  /** The text to display for the cancel button. */
  cancelButtonText?: string;

  /** The label to display for the input of the prompt dialog. */
  promptLabel?: string;

  /** The text to display in the input for the prompt dialog. */
  promptValue?: string;

  /** The width of dialog. */
  width?: string;
}
