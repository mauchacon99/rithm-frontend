import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { UserService } from 'src/app/core/user.service';
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

  /** Array of avatars. */
  rosterMembers = [
    { firstName: 'Tyler', lastName: 'Hendrickson' },
    { firstName: 'Natasha ', lastName: 'Romanov' },
    { firstName: 'Clinton ', lastName: 'Barton' },
    { firstName: 'Steve', lastName: 'Rogers' },
    { firstName: 'Victor', lastName: 'Shade' }
  ];

  /** List users the organization. */
  listUsersOrgatization: StationRosterMember[] = [];

  /** Pages for users in organization. */
  pageNumUsersOrganization = 1;

  /** The station rithmId. */
  stationRithmId = '';

  /** Id the organization.  */
  organizationId = '';


  /** Valid. */
  valid = false;


  /** Array of list users. */
  listUsers=[
    {firstName:'Maggie',lastName:'Rhee',email:'maggie.rhee@email.com',  isWorker:false},
    {firstName:'Charles',lastName:'Willis',email:'charles.willis@email.com',isWorker:false},
    {firstName:'Billie',lastName:'Suanson',email:'billie.suanson@email.com',isWorker:false},
    {firstName:'Chuck',lastName:'Brown',email:'chuck.brown@email.com',isWorker:false},
    {firstName:'Harrison',lastName:'King',email:'harrison.king@email.com',isWorker:false},
    {firstName:'John',lastName:'Matrix',email:'john.matrix@email.com',isWorker:false},
    {firstName:'Barry',lastName:'Allen',email:'barry.allen@email.com',isWorker:false},
    {firstName:'Steve',lastName:'Rogers',email:'steve.rogers@email.com',isWorker:false},
  ];

  /** The worker roster of the station given. */
  stationWorkerRoster: StationRosterMember[] = [];

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public modalData: {/** The station rithmId. */ stationId: string },
  ) {
    this.stationRithmId = this.modalData.stationId;
    this.organizationId = this.userService.user?.organization;
  }

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getPotentialStationRosterMembers(this.organizationId, this.stationRithmId, this.pageNumUsersOrganization);
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
          this.stationWorkerRoster = data;
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
   * @param organizationId The id of the organization.
   * @param stationRithmId The Specific id of station.
   * @param pageNum The current page.
   */
  getPotentialStationRosterMembers(organizationId: string, stationRithmId: string, pageNum: number): void {
    this.stationService.getPotentialStationRosterMembers(organizationId, stationRithmId, pageNum)
      .pipe(first())
      .subscribe((orgUsers) => {
        if (orgUsers) {
          this.listUsersOrgatization = orgUsers;
        }
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }


  /**
   * Index from list users.
   *
   * @param index The id of the organization.
   */
  changeValid(index: number): void {
    this.listUsers[index].isWorker=!this.listUsers[index].isWorker;
  }
}
