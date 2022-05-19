import { WidgetDocument } from './widget-document';
import { DocumentGenerationStatus } from './enums/document-generation-status.enum';
import { StationRosterMember } from './station-roster-member';

/**
 * Represents the data the station-widget.
 */
export interface StationWidgetData {
  /** Station name. */
  stationName: string;
  /** Station document generation status. */
  documentGeneratorStatus: DocumentGenerationStatus;

  /** Members from station owners. */
  stationOwners: StationRosterMember;

  /** Members from roster users. */
  rosterUsers: StationRosterMember;

  /** The documents list. */
  documents: WidgetDocument[];
}
