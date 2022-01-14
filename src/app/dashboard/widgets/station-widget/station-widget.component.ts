import { Component, Input } from '@angular/core';

/**
 * Component for Station widget.
 */
@Component({
  selector: 'app-station-widget',
  templateUrl: './station-widget.component.html',
  styleUrls: ['./station-widget.component.scss'],
})
export class StationWidgetComponent {
  @Input() rithmId!: string;
}
