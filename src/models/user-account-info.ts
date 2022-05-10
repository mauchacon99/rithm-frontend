import { RoleDashboardMenu } from './enums/role-dashboard-menu.enum';

/**
 * Represents all information about user account.
 */
export interface UserAccountInfo {
  /** The user's first name. */
  firstName?: string;

  /** The user's last name. */
  lastName?: string;

  /** The user's new password. */
  password?: string;

  /** User Image or Photo. */
  vaultRithmId?: string;

  /** Dashboard type default dashboard for this user. */
  defaultDashboardType?: RoleDashboardMenu;

  /** Dashboard rithmId  default dashboard for this user. */
  defaultDashboardId?: string;
}
