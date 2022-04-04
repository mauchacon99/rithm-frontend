/**
 * Set configs for mobile devices.
 */
export class MobileConfig {
  /**
   * Detect mobile devices.
   *
   * @returns True if device is mobile.
   */
  get isMobileDevice(): boolean {
    return !!navigator.userAgent.match(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Linux aarch64/gim
    );
  }
}
