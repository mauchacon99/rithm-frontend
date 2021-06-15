import { Component } from '@angular/core';

/**
 * Component for priority queue section on the dashboard.
 */
@Component({
  selector: 'app-priority-queue',
  templateUrl: './priority-queue.component.html',
  styleUrls: ['./priority-queue.component.scss']
})
export class PriorityQueueComponent {
  /** Temp list of documents. */
  docsList = [
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
      assigned: false,
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

}
