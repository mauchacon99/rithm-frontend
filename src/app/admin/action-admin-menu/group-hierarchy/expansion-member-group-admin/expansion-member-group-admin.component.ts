import { Component, Input } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import {
  StationGroupData,
  StationListGroup,
  StationRosterMember,
} from 'src/models';

/** Component expansions member. */
@Component({
  selector: 'app-expansion-member-group-admin[selectedItem][isAdmin]',
  templateUrl: './expansion-member-group-admin.component.html',
  styleUrls: ['./expansion-member-group-admin.component.scss'],
})
export class ExpansionMemberGroupAdminComponent {
  /** Value of selected item. */
  @Input() set selectedItem(value: StationGroupData | StationListGroup) {
    this.stationSelected = value;
    if (!this.isGroup) {
      this.getStationsMembers();
    }
  }

  /** Is admin. */
  @Input() isAdmin!: boolean;

  /** Value of selected item. */
  stationSelected!: StationGroupData | StationListGroup;

  /** Station Members . */
  members!: StationRosterMember[];

  /** Load indicator in dashboard. */
  isLoading = false;

  /** If request getStationsMembers fail. */
  isErrorGetUsers = false;

  /** Status expanded, this save the state the panel for show icon expanded. */
  panelOpenState = false;

  /**
   * Return if selectedItem is group.
   *
   * @returns Is group.
   */
  get isGroup(): boolean {
    return 'stations' in this.stationSelected;
  }

  constructor(
    private stationService: StationService,
    private errorService: ErrorService
  ) {}

  /**
   * Get stations OwnerRoster and WorkerRoster.
   *
   */
  getStationsMembers(): void {
    this.isLoading = true;
    this.isErrorGetUsers = false;
    const getStation$ = this.isAdmin
      ? this.stationService.getStationOwnerRoster(this.stationSelected.rithmId)
      : this.stationService.getStationWorkerRoster(
          this.stationSelected.rithmId
        );

    getStation$.pipe(first()).subscribe({
      next: (members) => {
        this.members = members;
        this.isLoading = false;
        this.isErrorGetUsers = false;
      },
      error: (error: unknown) => {
        this.isLoading = false;
        this.isErrorGetUsers = true;
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }
}
