import { Component, Input } from '@angular/core';
import { ConnectedStationInfo } from 'src/models';

/**
 * Reusable component for the pane showing the upstream/downstream stations.
 */
@Component({
  selector: 'app-connected-station-pane',
  templateUrl: './connected-station-pane.component.html',
  styleUrls: ['./connected-station-pane.component.scss']
})
export class ConnectedStationPaneComponent {

  /** Location of the panel relative to the screen. */
  @Input() location!: 'left' | 'right';

  /** The list of stations to display in the pane. */
  @Input() stations: ConnectedStationInfo[] = [];

  /** Whether the header data is loading. */
  isLoading = true;

}
