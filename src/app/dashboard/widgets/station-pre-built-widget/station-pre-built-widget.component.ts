import { Component, Input, OnInit } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { StationRosterMember } from 'src/models';
/**
 * Component for station prebuilt.
 */
@Component({
  selector: 'app-station-pre-built-widget',
  templateUrl: './station-pre-built-widget.component.html',
  styleUrls: ['./station-pre-built-widget.component.scss'],
})
export class StationPreBuiltWidgetComponent implements OnInit {
  /** Edit mode toggle from dashboard. */
  @Input() editMode = false;

  constructor(
    private stationService: StationService,
    private errorService: ErrorService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.getUserStationData();
  }

  /**
   * Get user stations.
   *
   * @returns User Stations.
   */
  getUserStationData(): Observable<StationRosterMember[]> {
    const listStations: StationRosterMember[] = [
      {
        rithmId: '',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
      {
        rithmId: '',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
    ];
    return of(listStations).pipe(delay(1000));
  }
}
