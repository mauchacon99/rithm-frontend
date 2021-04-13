import { Component } from '@angular/core';
import { ErrorService } from 'src/app/core/error.service';

/**
 * Component for signing into the system.
 */
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  constructor(private errorService: ErrorService) {
    this.errorService.displayError('Something happened. Try refreshing the page.', new Error('wowowowowowowo'));
  }

  /**
   * Attempts to sign the user in using the provided credentials.
   */
  signIn(): void {
    // Sign the user in
  }

}
