import { Component, Input } from '@angular/core';

/**
 * Reusable component for displaying a user's avatar.
 */
@Component({
  selector: 'app-user-avatar[firstName][lastName]',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent {

  /** The first name of the user. */
  @Input() firstName!: string;

  /** The last name of the user. */
  @Input() lastName!: string;

  /** Whether this avatar is being used to display the signed in user in the top navigation. */
  @Input() navProfile = false;

  /** Whether to hide the tooltip hover effect for this avatar. */
  @Input() hideToolTip!: boolean;

  /** Whether to show any badge type or not. */
  @Input() badge: 'none' | 'check' | 'minus' | 'plus' = 'none';

  /** Whether the enabled switching badges on mouseover. */
  @Input() hoverEffect!: boolean;

  /** Whether the cursor is hover then change badge content if is enabled. */
  badgeHover = false;

  /**
   * The first + last initials for the user.
   *
   * @returns The initials.
   */
  get initials(): string {
    const firstInitial = this.firstName ? this.firstName.charAt(0) : '';
    const lastInitial = this.lastName ? this.lastName.charAt(0) : '';

    return firstInitial + lastInitial;
  }
}
