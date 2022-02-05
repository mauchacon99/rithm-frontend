import { AbstractControl } from '@angular/forms';
import { DocumentFieldValidation } from './document-field-validation';

describe('DocumentFieldValidation', () => {
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

    expect(result2).toEqual({ addressIncorrect: true });
  });

  it('should validate currency', () => {
    let control = { value: '32.21' };
    const result = helper.currencyValidation()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: '1.2.3' };
    const result2 = helper.currencyValidation()(control as AbstractControl);

    expect(result2).toEqual({ currencyIncorrect: true });
  });

  it('should validate a zip code', () => {
    let control = { value: '12345' };
    const result = helper.zipValidation()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: '1234' };
    const result2 = helper.zipValidation()(control as AbstractControl);

    expect(result2).toEqual({ zipIncorrect: true });
  });

  it('should validate a phone number', () => {
    let control = { value: '(801) 123-1234' };
    const result = helper.phoneValidation()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: '123456' };
    const result2 = helper.phoneValidation()(control as AbstractControl);

    expect(result2).toEqual({ phoneIncorrect: true });
  });

  it('should validate a url', () => {
    let control = { value: 'http://d' };
    const result = helper.urlValidation()(control as AbstractControl);

    expect(result).toBeNull();

    control = { value: 'google.com' };
    const result2 = helper.urlValidation()(control as AbstractControl);

    expect(result2).toEqual({ urlIncorrect: true });
  });

  it('should pass when control is left blank', () => {
    const control = { value: '' };

    const result = helper.addressValidation()(control as AbstractControl);
    expect(result).toBeNull();

    const result2 = helper.currencyValidation()(control as AbstractControl);
    expect(result2).toBeNull();

    const result4 = helper.zipValidation()(control as AbstractControl);
    expect(result4).toBeNull();

    const result5 = helper.phoneValidation()(control as AbstractControl);
    expect(result5).toBeNull();

    const result6 = helper.urlValidation()(control as AbstractControl);
    expect(result6).toBeNull();
  });
});
