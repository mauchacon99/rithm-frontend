import { Component, Input } from '@angular/core';
/**
 * Component for station prebuilt.
 */
@Component({
  selector: 'app-station-pre-built-widget',
  templateUrl: './station-pre-built-widget.component.html',
  styleUrls: ['./station-pre-built-widget.component.scss'],
})
export class StationPreBuiltWidgetComponent {
  /** Edit mode toggle from dashboard. */
  @Input() editMode = false;
}
