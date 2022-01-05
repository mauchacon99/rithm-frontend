import { Component, Input } from '@angular/core';
import { ConnectedStationInfo } from 'src/models';

/**
 * Component for the flow logic tab on a station.
 */
@Component({
  selector: 'app-flow-logic[nextStations]',
  templateUrl: './flow-logic.component.html',
  styleUrls: ['./flow-logic.component.scss'],
})
export class FlowLogicComponent {
  /** The list of stations to display in the pane. */
  @Input() nextStations: ConnectedStationInfo[] = [];
}
