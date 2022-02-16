import { StationColumnWidget } from './station-column-widget';

/**
 * Represents the document that show in station-widget.
 */
export interface WidgetStation {
  /** Station Rithm Id. */
  stationRithmId: string;

  /** Represents the columns to display in the station-widget widget. */
  columns: StationColumnWidget[];
}
