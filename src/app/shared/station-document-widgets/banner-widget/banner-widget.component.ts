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
  @Input() widgetMode!: 'layout' | 'setting';

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
   * @param field The field for the setting drawer.
   */
  handleOpenSettingDrawer(field?: Question | ImageWidgetObject | string): void {
    if (this.widgetMode === 'setting') {
      this.openSettingDrawer.emit(field);
    }
  }
}
