import { DialogOptions, DialogType } from '.';

/**
 * Represents all information that a dialog might display.
 */
export interface DialogData extends DialogOptions {
  /** The type of dialog to be shown to the user. */
  type: DialogType;
}
