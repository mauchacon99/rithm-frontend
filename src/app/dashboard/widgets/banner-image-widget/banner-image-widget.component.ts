import { Component, Input, OnInit } from '@angular/core';
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
export class BannerImageWidgetComponent implements OnInit {
  /** WidgetType input. */
  @Input() widgetType!: WidgetType;

  /** Image setter. */
  private _image!: DocumentImage;

  /** Image of widget to get image Base64. */
  @Input() set image(value: DocumentImage) {
    this._image = value;
    if (value && value.imageId && typeof this.imageSrc === 'string') {
      this.imageSrc = '';
      this.isLoading = true;
      this.getImageByRithmId();
    } else {
      this.imageSrc = '';
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
  imageSrc: string | null = null;

  /** Loading banner image. */
  isLoading = false;

  /** Enum widgetType. */
  enumWidgetType = WidgetType;

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService
  ) {}

  /** Init method. */
  ngOnInit(): void {
    this.getImageByRithmId();
  }

  /** Get banner image by id of image. */
  private getImageByRithmId(): void {
    if (this.image && this.image.imageId) {
      this.documentService
        .getImageByRithmId(this.image.imageId)
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.imageSrc = data.imageData || '';
            this.isLoading = false;
          },
          error: (error: unknown) => {
            this.imageSrc = '';
            this.isLoading = false;
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error
            );
          },
        });
    } else {
      this.imageSrc = '';
    }
  }
}
