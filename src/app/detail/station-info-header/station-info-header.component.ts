import { Component, Input } from '@angular/core';
import { DocumentStationInformation } from 'src/models';

/**
 * Reusable component for the station information header.
 */
@Component({
  selector: 'app-station-info-header',
  templateUrl: './station-info-header.component.html',
  styleUrls: ['./station-info-header.component.scss']
})
export class StationInfoHeaderComponent {
  /** Type of user looking at a document. */
  @Input() type!: 'admin' | 'super' | 'worker';

  /** Document information object passed from parent. */
  @Input() documentInformation!: DocumentStationInformation;

  constructor() {
    this.type = 'worker';
  }

}
