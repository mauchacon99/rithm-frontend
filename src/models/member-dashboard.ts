/**
 * Contains all the data displayed a member on dashboard.
 */
export interface MemberDashboard {
  /** RithmId of member. */
  rithmId: string;
  /** Profile image id. */
  profileImageRithmId: string;
  /** First name of member. */
  firstName: string;
  /** Last  name of member. */
  lastName: string;
  /** Email of member. */
  email: string;
  /** If can view dashboard. */
  canView: boolean;
  /** If can edit dashboard. */
  isEditable: boolean;
  /** Image in Base64 the user. */
  image: string;
  /** Name the image the user. */
  imageName: string;
}
