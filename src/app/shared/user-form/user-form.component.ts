import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { PasswordRequirements } from 'src/helpers/password-requirements';

/**
 * Reusable form component that gets a user's first and last names, email, and password.
 */
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  /** Pass password validation to Parent Component. */
  @Output() checkPasswordValidation = new EventEmitter<boolean>();

  /** Receive the FormGroup data from parent. */
  public signUpForm: FormGroup;

  /** Are password requirements visible. */
  passReqVisible = false;

  /** Show passwords match validation in child component. */
  showMatch = false;

  /** What errors to get from validator. */
  errorsToGet = '';

  /** Helper class for password requirements. */
  private passwordRequirements: PasswordRequirements;

  constructor(
    private fb: FormBuilder,
    private controlContainer: ControlContainer
  ) {
    this.passwordRequirements = new PasswordRequirements();

    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          this.passwordRequirements.isGreaterThanEightChars(),
          this.passwordRequirements.hasOneLowerCaseChar(),
          this.passwordRequirements.hasOneUpperCaseChar(),
          this.passwordRequirements.hasOneDigitChar(),
          this.passwordRequirements.hasOneSpecialChar()
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          this.passwordRequirements.isGreaterThanEightChars(),
          this.passwordRequirements.hasOneLowerCaseChar(),
          this.passwordRequirements.hasOneUpperCaseChar(),
          this.passwordRequirements.hasOneDigitChar(),
          this.passwordRequirements.hasOneSpecialChar(),
          this.passwordRequirements.passwordsMatch()
        ]
      ],
      agreeToTerms: [false, [Validators.requiredTrue]]
    });
  }

  /**
   * Sets the FormGroup to be equal to the parent formGroup.
   */
  ngOnInit(): void {
    this.signUpForm = <FormGroup>this.controlContainer.control;
  }

  /**
   * Toggle visibility of password requirements.
   *
   * @param errorsFieldToCheck What field to get errors for child component.
   */
  togglePassReq(errorsFieldToCheck: string): void {
    this.errorsToGet = errorsFieldToCheck;
    this.passReqVisible = !this.passReqVisible;
    this.showMatch = errorsFieldToCheck === 'confirmPassword';
    this.checkPasswordValidation.emit(this.showMatch);
  }

}
