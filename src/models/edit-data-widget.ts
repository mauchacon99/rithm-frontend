import { DashboardItem } from 'src/models';

/** Interface of data on a dashboard. */
export interface EditDataWidget {
  /** Number of the position widget. */
  widgetIndex: number;
  /** String, json stringify of data the widget. */
  widgetItem: DashboardItem;
  /** If close drawer when update dashboard. */
  isCloseDrawer?: boolean;
}
