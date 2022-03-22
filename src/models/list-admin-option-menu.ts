import { ListAdminOptionMenuType } from './enums';

/**
 * Represents list of admin menu options.
 */
export interface ListAdminOptionsMenu {
  /** Name to show in dom. */
  name: string;
  /** Key property to define type option menu. */
  type: ListAdminOptionMenuType;
}
