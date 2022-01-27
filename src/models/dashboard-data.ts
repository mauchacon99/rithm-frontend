import { DashboardItem } from 'src/models';
/** Interface of data on a dashboard. */
export interface DashboardData {
  /** Specific dashboard id. */
  rithmId: string;

  /** Name of the current dashboard. */
  name: string;

  /** List for widgets in the dashboard. */
  widgets: DashboardItem[];
}
