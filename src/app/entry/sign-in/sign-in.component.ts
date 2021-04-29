import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';

/**
 * Component for signing into the system.
 */
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  /** The email address that was entered. */
  email = 'jeff.stockett@inpivota.com';

  /** The password that was entered. */
  password = 'R1thm?24601';

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private router: Router
  ) {}

  /**
   * Attempts to sign the user in using the provided credentials.
   */
  signIn(): void {
    // Sign the user in
    this.userService.signIn(this.email, this.password)
    .pipe(first())
    .subscribe(() => {
      this.router.navigateByUrl('dashboard');

    }, (error) => {
      this.errorService.displayError(
        'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
        error,
        true
      );
    });
  }

  goTo(route: string): void {
    this.router.navigateByUrl(route);
  }

}
