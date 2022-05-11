import { FormatImageValidate } from './format-image-validate';

describe('Format validate', () => {
  it('should be created', () => {
    expect(FormatImageValidate).toBeTruthy();
  });

  it('should validate format', () => {
    expect(FormatImageValidate.isValidFormatImage('pdf')).toBeFalse();
    expect(FormatImageValidate.isValidFormatImage('jpeg')).toBeTrue();
    expect(FormatImageValidate.isValidFormatImage('jpg')).toBeTrue();
    expect(FormatImageValidate.isValidFormatImage('png')).toBeTrue();
  });
});
