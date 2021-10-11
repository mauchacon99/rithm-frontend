import { DialogType } from '.';

/**
 * Represents all information that a dialog might display.
 */
export interface DialogData {

  /** The title to be displayed on the dialog. */
  title: string;

  /** The message text to be displayed on the dialog. */
  message: string;

  /** Popup.service.ts will automatically assign this. */
  type?: DialogType;

  /** The text to display for the okay/confirm/dismiss button. */
  okButtonText?: string;

  /** The text to display for the cancel button. */
  cancelButtonText?: string;

  /** The label to display for the input of the prompt dialog. */
  promptLabel?: string;

  /** The text to display in the input for the prompt dialog. */
  promptInput?: string;

  /** The width of dialog. */
  width?: string;

  /** Show agree and cancel button. */
  showAgreeButton?: boolean;

}
