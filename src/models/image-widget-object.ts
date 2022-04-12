/**
 * Represents the image widget.
 */

export interface ImageWidgetObject {
  /** Id the image. */
  imageId?: string;

  /** Name the image widget. */
  imageName?: string;

  /** Whether the image is required for the worker to fill out. */
  isRequired: boolean;

  /** Whether the image is user upload. */
  allowUserUpload: boolean;
}
