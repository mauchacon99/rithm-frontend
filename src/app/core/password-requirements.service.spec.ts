import { TestBed } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';

import { PasswordRequirementsService } from './password-requirements.service';

describe('PasswordRequirementsService', () => {
  let service: PasswordRequirementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordRequirementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validate length of characters', () => {
    let control = { value: '12345678' };
    const result = service.isGreaterThanEightChars()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: '1234' };
    const result2 = service.isGreaterThanEightChars()(control as AbstractControl);

    expect(result2).toEqual({missingPassLength: true});
  });

  it('should validate 1 lowercase character', () => {
    let control = { value: 'PaSSWORD' };
    const result = service.hasOneLowerCaseChar()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: 'PASSWORD' };
    const result2 = service.hasOneLowerCaseChar()(control as AbstractControl);

    expect(result2).toEqual({missingLowerChar: true});
  });

  it('should validate 1 uppercase character', () => {
    let control = { value: 'pAssword' };
    const result = service.hasOneUpperCaseChar()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: 'password' };
    const result2 = service.hasOneUpperCaseChar()(control as AbstractControl);

    expect(result2).toEqual({missingUpperChar: true});
  });

  it('should validate a number character', () => {
    let control = { value: 'Password1' };
    const result = service.hasOneDigitChar()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: 'password' };
    const result2 = service.hasOneDigitChar()(control as AbstractControl);

    expect(result2).toEqual({missingDigitChar: true});
  });

  it('should validate 1 special character', () => {
    let control = { value: 'Password!' };
    const result = service.hasOneSpecialChar()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: 'password' };
    const result2 = service.hasOneSpecialChar()(control as AbstractControl);

    expect(result2).toEqual({missingSpecialChar: true});
  });
});
