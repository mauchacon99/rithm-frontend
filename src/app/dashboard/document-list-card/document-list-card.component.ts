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
  /** Temp list of documents. */
  @Input() docList = [
    {
      docName: 'Really long document name',
      stationName: 'really long Station name',
      timeInStation: '2 hours',
      priority: 1
    },
    {
      docName: 'New Doc 2',
      stationName: 'Station name',
      timeInStation: '4 hours',
      priority: 2
    },
    {
      docName: 'New Doc 3',
      stationName: 'Station name',
      timeInStation: '5 hours',
      priority: 1
    },
    {
      docName: 'New Doc 4',
      stationName: 'Station name',
      timeInStation: '7 hours',
      priority: 3
    },
    {
      docName: 'New Doc 5',
      stationName: 'Station name',
      timeInStation: '1 hour',
      priority: 7
    }
  ];

  /** Is the data being loaded. */
  @Input() isLoading = false;

  /** Use to show or hide continue button. */
  @Input() isPriority = false;

}
