import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { StationRosterMember } from 'src/models';
import { StationService } from '../../core/station.service';
import { ErrorService } from '../../core/error.service';

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
  workerRosterStation: StationRosterMember[] =  [];

  constructor(
    private stationService: StationService,
    private errorService: ErrorService
  ){}

  /**
   * Removes a user from the station's worker roster.
   *
   * @param stationId The Specific id of station.
   * @param usersIds The selected users id array to removed.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeUserFromWorkerRoster(stationId: string, usersIds: string[]): void{
    this.stationService.removeUserFromWorkerRoster(stationId, usersIds)
    .pipe(first())
    .subscribe((data)=>{
      this.workerRosterStation = data.workers;
    }, (error: unknown) => {
      this.errorService.displayError(
        'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
        error
      );
    });
  }
}
