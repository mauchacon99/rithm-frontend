import { StationRosterMember } from './station-roster-member';

/**
 * Represents the document that show in station-widget.
 */
export interface DocumentWidgetList {
  /** Document name. */
  DocumentName: string;
  /** User assigned. */
  AssignedUser: StationRosterMember;
  /** Document priority. */
  Priority: number;
  /** Time in station. */
  TimeInStation: string;
  /** Document Rithm Id. */
  DocumentRithmId: string;
}
