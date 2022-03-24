import { Component, Input } from '@angular/core';

/**
 * Reusable component for displaying an body-text-widget in station grid.
 */
@Component({
  selector: 'app-body-text-widget',
  templateUrl: './body-text-widget.component.html',
  styleUrls: ['./body-text-widget.component.scss'],
})
export class BodyTextWidgetComponent {
  /** The mode to display fields inside the widget. */
  @Input() widgetMode = 'layout';

  /** Whether the station is in editMode or previewMode. */
  @Input() stationViewMode!: 'edit' | 'preview';

  /** Id of the current Gridster item. */
  @Input() id!: number;

  /**Body text value */
  bodyTextValue = '';
}
