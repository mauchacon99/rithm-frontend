import { DashboardItem } from 'src/models';
/** Interface to list widget information on dasboard. */
export interface DashboardData {
  /** Specific dashboard id. */
  rithmId: string;

  /** Name dashboard list. */
  name: string;

  /** List for widgets in the dashbaord. */
  widgets: DashboardItem[];
}
