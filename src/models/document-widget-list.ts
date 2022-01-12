import { StationRosterMember } from './station-roster-member';

/**
 * Represents the document that show in station-widget.
 */
export interface WidgetDocument {
  /** Document name. */
  documentName: string;
  /** User assigned. */
  assignedUser: StationRosterMember;
  /** Document priority. */
  priority: number;
  /** Time in station. */
  timeInStation: string;
  /** Document Rithm Id. */
  documentRithmId: string;
}
