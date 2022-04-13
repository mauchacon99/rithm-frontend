import { FormatValidate } from './format-validate';

describe('Format validate', () => {
  it('should be created', () => {
    expect(FormatValidate).toBeTruthy();
  });

  it('should validate format', () => {
    expect(FormatValidate.isValidFormatBanner('pdf')).toBeFalse();
    expect(FormatValidate.isValidFormatBanner('jpeg')).toBeTrue();
    expect(FormatValidate.isValidFormatBanner('jpg')).toBeTrue();
    expect(FormatValidate.isValidFormatBanner('png')).toBeTrue();
    expect(FormatValidate.isValidFormatBanner('gif')).toBeTrue();
  });
});
