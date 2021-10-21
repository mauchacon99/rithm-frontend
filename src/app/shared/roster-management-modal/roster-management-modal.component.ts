import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { StationRosterMember } from 'src/models';

/**
 * Component for roster management.
 */
@Component({
  selector: 'app-roster-management-modal',
  templateUrl: './roster-management-modal.component.html',
  styleUrls: ['./roster-management-modal.component.scss']
})
export class RosterManagementModalComponent {

  /** Worker Station Roster. */
  workerRosterStation: StationRosterMember[] = [];

  constructor(
    private stationService: StationService,
    private errorService: ErrorService
  ) { }

  /**
   * Aggregate users in roster for station.
   *
   * @param stationId The Specific id of station.
   * @param usersIds The users ids for assign in station.
   * @returns Rosters in the station.
   */
  addUserRosterStation(stationId: string, usersIds: { /** Ids users to add. */rithmId: string }[]): void {
    this.stationService.addUserRosterStation(stationId, usersIds)
      .pipe(first())
      .subscribe((data) => {
        if (data) {
          this.workerRosterStation = data.workers;
        }
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }
}
