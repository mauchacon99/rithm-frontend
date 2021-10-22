import { Component } from '@angular/core';
import { StationService } from '../../core/station.service';
import { ErrorService } from '../../core/error.service';
import { StationRosterMember } from 'src/models';
import { first } from 'rxjs/operators';

/**
 * Component for roster management.
 */
@Component({
  selector: 'app-roster-management-modal',
  templateUrl: './roster-management-modal.component.html',
  styleUrls: ['./roster-management-modal.component.scss']
})
export class RosterManagementModalComponent {

  /** The worker roster of the station given. */
  stationWorkerRoster: StationRosterMember[] = [];

  constructor(
    private stationService: StationService,
    private errorService: ErrorService
  ){}

  /**
   * Get Workers Roster for a given Station.
   *
   * @param stationId The id of the given station.
   */
   getStationWorkerRoster(stationId: string): void {
    this.stationService.getStationWorkerRoster(stationId)
    .pipe(first())
    .subscribe((data)=>{
      if (data){
        this.stationWorkerRoster = data;
      }
    }, (error: unknown) => {
      this.errorService.displayError(
        'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
        error
      );
    });
  }
}
