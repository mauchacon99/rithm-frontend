import { Component, Input } from '@angular/core';
/**
 * Station card component.
 */
@Component({
  selector: 'app-station-card',
  templateUrl: './station-card.component.html',
  styleUrls: ['./station-card.component.scss']
})
export class StationCardComponent {
  /** Location of the panel. */
  @Input() location!: 'left' | 'right';
}
