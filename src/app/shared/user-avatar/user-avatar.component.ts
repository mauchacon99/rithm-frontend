import { Component, Input, OnInit } from '@angular/core';
import { User, StationRosterMember } from 'src/models';


/**
 * Reusable component for displaying a user's avatar.
 */
@Component({
  selector: 'app-user-avatar[user]',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnInit {
  /** User property. */
  @Input() user!: User | StationRosterMember;

  /** User initials. Set with this.setInitials(). */
  initials = '';

  /** Determine whether this avatar is for a profile or work roster. */
  profile = false;

  /**
   * Determines if this is used as a profile.
   * Ensures that the initials property is set with user's initials.
   */
  ngOnInit(): void {
    if (this.user) {
      this.profile = true;
    }
    this.setInitials();
  }

  /**
   * Obtain user's initials.
   */
  setInitials(): void {
    const firstInitial = this.user.firstName.charAt(0);
    const lastInitial = this.user.lastName.charAt(0);

    this.initials = firstInitial + lastInitial;
  }
}
