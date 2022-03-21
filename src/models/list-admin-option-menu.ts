/**
 * Represents list of admin menu options.
 */
export interface ListAdminOptionsMenu {
  /** Name to show in dom. */
  name: string;
  /** Key property to define type option menu. */
  type: ListAdminOptionMenuType;
}
export enum ListAdminOptionMenuType {
  /** Account settings option menu. */
  AccountSettings = 'accountSettings',

  /** Group Hierarchy option menu. */
  GroupHierarchy = 'groupHierarchy',
  /** Directory option menu. */
  Directory = 'directory',
  /** Integration option menu.*/
  Integrations = 'integrations',
}
