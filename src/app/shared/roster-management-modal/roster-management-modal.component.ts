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

  /** Array of avatars. */
  rosterMembers = [{ firstName: 'Tyler', lastName: 'Hendrickson' },
  { firstName: 'Natasha ', lastName: 'Romanov' },
  { firstName: 'Clinton ', lastName: 'Barton' },
  { firstName: 'Steve', lastName: 'Rogers' },
  { firstName: 'Victor', lastName: 'Shade' }
  ];

  /** Worker Station Roster. */
  workerRosterStation: StationRosterMember[] = [];

  constructor(
    private stationService: StationService,
    private errorService: ErrorService
  ) { }

  /**
   * Adds users to the worker roster.
   *
   * @param stationId The Specific id of station.
   * @param userIds The users ids for assign in station.
   */
  addUsersToWorkerRoster(stationId: string, userIds: string[]): void {
    this.stationService.addUsersToWorkerRoster(stationId, userIds)
      .pipe(first())
      .subscribe((data) => {
        if (data) {
          this.workerRosterStation = data;
        }
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }
}
