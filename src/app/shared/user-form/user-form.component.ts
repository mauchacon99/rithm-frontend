import { Component, forwardRef, Input } from '@angular/core';
import {
  AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, NG_VALIDATORS,
  NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators,
} from '@angular/forms';
import { PasswordRequirements } from 'src/helpers/password-requirements';

/**
 * Reusable form component that gets a user's first and last names, email, and password.
 */
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UserFormComponent),
      multi: true
    }
  ]
})
export class UserFormComponent implements ControlValueAccessor, Validator {
  /** Whether this form is to be used for account create (defaults to `false`). */
  @Input() accountCreate = false;

  /** The form for the user info. */
  userForm: FormGroup;

  /** Whether the password requirements are visible. */
  passwordRequirementsVisible = false;

  /** Show passwords match validation in child component. */
  showMatch = false;

  /** What errors to get from validator. */
  errorsToGet = '';

  passwordRequirements = new PasswordRequirements();

  constructor(
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
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
    });
  }

  /**
   * The label to be displayed above password fields.
   *
   * @param confirm Whether the password label is for the confirm field (defaults to `false`).
   * @returns The input label text.
   */
  getPasswordLabel(confirm = false): string {
    const confirmText = confirm ? 'confirm ' : '';
    const passwordText = this.accountCreate ? 'password' : 'new password';
    const label = confirmText + passwordText;
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  /**
   * Toggles visibility of the password requirements popup.
   *
   * @param errorsFieldToCheck The field to get errors for child component.
   */
  togglePasswordRequirements(errorsFieldToCheck: string): void {
    this.errorsToGet = errorsFieldToCheck;
    this.passwordRequirementsVisible = !this.passwordRequirementsVisible;
    this.showMatch = errorsFieldToCheck === 'confirmPassword';
  }

  onTouched: () => void = () => { };

  writeValue(val: any): void {
    val && this.userForm.setValue(val, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    console.log("on change");
    this.userForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    console.log("on blur");
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.userForm.disable() : this.userForm.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.userForm.valid ? null : {
      invalidForm: {
        valid: false,
        message: 'User form is invalid'
      }
    };
  }

}
