import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Helper for displaying and validating passwords.
 */
export class PasswordRequirements {
  //All the following Regex also allow for an empty string using |^$.

  /** Regex to check for 8 chars. */
  private at_least_eight_chars = new RegExp(/^.{8,63}$|^$/);

  /** Regex to check for lowercase char. */
  private at_least_one_lower_case_char = new RegExp(/^(?=.*?[a-z])|^$/);

  /** Regex to check for uppercase char. */
  private at_least_one_upper_case_char = new RegExp(/^(?=.*?[A-Z])|^$/);

  /** Regex to check for one digit 0-9 char. */
  private at_least_one_digit_char = new RegExp(/^(?=.*?[0-9])|^$/);

  /** Regex to check for one special char (!#$%& etc). */
  private at_least_one_special_char = new RegExp(
    /^(?=.*?[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])|^$/
  );

  /**
   * Check password to see if it has 8 chars or more.
   *
   * @returns A validator function.
   */
  isGreaterThanEightChars(): ValidatorFn {
    return this.testRegExp(this.at_least_eight_chars, 'missingPassLength');
  }

  /**
   * Check password to see if it has a lowercase char.
   *
   * @returns A validator function.
   */
  hasOneLowerCaseChar(): ValidatorFn {
    return this.testRegExp(
      this.at_least_one_lower_case_char,
      'missingLowerChar'
    );
  }

  /**
   * Check password to see if it has an uppercase char.
   *
   * @returns A validator function.
   */
  hasOneUpperCaseChar(): ValidatorFn {
    return this.testRegExp(
      this.at_least_one_upper_case_char,
      'missingUpperChar'
    );
  }

  /**
   * Check password to see if it has a number.
   *
   * @returns A validator function.
   */
  hasOneDigitChar(): ValidatorFn {
    return this.testRegExp(this.at_least_one_digit_char, 'missingDigitChar');
  }

  /**
   * Check password to see if it has a special char.
   *
   * @returns A validator function.
   */
  hasOneSpecialChar(): ValidatorFn {
    return this.testRegExp(
      this.at_least_one_special_char,
      'missingSpecialChar'
    );
  }

  /**
   * Check to see if password and confirm password match.
   *
   * @returns A validator function.
   */
  passwordsMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.parent?.get('password')?.value;
      const confirmPass = control.parent?.get('confirmPassword')?.value;
      return password !== confirmPass ? { mismatchingPasswords: true } : null;
    };
  }

  /**
   * Creates validator function to test control value against a regular expression.
   *
   * @param regExp The regular expression to test.
   * @param errorName The validator error name if the test does not pass.
   * @returns A validator function.
   */
  private testRegExp(regExp: RegExp, errorName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const _value = control.value;
      return regExp.test(_value) ? null : { [errorName]: true };
    };
  }
}
