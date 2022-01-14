import { Component, Input } from '@angular/core';
import { ConnectedStationInfo } from 'src/models/connected-station-info';
/**
 * Station card component.
 */
@Component({
  selector: 'app-connected-station-card[location][station]',
  templateUrl: './connected-station-card.component.html',
  styleUrls: ['./connected-station-card.component.scss'],
})
export class ConnectedStationCardComponent {
  /** Location of the panel. */
  @Input() location!: 'left' | 'right';

  /** The station information. */
  @Input() station!: ConnectedStationInfo;
}
