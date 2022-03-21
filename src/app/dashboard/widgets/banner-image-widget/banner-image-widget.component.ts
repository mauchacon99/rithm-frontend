import { Component, Input } from '@angular/core';
import { ImageModelWidget } from 'src/models';
import { environment } from 'src/environments/environment';

/**
 * Component for Banner image widgets.
 */
@Component({
  selector: 'app-banner-image-widget[image]',
  templateUrl: './banner-image-widget.component.html',
  styleUrls: ['./banner-image-widget.component.scss'],
})
export class BannerImageWidgetComponent {
  /** Image to banner. */
  @Input() image!: ImageModelWidget;

  URL = `${environment.baseApiUrl}/documentservice/api/document/vaultfile?vaultid=`;
}
