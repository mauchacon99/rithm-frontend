import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Helper for displaying and validating passwords.
 */
export class DocumentFieldValidation {
  //All the following Regex also allow for an empty string using |^$.

  /** Regex to check address input. */
  private address_regex = new RegExp(/^[A-Za-z0-9'.\-\s,]+$|^$/);

  /** Regex to check currency input. */
  private currency_regex = new RegExp(/^[0-9]*\.?[0-9]*$|^$/);

  /** Regex to check zip code input. */
  private zip_regex = new RegExp(/^[0-9]{5}|^$/);

  /** Regex to check phone input. */
  private phone_regex = new RegExp(/\([0-9]{3}\) ?[0-9]{3}-[0-9]{4}|^$/);

  /** Regex to check url input. */
  private url_regex = new RegExp(/^(ftp|http|https):\/\/[^ "]+$|^$/);

  /**
   * Check if address field is correctly entered.
   *
   * @returns A validator function.
   */
  addressValidation(): ValidatorFn {
    return this.testRegExp(this.address_regex, 'addressIncorrect');
  }

  /**
   * Check if currency field is correctly entered.
   *
   * @returns A validator function.
   */
  currencyValidation(): ValidatorFn {
    return this.testRegExp(this.currency_regex, 'currencyIncorrect');
  }

  /**
   * Check if zip code field is correctly entered.
   *
   * @returns A validator function.
   */
  zipValidation(): ValidatorFn {
    return this.testRegExp(this.zip_regex, 'zipIncorrect');
  }

  /**
   * Check if phone field is correctly entered.
   *
   * @returns A validator function.
   */
  phoneValidation(): ValidatorFn {
    return this.testRegExp(this.phone_regex, 'phoneIncorrect');
  }

  /**
   * Check if url field is correctly entered.
   *
   * @returns A validator function.
   */
  urlValidation(): ValidatorFn {
    return this.testRegExp(this.url_regex, 'urlIncorrect');
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
