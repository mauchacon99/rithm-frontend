import { StationRosterMember } from './station-roster-member';

/**
 * Represents the document that show in station-widget.
 */
export interface WidgetDocument {
  /** Document Rithm Id. */
  rithmId: string;
  /** Document name. */
  name: string;
  /** Document priority. */
  priority: number;
  /** Time in station. */
  flowedTimeUTC: string;
  /** Last Updated. */
  lastUpdatedUTC: string;
  /** User assigned. */
  assignedUser: StationRosterMember;
}
