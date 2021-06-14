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
      docName: 'Really long document name',
      stationName: 'really long Station name',
      timeInStation: '2 hours',
      assigned: false,
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
      assigned: false,
      priority: 1
    },
    {
      docName: 'New Doc 4',
      stationName: 'Station name',
      timeInStation: '7 hours',
      assigned: false,
      priority: 3
    },
    {
      docName: 'New Doc 5',
      stationName: 'Station name',
      timeInStation: '1 hour',
      assigned: false,
      priority: 7
    }
  ];

  /** Is the data being loaded. */
  @Input() isLoading = false;

}
