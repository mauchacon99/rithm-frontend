import { Component, Input } from '@angular/core';
import { SelectedItemWidgetModel } from 'src/models';

/** Description widget modal. */
@Component({
  selector:
    'app-description-widget-modal[itemWidgetModalSelected][titlePreviewWidgetSelected]',
  templateUrl: './description-widget-modal.component.html',
  styleUrls: ['./description-widget-modal.component.scss'],
})
export class DescriptionWidgetModalComponent {
  /** Widget item selected. */
  @Input() itemWidgetModalSelected!: SelectedItemWidgetModel;

  /** Title preview widget item selected. */
  @Input() titlePreviewWidgetSelected!: string;
}
