/** Config for set config and compress image. */
export interface OptionsCompressFile {
  /** Number.POSITIVE_INFINITY. */
  maxSizeMB?: number;
  /** Undefined. */
  maxWidthOrHeight?: number;
  /** Boolean. */
  useWebWorker?: boolean;
  /** Default 10. */
  maxIteration?: number;
  /** Default to be the exif orientation from the image file. */
  exifOrientation?: number;
  /** A function takes one progress argument (progress from 0 to 100). */
  onProgress?: (progress: number) => void;
  /** Default to be the original mime type from the image file. */
  fileType?: string;
  /** Default 1.0. */
  initialQuality?: number;
  /** Boolean. */
  alwaysKeepResolution?: boolean;
  /** Default undefined. */
  signal?: AbortSignal;
}
