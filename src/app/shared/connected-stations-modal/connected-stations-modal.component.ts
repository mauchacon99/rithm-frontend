import { Component, Inject, } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConnectedStationInfo } from 'src/models';

/**
 * Component for connected stations.
 */
@Component({
  selector: 'app-connected-stations-modal',
  templateUrl: './connected-stations-modal.component.html',
  styleUrls: ['./connected-stations-modal.component.scss']
})
export class ConnectedStationsModalComponent {

  /** The title Modal. */
  title = "Where would you like to move this document?";

  /** The Label Select of modal. */
  label = "Select Station"

  /** The station list by document. */
  stationsDocument: ConnectedStationInfo[] = [];

  /** The Document rithmId. */
  documentRithmId = '';

  /** The Station rithmId. */
  stationRithmId = '';

  constructor(
    // eslint-disable-next-line max-len
    @Inject(MAT_DIALOG_DATA) private data: { /** The Document rithmId. */ documentRithmId: string, /** The station id. */ stationRithmId: string }
  ) {
    this.documentRithmId = data.documentRithmId;
    this.stationRithmId = data.stationRithmId;
  }
}
