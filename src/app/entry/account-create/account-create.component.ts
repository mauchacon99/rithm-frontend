import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';

/**
 * Component used for creating an account.
 */
@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.scss']
})
export class AccountCreateComponent {

  constructor(
    private userService: UserService,
    private errorService: ErrorService
  ) {}

  createAccount(): void {
    this.userService.register('first', 'last', 'email@test.com', 'Qwer5234')
      .pipe(first())
      .subscribe((test) => {
        // RIT-174
        console.log(test);
      }, (error) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error,
          true
        );
      });
  }

}
