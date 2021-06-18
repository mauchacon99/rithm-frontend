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
  @Input() user!: User;

  /** User initials. Set with this.setInitials(). */
  initials = '';

  constructor(
    private userService: UserService
  ) { }

  /**
   * Ensures that the initials property is set with user's initials.
   */
  ngOnInit(): void {
    this.setInitials();
  }

  /**
   * Obtain user's initials.
   */
  setInitials(): void {
    const firstInitial: string = this.user.firstName.charAt(0);
    const lastInitial: string = this.user.lastName.charAt(0);

    this.initials = firstInitial + lastInitial;
  }

  /** PLACEHOLDER, can use this to test profile pic functionality. */
  // Set (click)="setTempProfilePic()" on parent div in the template.
  setTempProfilePic(): void {
    this.user.profilePic = '../../../assets/images/example-profile.jpg';
  }
}
