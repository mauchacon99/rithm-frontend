import { DashboardItem } from 'src/models';
/** interface to list widget information on dasboard */
export interface DashboardWidgetList {
  /** Specific dashboard id.*/
  rithmId: string;

  /** Name dashboard list.*/
  name: string;

  /** List for widgets in the dashbaord. */
  widgets: DashboardItem[];
}
