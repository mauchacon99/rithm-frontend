import { Component, Input, OnInit } from '@angular/core';
import { DocumentStationInformation, StationInformation } from 'src/models';

/**
 * Reusable component for the station information header.
 */
@Component({
  selector: 'app-station-info-header[stationInformation]',
  templateUrl: './station-info-header.component.html',
  styleUrls: ['./station-info-header.component.scss']
})
export class StationInfoHeaderComponent implements OnInit {
  /** Type of user looking at a document. */
  @Input() type!: 'admin' | 'super' | 'worker';

  /** Document information object passed from parent. */
  @Input() stationInformation!: DocumentStationInformation | StationInformation;

  /** Name of the header. */
  name = '';

  /** Station id from document modal. */
  id = '';

  constructor() {
    this.type = 'worker';
  }

  /**
   * Gets info about the initial values.
   */
  ngOnInit(): void {
    this.name = this.getName(this.stationInformation);
    this.id = this.getStationId(this.stationInformation);
  }

  /**
   * Get name from document and station info modal.
   *
   * @param obj Object set from document or station modal.
   * @returns Name to display in header.
   */
   private getName(obj: DocumentStationInformation | StationInformation): string {
    if ((obj as DocumentStationInformation)?.documentName) {
      return (obj as DocumentStationInformation).documentName;
    }
    return (obj as StationInformation).name;
  }

  /**
   * Get id from document and station info modal.
   *
   * @param obj Object set from document or station modal.
   * @returns Id to pass for roster modal.
   */
   private getStationId(obj: DocumentStationInformation | StationInformation): string {
    if ((obj as DocumentStationInformation).stationId) {
      return (obj as DocumentStationInformation).stationId;
    }
    return (obj as StationInformation).rithmId;
  }

}
