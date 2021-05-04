import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordRequirementsService } from 'src/app/core/password-requirements.service';

/**
 * Component used for creating an account.
 */
@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.scss']
})
export class AccountCreateComponent {
  signUpForm: FormGroup;
  passReqVisible = false;
  showMatch = false;
  errorsToGet = '';

  constructor(
    public fb: FormBuilder,
    private passwordReqService: PasswordRequirementsService

  ) {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          this.passwordReqService.isGreaterThanEightChars(),
          this.passwordReqService.hasOneLowerCaseChar(),
          this.passwordReqService.hasOneUpperCaseChar(),
          this.passwordReqService.hasOneDigitChar(),
          this.passwordReqService.hasOneSpecialChar()
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          this.passwordReqService.isGreaterThanEightChars(),
          this.passwordReqService.hasOneLowerCaseChar(),
          this.passwordReqService.hasOneUpperCaseChar(),
          this.passwordReqService.hasOneDigitChar(),
          this.passwordReqService.hasOneSpecialChar(),
          this.passwordReqService.passwordsMatch()
        ]
      ],
      agreeToTerms: ['', [Validators.required]]
    })
  }

  togglePassReq(errorsFieldToCheck: string): void {
    this.errorsToGet = errorsFieldToCheck;
    this.passReqVisible = !this.passReqVisible;
    if (errorsFieldToCheck === 'confirmPassword') {
      this.showMatch = true;
    }
    if (errorsFieldToCheck === '') {
      this.showMatch = false;
    }
  }

}
