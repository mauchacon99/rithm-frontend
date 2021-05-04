import { Injectable } from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
/**
 * Service for displaying and validating passwords.
 */
@Injectable({
  providedIn: 'root'
})
export class PasswordRequirementsService {
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
   */
  isGreaterThanEightChars(): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
      const _value = control.value;
      return this.at_least_eight_chars.test(_value) ? null : {passLength: {value: _value}};
    }
  }
  /**
   * Check password to see if it has a lowercase char.
   *
   */
  hasOneLowerCaseChar(): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
      const _value = control.value;
      return this.at_least_one_lower_case_char.test(_value) ? null : {hasLowerChar: {value: _value}};
    }
  }
  /**
   * Check password to see if it has an uppercase char.
   *
   */
  hasOneUpperCaseChar(): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
      const _value = control.value;
      return this.at_least_one_upper_case_char.test(_value) ? null : {hasUpperChar: {value: _value}};
    }
  }
  /**
   * Check password to see if it has a number.
   *
   */
  hasOneDigitChar(): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
      const _value = control.value;
      return this.at_least_one_digit_char.test(_value) ? null : {missingDigitChar: true};
    }
  }
  /**
   * Check password to see if it has a special char.
   *
   */
  hasOneSpecialChar(): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
      const _value = control.value;
      return this.at_least_one_special_char.test(_value) ? null : {hasSpecialChar: {value: _value}};
    }
  }
  /**
   * Check to see if password and confirm password match.
   *
   */
  passwordsMatch(): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPass = control.get('confirmPassword')?.value;
      return (password !== confirmPass) ? {matchingPasswords: {value: false}} : null;
    }
  }
  /**
   * Check the password meets all the requirements.
   *
   * @param password String to check.
   * @param confirmPassword String to check.
   * @returns Array of booleans.
   */
  // checkPasswordMeetsRequirements(password: string, confirmPassword: string): boolean[] {
  //   const requirements: Array<boolean> = [];

  //   requirements.push(
  //     this.isGreaterThanEightChars(password),
  //     this.hasOneLowerCaseChar(password),
  //     this.hasOneUpperCaseChar(password),
  //     this.hasOneDigitChar(password),
  //     this.hasOneSpecialChar(password),
  //     this.passwordsMatch(password, confirmPassword)
  //   );

  //   return requirements;
  // }


}
