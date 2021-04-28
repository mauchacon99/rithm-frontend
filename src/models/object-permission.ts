import { Permission } from './permission';

/**
 * Represents a set of permissions to be applied to a specific object.
 */
export interface ObjectPermission {

  /** The set of permissions for the object. */
  permission: Permission;

  /** The global `rithmId` of the object for which these permissions apply. */
  objectRithmId: string;

  // TODO: Update permission models to match back end
}
