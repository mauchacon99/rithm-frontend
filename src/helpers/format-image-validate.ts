/**
 * Validate formats.
 */
export class FormatImageValidate {
  /**
   * Validate if format of widget banner image is valid.
   *
   * @param extension Extension to validate.
   * @returns Is valid.
   */
  static isValidFormatImage(extension: string): boolean {
    return !!(
      extension === 'jpeg' ||
      extension === 'jpg' ||
      extension === 'png'
    );
  }
}
