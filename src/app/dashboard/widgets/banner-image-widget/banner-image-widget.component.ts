import { Component, Input } from '@angular/core';

/**
 * Component for Banner image widgets.
 */
@Component({
  selector: 'app-banner-image-widget[image]',
  templateUrl: './banner-image-widget.component.html',
  styleUrls: ['./banner-image-widget.component.scss'],
})
export class BannerImageWidgetComponent {
  /** Image setter. */
  private _image!: string | null;

  /** Image to banner. */
  @Input() set image(value: string | File | null | undefined) {
    if (value && typeof value !== 'string') {
      const reader = new FileReader();
      reader.readAsDataURL(value);

      reader.onload = () => {
        this._image = reader.result as string;
      };
    } else {
      this._image = value as string;
    }
  }

  /**
   * Get image.
   *
   * @returns String or NUll of the image.
   */
  get image(): string | null | undefined {
    return this._image;
  }
}
