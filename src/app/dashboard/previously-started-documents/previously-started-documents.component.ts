import { Component } from '@angular/core';

/**
 * Component for previously started documents section on the dashboard.
 */
@Component({
  selector: 'app-previously-started-documents',
  templateUrl: './previously-started-documents.component.html',
  styleUrls: ['./previously-started-documents.component.scss']
})
export class PreviouslyStartedDocumentsComponent {
  /** Temp list of documents. */
  docsList = [
    {
      docName: 'Really long document name',
      stationName: 'really long Station name',
      timeInStation: '2 hours',
      assigned: true,
      priority: 1
    },
    {
      docName: 'New Doc 2',
      stationName: 'Station name',
      timeInStation: '4 hours',
      assigned: true,
      priority: 2
    },
    {
      docName: 'New Doc 3',
      stationName: 'Station name',
      timeInStation: '5 hours',
      assigned: true,
      priority: 1
    },
    {
      docName: 'New Doc 4',
      stationName: 'Station name',
      timeInStation: '7 hours',
      assigned: true,
      priority: 3
    },
    {
      docName: 'New Doc 5',
      stationName: 'Station name',
      timeInStation: '1 hour',
      assigned: true,
      priority: 7
    }
  ];

}
