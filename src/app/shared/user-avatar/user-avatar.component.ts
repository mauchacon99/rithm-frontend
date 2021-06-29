import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/user.service';
import { User } from 'src/models';


/**
 * Reusable component for displaying a user's avatar.
 */
@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnInit {
  /** User property. */
  @Input() user?: User;

  /** Initials from  DashboardStationData.*/
  @Input() workerInitials?: '';

  /** User initials. Set with this.setInitials(). */
  initials = '';

  /** Determine whether this avatar is for a profile or work roster. */
  profile = false;

  constructor(
    private userService: UserService
  ) { }

  /**
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
    if (this.profile === true) {
      const firstInitial = this.user?.firstName.charAt(0);
      const lastInitial = this.user?.lastName.charAt(0);

      this.initials = firstInitial as string + lastInitial as string;
      return;
    }
    this.initials = this.workerInitials as string;
  }

  /** PLACEHOLDER, can use this to test profile pic functionality. */
  // Set (click)="setTempProfilePic()" on parent div in the template.
  setTempProfilePic(): void {
    if (this.user) {
      this.user.profilePic = '../../../assets/images/example-profile.jpg';
    }
  }
}
