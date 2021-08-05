import { AbstractControl } from '@angular/forms';
import { DocumentFieldValidation } from './document-field-validation';

describe('PasswordRequirementsService', () => {
  let helper: DocumentFieldValidation;

  beforeEach(() => {
    helper = new DocumentFieldValidation();
  });

  it('should be created', () => {
    expect(helper).toBeTruthy();
  });

  it('should validate an address', () => {
    let control = { value: '123 street' };
    const result = helper.addressValidation()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: '!$34a' };
    const result2 = helper.addressValidation()(control as AbstractControl);

    expect(result2).toEqual({addressIncorrect: true});
  });

  it('should validate currency', () => {
    let control = { value: 'PaSSWORD' };
    const result = helper.currencyValidation()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: 'PASSWORD' };
    const result2 = helper.currencyValidation()(control as AbstractControl);

    expect(result2).toEqual({currencyIncorrect: true});
  });

  it('should validate 1 uppercase character', () => {
    let control = { value: 'pAssword' };
    const result = helper.hasOneUpperCaseChar()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: 'password' };
    const result2 = helper.hasOneUpperCaseChar()(control as AbstractControl);

    expect(result2).toEqual({missingUpperChar: true});
  });

  it('should validate a number character', () => {
    let control = { value: 'Password1' };
    const result = helper.hasOneDigitChar()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: 'password' };
    const result2 = helper.hasOneDigitChar()(control as AbstractControl);

    expect(result2).toEqual({missingDigitChar: true});
  });

  it('should validate 1 special character', () => {
    let control = { value: 'Password!' };
    const result = helper.hasOneSpecialChar()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: 'password' };
    const result2 = helper.hasOneSpecialChar()(control as AbstractControl);

    expect(result2).toEqual({missingSpecialChar: true});
  });

  it('should pass when control is left blank', () => {
    const control = { value: '' };

    const result = helper.isGreaterThanEightChars()(control as AbstractControl);
    expect(result).toBeNull();

    const result2 = helper.hasOneLowerCaseChar()(control as AbstractControl);
    expect(result2).toBeNull();

    const result3 = helper.hasOneUpperCaseChar()(control as AbstractControl);
    expect(result3).toBeNull();

    const result4 = helper.hasOneDigitChar()(control as AbstractControl);
    expect(result4).toBeNull();

    const result5 = helper.hasOneSpecialChar()(control as AbstractControl);
    expect(result5).toBeNull();


  });
});
