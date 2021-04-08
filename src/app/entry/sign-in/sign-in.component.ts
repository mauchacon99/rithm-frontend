import { Component } from '@angular/core';
import { DialogService } from 'src/app/core/dialog.service';

/**
 * Component for signing into the system.
 */
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  constructor(private dialogService: DialogService) {
    this.dialogService.alert({
      title: 'Alert',
      message: 'You are not allowed to view this page.',
      okButtonText: 'That is fine',
      cancelButtonText: 'Abort',
      promptInput: 'Kore wa pen desu.',
      promptLabel: 'Nihongo'
    });
  }


  /**
   * Attempts to sign the user in using the provided credentials.
   */
  signIn(): void {
    // Sign the user in
  }

}
