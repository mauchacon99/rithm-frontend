import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question, ImageWidgetObject } from 'src/models';

/**
 *
 */
@Component({
  selector: 'app-banner-widget',
  templateUrl: './banner-widget.component.html',
  styleUrls: ['./banner-widget.component.scss'],
})
export class BannerWidgetComponent {
  /** Event Emitter will open a field setting drawer on the right side of the station. */
  @Output() openSettingDrawer = new EventEmitter<
    Question | ImageWidgetObject | string
  >();

  /** The mode to display fields inside the widget. */
  @Input() widgetMode!: 'layout' | 'setting' | 'preview';

  /** The object  image widget. */
  imageWidgetObject: ImageWidgetObject = {
    imageId: '',
    imageName: '',
    isRequired: false,
    allowUserUpload: false,
  };

  /**
   * Open setting drawer.
   *
   */
  handleOpenSettingDrawer(): void {
    if (this.widgetMode === 'setting') {
      this.openSettingDrawer.emit(this.imageWidgetObject);
    }
  }
}
