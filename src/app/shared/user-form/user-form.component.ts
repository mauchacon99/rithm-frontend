import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { SplitService } from 'src/app/core/split.service';
import { UserService } from 'src/app/core/user.service';
import { FormatImageValidate } from 'src/helpers';
import { PasswordRequirements } from 'src/helpers/password-requirements';
import { User, ImageData } from 'src/models';

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
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UserFormComponent),
      multi: true,
    },
  ],
})
export class UserFormComponent
  implements OnInit, ControlValueAccessor, Validator
{
  /** Whether this form is to be used for account create (defaults to `false`). */
  @Input() accountCreate = false;

  /** The form for the user info. */
  userForm!: FormGroup;

  /** Current user logged in for user-avatar. */
  currentUser!: User;

  /** Whether the password requirements are visible. */
  passwordRequirementsVisible = false;

  /** Show passwords match validation in child component. */
  showMatch = false;

  /** Show section Stations lists. */
  showProfilePhoto = false;

  /** What errors to get from validator. */
  errorsToGet = '';

  /** Helper class for password requirements. */
  passwordRequirements = new PasswordRequirements();

  /** The label text to be displayed for the password field. */
  passwordLabel = '';

  /** The label text to be displayed for the confirm password field. */
  confirmPasswordLabel = '';

  /** User image. */
  userImage!: ImageData;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private popupService: PopupService,
    private splitService: SplitService,
    private errorService: ErrorService
  ) {}

  /**
   * Set up FormBuilder group.
   */
  ngOnInit(): void {
    if (!this.accountCreate) {
      this.split();
      this.currentUser = this.userService.user;
    }

    this.passwordLabel = this.getPasswordLabel();
    this.confirmPasswordLabel = this.getPasswordLabel(true);
    this.userForm = this.fb.group({
      firstName: [
        !this.accountCreate ? this.userService.user?.firstName : '',
        [Validators.required],
      ],
      lastName: [
        !this.accountCreate ? this.userService.user?.lastName : '',
        [Validators.required],
      ],
      email: [
        {
          value: !this.accountCreate ? this.userService.user?.email : '',
          disabled: !this.accountCreate,
        },
        [Validators.email, Validators.required],
      ],
      password: ['', []],
      confirmPassword: ['', []],
    });

    const passwordValidators: ValidatorFn[] = [
      this.passwordRequirements.isGreaterThanEightChars(),
      this.passwordRequirements.hasOneLowerCaseChar(),
      this.passwordRequirements.hasOneUpperCaseChar(),
      this.passwordRequirements.hasOneDigitChar(),
      this.passwordRequirements.hasOneSpecialChar(),
    ];
    const confirmPasswordValidators = [
      ...passwordValidators,
      this.passwordRequirements.passwordsMatch(),
    ];

    //Set the validation for passwords.
    if (this.accountCreate) {
      this.userForm
        .get('password')
        ?.setValidators([...passwordValidators, Validators.required]);
      this.userForm
        .get('confirmPassword')
        ?.setValidators([...confirmPasswordValidators, Validators.required]);
    } else {
      this.userForm.get('password')?.setValidators([
        ...passwordValidators,
        (): ValidationErrors | null => {
          this.userForm
            .get('confirmPassword')
            ?.setValidators([...confirmPasswordValidators]);
          if (this.userForm?.dirty) {
            this.userForm?.get('confirmPassword')?.updateValueAndValidity();
          }
          return null;
        },
      ]);
      this.userForm.get('confirmPassword')?.setValidators([
        ...confirmPasswordValidators,
        (): ValidationErrors | null => {
          this.userForm.get('password')?.setValidators([...passwordValidators]);
          if (this.userForm?.dirty) {
            this.userForm?.get('password')?.updateValueAndValidity();
          }
          return null;
        },
      ]);
    }
  }

  /**
   * Split Service for show or hidden Account setting profile image .
   */
  private split(): void {
    this.splitService.initSdk(this.userService.user.organization);
    this.splitService.sdkReady$.pipe(first()).subscribe({
      next: () => {
        this.showProfilePhoto =
          this.splitService.getAccountProfilePhotoTreatment() === 'on';
      },
      error: (error: unknown) => {
        this.errorService.logError(error);
      },
    });
  }

  /**
   * The label to be displayed above password fields.
   *
   * @param confirm Whether the password label is for the confirm field (defaults to `false`).
   * @returns The input label text.
   */
  private getPasswordLabel(confirm = false): string {
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
  onTouched: () => void = () => {};

  /**
   * Writes a value to this form.
   *
   * @param val The value to be written.
   */
  // eslint-disable-next-line
  writeValue(val: any): void {
    val && this.userForm.setValue(val, { emitEvent: false });
  }

  /**
   * Registers a function with the `onChange` event.
   *
   * @param fn The function to register.
   */
  // eslint-disable-next-line
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
    return this.userForm.valid
      ? null
      : {
          invalidForm: {
            valid: false,
            message: 'User form is invalid',
          },
        };
  }

  /**
   * Select image.
   *
   * @param event Event of select image.
   */
  uploadImage(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = (target.files as FileList)[0];
    if (file) {
      const extension = file.type.split('/')[1];
      if (FormatImageValidate.isValidFormatImage(extension)) {
        //here will go the process with the image
      } else {
        this.popupService.alert({
          title: 'Image format is not valid.',
          message: 'Please select a file with extension jpeg, jpg, png.',
          important: true,
        });
      }
    }
  }

  /**
   * Upload image to user.
   *
   * @param file File to upload.
   */
  private uploadImageUser(file: File): void {
    this.userService
      .uploadImageUser(file)
      .pipe(first())
      .subscribe({
        next: (userImage) => {
          this.userImage = userImage;
        },
        error: (error: unknown) => {
          this.errorService.logError(error);
        },
      });
  }
}
