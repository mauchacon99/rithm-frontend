import { Component, Input } from '@angular/core';
import { first } from 'rxjs/operators';
import { DocumentImage, WidgetType } from 'src/models';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';

/**
 * Component for Banner image widgets.
 */
@Component({
  selector: 'app-banner-image-widget[image][widgetType]',
  templateUrl: './banner-image-widget.component.html',
  styleUrls: ['./banner-image-widget.component.scss'],
})
export class BannerImageWidgetComponent {
  /** WidgetType input. */
  @Input() widgetType!: WidgetType;

  /** Profile image base64. */
  profileImageBase64!: string;

  /** Profile image of widget to get image Base64. */
  @Input() set profileImage(value: string | null) {
    if (value) {
      this.getImageByRithmId(value, 'profile');
    } else {
      this.profileImageBase64 = '';
      this.isLoadingProfileImage = false;
    }
  }

  /** Image setter. */
  private _image!: DocumentImage;

  /** Image of widget to get image Base64. */
  @Input() set image(value: DocumentImage) {
    this._image = value;
    this.imageSrc = '';
    if (value && value.imageId && value.imageId !== 'TEMPLoading') {
      this.getImageByRithmId(value.imageId, 'banner');
    } else if (value && value.imageId && value.imageId === 'TEMPLoading') {
      this.isLoading = true;
      this._image.imageId = null;
    } else {
      this.isLoading = false;
    }
  }

  /**
   * Get image.
   *
   * @returns String or NUll of the image.
   */
  get image(): DocumentImage {
    return this._image;
  }

  /** Image to show on banner image. */
  imageSrc!: string;

  /** Loading banner image. */
  isLoading = false;

  /** Loading profile image. */
  isLoadingProfileImage = false;

  /** Enum widgetType. */
  enumWidgetType = WidgetType;

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService
  ) {}

  /**
   * Get banner image by id of image.
   *
   * @param imageRithmId RithmId of the image to get base64.
   * @param type Type to set base64 'banner' | 'profile'.
   */
  private getImageByRithmId(
    imageRithmId: string,
    type: 'banner' | 'profile'
  ): void {
    if (imageRithmId) {
      type === 'banner'
        ? (this.isLoading = true)
        : (this.isLoadingProfileImage = true);

      this.documentService
        .getImageByRithmId(imageRithmId)
        .pipe(first())
        .subscribe({
          next: (data) => {
            if (type === 'banner') {
              this.imageSrc = data.imageData || '';
              this.isLoading = false;
            } else {
              this.profileImageBase64 = data.imageData || '';
              this.isLoadingProfileImage = false;
            }
          },
          error: (error: unknown) => {
            if (type === 'banner') {
              this.imageSrc = '';
              this.isLoading = false;
            } else {
              this.profileImageBase64 = '';
              this.isLoadingProfileImage = false;
            }
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error
            );
          },
        });
    }
  }
}
