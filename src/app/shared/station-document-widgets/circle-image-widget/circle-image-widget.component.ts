import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ImageWidgetObject } from 'src/models';

/**
 *
 */
@Component({
  selector: 'app-circle-image-widget',
  templateUrl: './circle-image-widget.component.html',
  styleUrls: ['./circle-image-widget.component.scss'],
})
export class CircleImageWidgetComponent implements AfterViewChecked {
  /** Event Emitter will open a field setting drawer on the right side of the station. */
  @Output() openSettingDrawer = new EventEmitter<ImageWidgetObject>();

  /** The mode to display fields inside the widget. */
  @Input() widgetMode!: 'layout' | 'setting';

  /** The object  image widget. */
  imageWidgetObject: ImageWidgetObject = {
    imageId: '',
    imageName: '',
    isRequired: false,
    allowUserUpload: false,
  };

  /** If the circle have focus. */
  @Input() circleFocused!: true | false;

  constructor(private elem: ElementRef<HTMLElement>) {}

  /**
   * Change height with width.
   */
  ngAfterViewChecked(): void {
    const circleWidget = this.elem.nativeElement.querySelector(
      '.circle-image-widget'
    ) as HTMLDivElement;
    circleWidget.style.height = circleWidget?.offsetWidth + 'px';
  }

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
