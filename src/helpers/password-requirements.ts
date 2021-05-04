import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
/**
 * Use for displaying and validating passwords.
 */
export class PasswordRequirements {
  /** Regex to check for 8 chars. */
  private at_least_eight_chars = new RegExp(/^.{8,63}$/);
  /** Regex to check for lowercase char. */
  private at_least_one_lower_case_char = new RegExp(/^(?=.*?[a-z])/);
  /** Regex to check for uppercase char. */
  private at_least_one_upper_case_char = new RegExp(/^(?=.*?[A-Z])/);
  /** Regex to check for one digit 0-9 char. */
  private at_least_one_digit_char = new RegExp(/^(?=.*?[0-9])/);
  /** Regex to check for one special char (!#$%& etc). */
  private at_least_one_special_char = new RegExp(/^(?=.*?[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])/);

  constructor() {
    // constructor
  }
  /**
   * Check password to see if it has 8 chars or more.
   *
   * @returns Object when there are errors.
   */
  isGreaterThanEightChars(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const _value = control.value;
      return this.at_least_eight_chars.test(_value) ? null : {missingPassLength: true};
    };
  }
  /**
   * Check password to see if it has a lowercase char.
   *
   * @returns Object when there are errors.
   */
  hasOneLowerCaseChar(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const _value = control.value;
      return this.at_least_one_lower_case_char.test(_value) ? null : {missingLowerChar: true};
    };
  }
  /**
   * Check password to see if it has an uppercase char.
   *
   * @returns Object when there are errors.
   */
  hasOneUpperCaseChar(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const _value = control.value;
      return this.at_least_one_upper_case_char.test(_value) ? null : {missingUpperChar: true};
    };
  }
  /**
   * Check password to see if it has a number.
   *
   * @returns Object when there are errors.
   */
  hasOneDigitChar(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const _value = control.value;
      return this.at_least_one_digit_char.test(_value) ? null : {missingDigitChar: true};
    };
  }
  /**
   * Check password to see if it has a special char.
   *
   * @returns Object when there are errors.
   */
  hasOneSpecialChar(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const _value = control.value;
      return this.at_least_one_special_char.test(_value) ? null : {missingSpecialChar: true};
    };
  }
  /**
   * Check to see if password and confirm password match.
   *
   * @returns Object when there are errors.
   */
  passwordsMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.parent?.get('password')?.value;
      const confirmPass = control.parent?.get('confirmPassword')?.value;
      return (password !== confirmPass) ? {mismatchingPasswords: true} : null;
    };
  }

}
