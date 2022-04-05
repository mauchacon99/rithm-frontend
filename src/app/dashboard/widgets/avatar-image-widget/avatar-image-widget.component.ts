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
  /** Image base64 to show profile image. */
  @Input() set profileImage(value: string | null) {
    if (value) {
      this.getImageByRithmId(value);
    }
  }

  /** Image to show on profile image. */
  imageData!: ImageData;

  /** Is loading get file of avatar. */
  isLoading = false;

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService
  ) {}

  /**
   * Get profile image by id of image.
   *
   * @param imageRithmId RithmId of the image to get base64.
   */
  private getImageByRithmId(imageRithmId: string): void {
    if (imageRithmId) {
      this.isLoading = true;
      this.documentService
        .getImageByRithmId(imageRithmId)
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.imageData = data;
            this.isLoading = false;
          },
          error: (error: unknown) => {
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
