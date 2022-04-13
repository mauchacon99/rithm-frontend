import { Component, Input } from '@angular/core';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { first } from 'rxjs/operators';
import { ImageData } from 'src/models';

/**
 * Component for Banner avatar image widgets.
 */
@Component({
  selector: 'app-avatar-image-widget[profileImage]',
  templateUrl: './avatar-image-widget.component.html',
  styleUrls: ['./avatar-image-widget.component.scss'],
})
export class AvatarImageWidgetComponent {
  /** Image setter. */
  private _profileImage!: string | null;

  /** Image base64 to show profile image. */
  @Input() set profileImage(value: string | null) {
    this._profileImage = value;
    if (value) {
      this.getImageByRithmId();
    } else {
      this.imageData = {
        imageData: '',
        imageName: '',
      };
    }
  }

  /**
   * Get profile image.
   *
   * @returns String or NUll of the profile image.
   */
  get profileImage(): string | null {
    return this._profileImage;
  }

  /** Image to show on profile image. */
  imageData!: ImageData;

  /** Is loading get file of avatar. */
  isLoading = false;

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService
  ) {}

  /** Get profile image by id of image. */
  private getImageByRithmId(): void {
    if (this.profileImage) {
      this.isLoading = true;
      this.documentService
        .getImageByRithmId(this.profileImage)
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.imageData = data;
            this.isLoading = false;
          },
          error: (error: unknown) => {
            this.imageData = {
              imageData: '',
              imageName: '',
            };
            this.isLoading = false;
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error
            );
          },
        });
    }
  }
}
