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
  ];

}
