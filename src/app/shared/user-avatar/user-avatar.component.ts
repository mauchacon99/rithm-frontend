import { Component } from '@angular/core';
import { UserService } from 'src/app/core/user.service';


/**
 * Reusable component for displaying a user's avatar.
 */
@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent {

  constructor(
    private userService: UserService
  ) {
    //setup
   }

}
