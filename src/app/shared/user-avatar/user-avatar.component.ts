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

  /** Manage states of badges. */
  @Input() badge!: 'none' | 'check' | 'minus' | 'plus';


  /**
   * The first + last initials for the user.
   *
   * @returns The initials.
   */
  get initials(): string {
    const firstInitial = this.firstName.charAt(0);
    const lastInitial = this.lastName.charAt(0);

    return firstInitial + lastInitial;
  }
}
