import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordRequirementsService {
  at_least_eight_chars = new RegExp(/^.{8,63}$/);
  at_least_one_lower_case_char = new RegExp(/^(?=.*?[a-z])/);
  at_least_one_upper_case_char = new RegExp(/^(?=.*?[A-Z])/);
  at_least_one_digit_char = new RegExp(/^(?=.*?[0-9])/);
  at_least_one_special_char = new RegExp(/^(?=.*?[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])/);

  constructor() { }


  private isGreaterThanEightChars(password: string): boolean {
    return this.at_least_eight_chars.test(password);
  }

  private hasOneLowerCaseChar(password: string): boolean {
    return this.at_least_one_lower_case_char.test(password);
  }

  private hasOneUpperCaseChar(password: string): boolean {
    return this.at_least_one_upper_case_char.test(password);
  }

  private hasOneDigitChar(password: string): boolean {
    return this.at_least_one_digit_char.test(password);
  }

  private hasOneSpecialChar(password: string): boolean {
    return this.at_least_one_special_char.test(password);
  }


}
