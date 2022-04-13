import { Question, FrameType, ImageWidgetObject } from 'src/models';
/**
 * Represents the data to be output to the drawer for the setting..
 *
 */
export interface SettingDrawerData {
  /** The possible interface for the drawer configuration field. */
  field: Question | string | ImageWidgetObject;

  /** The type frame for user in drawer setting. */
  frame: FrameType;
}
