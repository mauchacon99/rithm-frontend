import { WidgetType } from './enums/widget-type.enum';

export interface DashboardItem {
  /** Number of columns that item spans. */
  cols: number;
  /** Number of rows that item spans. */
  rows: number;
  /** The x position of the item in the grid. */
  x: number;
  /** The y position of the item in the grid. */
  y: number;
  /** The widget type, enum of station group, station, document or other. */
  widgetType: WidgetType;
  /**
   * Data to pass to the widget, Data will be different for each widget, document widget will have the documentRithmId
   * that will be passed to a widget component that will make a request to get the document.
   */
  data: string;
  /** Minimum items by rows. */
  minItemRows?: number;
  /** Minimum items by cols. */
  minItemCols?: number;
  /** Maximum items by rows. */
  maxItemRows?: number;
  /** Maximum items by cols. */
  maxItemCols?: number;
}
