import { DashboardItem, RoleDashboardMenu } from 'src/models';

/** Interface of data on a dashboard. */
export interface DashboardData {
  /** Specific dashboard id. */
  rithmId: string;

  /** Role of the dashboard. */
  type: RoleDashboardMenu;

  /** Name of the current dashboard. */
  name: string;

  /** List for widgets in the dashboard. */
  widgets: DashboardItem[];

  /** If user can edit the dashboard. */
  isEditable: boolean;

  /** Can view widget. */
  canView: boolean;
}
