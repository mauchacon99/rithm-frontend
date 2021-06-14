import { Component, Input } from '@angular/core';

/**
 * Component for displaying a list of documents on the dashboard.
 */
@Component({
  selector: 'app-document-list-card',
  templateUrl: './document-list-card.component.html',
  styleUrls: ['./document-list-card.component.scss']
})
export class DocumentListCardComponent {
  /** List of documents. */
  @Input() docList = [
    {
      docName: 'New Doc 1',
      stationName: 'Station name',
      timeInStation: '2 hours',
      assigned: false
    },
    {
      docName: 'New Doc 2',
      stationName: 'Station name',
      timeInStation: '4 hours',
      assigned: false
    },
    {
      docName: 'New Doc 3',
      stationName: 'Station name',
      timeInStation: '5 hours',
      assigned: false
    },
    {
      docName: 'New Doc 4',
      stationName: 'Station name',
      timeInStation: '7 hours',
      assigned: false
    },
    {
      docName: 'New Doc 5',
      stationName: 'Station name',
      timeInStation: '1 hours',
      assigned: false
    }
  ];

  /** Is the data being loaded. */
  @Input() isLoading = false;

}
