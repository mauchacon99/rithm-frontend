import { Component, Input } from '@angular/core';
import { ConnectedStationInfo } from 'src/models/connected-station-info';
/**
 * Station card component.
 */
@Component({
  selector: 'app-station-card[location][station]',
  templateUrl: './station-card.component.html',
  styleUrls: ['./station-card.component.scss']
})
export class StationCardComponent {
  /** Location of the panel. */
  @Input() location!: 'left' | 'right';

  /** The station information. */
  @Input() station!: ConnectedStationInfo;
}
