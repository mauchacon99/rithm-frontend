import { Component } from '@angular/core';
import { DocumentStationInformation } from 'src/models';

/**
 * Main component for viewing a station.
 */
@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})
export class StationComponent {

  /** The information about the document within a station. */
  documentInformation!: DocumentStationInformation;

  constructor() {
    this.documentInformation = {
      documentName: '',
      documentPriority: 0,
      currentAssignedUser: '',
      flowedTimeUTC: '',
      lastUpdatedUTC: '',
      stationId: '',
      stationName: 'Station name',
      stationPriority: 0,
      numberOfSupervisors: 2,
      supervisorRoster: [
        {
          userRithmId: '',
          firstName: 'T',
          lastName: 'H',
          email: '',
          isAssigned: true
        },
        {
          userRithmId: '',
          firstName: 'A',
          lastName: 'B',
          email: '',
          isAssigned: true
        },
      ],
      numberOfWorkers: 5,
      workerRoster: [
        {
          userRithmId: '',
          firstName: 'H',
          lastName: 'K',
          email: '',
          isAssigned: true
        },
        {
          userRithmId: '',
          firstName: 'A',
          lastName: 'A',
          email: '',
          isAssigned: true
        },
      ],
      documentRithmId: '',
      questions: []
    };
  }
}
