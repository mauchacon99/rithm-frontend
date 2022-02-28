import { DashboardItem } from 'src/models';

/** Interface of data on a dashboard. */
export interface EditDataWidget {
  /** Number of the position widget. */
  widgetIndex: number;
  /** String, json stringify of data the widget. */
  widgetItem: DashboardItem;
  /** Number of items to be displayed in the widget to be able to identify in the drawer whether to show alert or not. */
  quantityElementsWidget: number;
}
