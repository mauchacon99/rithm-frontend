/**
 * Validate formats.
 */
export class FormatValidate {
  /**
   * Validate if format of widget banner image is valid.
   *
   * @param extension Extension to validate.
   * @returns Is valid.
   */
  static isValidFormatBanner(extension: string): boolean {
    return extension === 'jpeg' ||
      extension === 'jpg' ||
      extension === 'png' ||
      extension === 'gif'
      ? true
      : false;
  }
}
