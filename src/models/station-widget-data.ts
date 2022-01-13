import { WidgetDocument } from './widget-document';
import { DocumentGenerationStatus } from './enums/document-generation-status.enum';

/**
 * Represents the data the station-widget.
 */
export interface StationWidgetData {
  /** Station name. */
  stationName: string;
  /** Way to generate document. */
  documentGeneratorStatus: DocumentGenerationStatus;
  /** The documents list. */
  documents: WidgetDocument[];
}
