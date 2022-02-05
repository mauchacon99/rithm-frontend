import { AbstractControl } from '@angular/forms';
import { PasswordRequirements } from './password-requirements';

describe('PasswordRequirementsService', () => {
  let helper: PasswordRequirements;

  beforeEach(() => {
    helper = new PasswordRequirements();
  });

  it('should be created', () => {
    expect(helper).toBeTruthy();
  });

  it('should validate length of characters', () => {
    let control = { value: '12345678' };
    const result = helper.isGreaterThanEightChars()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: '1234' };
    const result2 = helper.isGreaterThanEightChars()(
      control as AbstractControl
    );

    expect(result2).toEqual({ missingPassLength: true });
  });

  it('should validate 1 lowercase character', () => {
    let control = { value: 'PaSSWORD' };
    const result = helper.hasOneLowerCaseChar()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: 'PASSWORD' };
    const result2 = helper.hasOneLowerCaseChar()(control as AbstractControl);

    expect(result2).toEqual({ missingLowerChar: true });
  });

  it('should validate 1 uppercase character', () => {
    let control = { value: 'pAssword' };
    const result = helper.hasOneUpperCaseChar()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: 'password' };
    const result2 = helper.hasOneUpperCaseChar()(control as AbstractControl);

    expect(result2).toEqual({ missingUpperChar: true });
  });

  it('should validate a number character', () => {
    let control = { value: 'Password1' };
    const result = helper.hasOneDigitChar()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: 'password' };
    const result2 = helper.hasOneDigitChar()(control as AbstractControl);

    expect(result2).toEqual({ missingDigitChar: true });
  });

  it('should validate 1 special character', () => {
    let control = { value: 'Password!' };
    const result = helper.hasOneSpecialChar()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: 'password' };
    const result2 = helper.hasOneSpecialChar()(control as AbstractControl);

    expect(result2).toEqual({ missingSpecialChar: true });
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
