import { Component } from '@angular/core';
import { StationInformation } from 'src/models';

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
  stationInformation!: StationInformation;

  constructor() {
    //TODO: remove temporary mock data.
    this.stationInformation = {
      rithmId: '',
      name: 'Station name',
      instructions: '',
      dueDate: '',
      nextStations: [],
      previousStations: [],
      supervisors: [
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
      workers: [
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
      createdByRithmId: '',
      createdDate: '',
      updatedByRithmId: '',
      updatedDate: '',
      questions: []
    };
  }
}
