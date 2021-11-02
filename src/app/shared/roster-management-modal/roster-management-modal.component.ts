import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
export class RosterManagementModalComponent implements OnInit {

  /** List users the organization. */
  listUsersOrganization: StationRosterMember[] = [];

  /** Pages for users in organization. */
  pageNumUsersOrganization = 1;

  /** The station rithmId. */
  stationRithmId = '';

  /** The worker roster of the station given. */
  rosterMembers: StationRosterMember[] = [];

  /** Total the of members in the list of organization members. */
  totalPotentialUsers = 0;

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    @Inject(MAT_DIALOG_DATA) public modalData: {/** The station rithmId. */ stationId: string },
  ) {
    this.stationRithmId = this.modalData.stationId;
  }

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getPotentialStationRosterMembers(this.stationRithmId, this.pageNumUsersOrganization);
    this.getStationWorkerRoster(this.stationRithmId);
  }

  /**
   * Get Workers Roster for a given Station.
   *
   * @param stationId The id of the given station.
   */
  getStationWorkerRoster(stationId: string): void {
    this.stationService.getStationWorkerRoster(stationId)
      .pipe(first())
      .subscribe((data) => {
        if (data) {
          this.rosterMembers = data;
        }
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }

  /**
   * Get organization users for a specific station.
   *
   * @param stationRithmId The Specific id of station.
   * @param pageNum The current page.
   */
  getPotentialStationRosterMembers(stationRithmId: string, pageNum: number): void {
    this.stationService.getPotentialStationRosterMembers(stationRithmId, pageNum)
      .pipe(first())
      .subscribe((potentialUsers) => {
        if (potentialUsers) {
          this.listUsersOrganization = potentialUsers.users;
          this.totalPotentialUsers = potentialUsers.totalUsers;
        }
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }

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
          this.rosterMembers = data;
        }
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }

  /**
   * Removes members from the station's worker roster.
   *
   * @param usersId The selected user id to remove.
   */
   removeMemberFromRoster(usersId: string): void {
    const usersIds: string[] = [];
    usersIds.push(usersId);
    this.stationService.removeUsersFromWorkerRoster(this.stationRithmId, usersIds)
      .pipe(first())
      .subscribe((data) => {
        this.rosterMembers = data;
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }
}
