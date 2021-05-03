import { Injectable } from '@angular/core';
/**
 * Service for displaying and validating passwords.
 */
@Injectable({
  providedIn: 'root'
})
export class PasswordRequirementsService {
  /** Regex to check for 8 chars. */
  at_least_eight_chars = new RegExp(/^.{8,63}$/);
  /** Regex to check for lowercase char. */
  at_least_one_lower_case_char = new RegExp(/^(?=.*?[a-z])/);
  /** Regex to check for uppercase char. */
  at_least_one_upper_case_char = new RegExp(/^(?=.*?[A-Z])/);
  /** Regex to check for one digit 0-9 char. */
  at_least_one_digit_char = new RegExp(/^(?=.*?[0-9])/);
  /** Regex to check for one special char (!#$%& etc). */
  at_least_one_special_char = new RegExp(/^(?=.*?[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])/);

  constructor() {
    // constructor
  }
  /**
   * Check password to see if it has 8 chars or more.
   *
   * @param password String to check.
   * @returns Boolean.
   */
  private isGreaterThanEightChars(password: string): boolean {
    return this.at_least_eight_chars.test(password);
  }
  /**
   * Check password to see if it has a lowercase char.
   *
   * @param password String to check.
   * @returns Boolean.
   */
  private hasOneLowerCaseChar(password: string): boolean {
    return this.at_least_one_lower_case_char.test(password);
  }
  /**
   * Check password to see if it has an uppercase char.
   *
   * @param password String to check.
   * @returns Boolean.
   */
  private hasOneUpperCaseChar(password: string): boolean {
    return this.at_least_one_upper_case_char.test(password);
  }
  /**
   * Check password to see if it has a number.
   *
   * @param password String to check.
   * @returns Boolean.
   */
  private hasOneDigitChar(password: string): boolean {
    return this.at_least_one_digit_char.test(password);
  }
  /**
   * Check password to see if it has a special char.
   *
   * @param password String to check.
   * @returns Boolean.
   */
  private hasOneSpecialChar(password: string): boolean {
    return this.at_least_one_special_char.test(password);
  }


}
