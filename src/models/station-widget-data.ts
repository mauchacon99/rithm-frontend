import { WidgetDocument } from './widget-document';
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
  documents: WidgetDocument[];
  /** Way to generate document. */
  generationStatus: DocumentGenerationStatus;
}
