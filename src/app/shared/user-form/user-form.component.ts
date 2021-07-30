import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, FormBuilder, FormGroup, NG_VALIDATORS,
  NG_VALUE_ACCESSOR, ValidationErrors, Validator, ValidatorFn, Validators,
} from '@angular/forms';
import { UserService } from 'src/app/core/user.service';
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
export class UserFormComponent implements OnInit,ControlValueAccessor, Validator {
  /** Whether this form is to be used for account create (defaults to `false`). */
  @Input() accountCreate = false;

  /** The form for the user info. */
  userForm!: FormGroup;

  /** Whether the password requirements are visible. */
  passwordRequirementsVisible = false;

  /** Show passwords match validation in child component. */
  showMatch = false;

  /** What errors to get from validator. */
  errorsToGet = '';

  /** Helper class for password requirements. */
  passwordRequirements = new PasswordRequirements();

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  /**
   * Set up FormBuilder group.
   */
  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: [
        !this.accountCreate ? this.userService.user?.firstName : '',
        [Validators.required]
      ],
      lastName: [
        !this.accountCreate ? this.userService.user?.lastName : '',
        [Validators.required]
      ],
      email: [
        {
          value: !this.accountCreate ? this.userService.user?.email : '',
          disabled: !this.accountCreate
        },
        [
          Validators.email,
          Validators.required
        ]
      ],
      password: [
        '',
        []
      ],
      confirmPassword: [
        '',
        []
      ],
    });

    const pass: ValidatorFn[] = [
      this.passwordRequirements.isGreaterThanEightChars(),
      this.passwordRequirements.hasOneLowerCaseChar(),
      this.passwordRequirements.hasOneUpperCaseChar(),
      this.passwordRequirements.hasOneDigitChar(),
      this.passwordRequirements.hasOneSpecialChar()
    ];
    const confirmPass = [
      ...pass,
      this.passwordRequirements.passwordsMatch()
    ];

    //Set the validation for passwords.
    if (this.accountCreate) {
      this.userForm.get('password')?.setValidators([...pass, Validators.required]);
      this.userForm.get('confirmPassword')?.setValidators([...confirmPass, Validators.required]);
    } else {
      this.userForm.get('password')?.setValidators(
        [
          ...pass,
          (control: AbstractControl): ValidationErrors | null => {
            // do your validation logic here:
            if (this.userForm?.get('confirmPassword')?.value) {
              if (!control.value) {
                return {required: true};
              }
            }
            // all is fine:
            return null;
          }
        ]
      );
      this.userForm.get('confirmPassword')?.setValidators(
        [
          ...confirmPass,
            (control: AbstractControl): ValidationErrors | null => {
            if (this.userForm?.get('password')?.value) {
              if (!control.value) {
                return {required: true};
              }
            }
            return null;
          }
        ]
      );
    }
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

  /**
   * The `onTouched` function.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => { };

  /**
   * Writes a value to this form.
   *
   * @param val The value to be written.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  writeValue(val: any): void {
    val && this.userForm.setValue(val, { emitEvent: false });
  }

  /**
   * Registers a function with the `onChange` event.
   *
   * @param fn The function to register.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  registerOnChange(fn: any): void {
    // TODO: check for memory leak
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.userForm.valueChanges.subscribe(fn);
  }

  /**
   * Registers a function with the `onTouched` event.
   *
   * @param fn The function to register.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state of this form control.
   *
   * @param isDisabled The disabled state to set.
   */
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.userForm.disable() : this.userForm.enable();
  }

  /**
   * Reports whether this form control is valid.
   *
   * @returns Validation errors, if any.
   */
  validate(): ValidationErrors | null {
    return this.userForm.valid ? null : {
      invalidForm: {
        valid: false,
        message: 'User form is invalid'
      }
    };
  }

}
