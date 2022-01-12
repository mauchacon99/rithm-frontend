import { DocumentWidgetList } from './document-widget-list';
import { DocumentGenerationStatus } from './enums/document-generation-status.enum';

/**
 * Represents the data the station-widget.
 */
export interface StationWidgetData {
  /** Station name. */
  stationName: string;
  /** Station subtitle. */
  subtitle: string;
  /** The documents list. */
  documents: DocumentWidgetList[];
  /** Way to generate document. */
  generationStatus: DocumentGenerationStatus;
}
