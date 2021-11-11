import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, } from '@angular/material/dialog';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService } from 'src/mocks';

import { RosterManagementModalComponent } from './roster-management-modal.component';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { MockComponent } from 'ng-mocks';
import { PaginationComponent } from '../pagination/pagination.component';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';


const DIALOG_TEST_DATA: {/** The station rithmId. */ stationId: string } = {
  stationId: '73d47261-1932-4fcf-82bd-159eb1a7243f'
};

describe('RosterManagementModalComponent', () => {
  let component: RosterManagementModalComponent;
  let fixture: ComponentFixture<RosterManagementModalComponent>;
  const stationRithmId = '73d47261-1932-4fcf-82bd-159eb1a7243f';
  const userList = ['495FC055-4472-45FE-A68E-B7A0D060E1C8'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RosterManagementModalComponent,
        MockComponent(UserAvatarComponent),
        MockComponent(PaginationComponent),
        MockComponent(LoadingIndicatorComponent),

      ],
      imports: [
        MatDialogModule
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add an owner to station roster', async () => {
    component.rosterType = 'owners';
    const addUserToRosterSpy = spyOn(TestBed.inject(StationService), 'addUsersToOwnersRoster').and.callThrough();

    await component.addUserToRoster(userList[0]);

    expect(addUserToRosterSpy).toHaveBeenCalledOnceWith(stationRithmId, userList);
  });

  it('should add a worker to station roster', async () => {
    component.rosterType = 'workers';
    const addUserToRosterSpy = spyOn(TestBed.inject(StationService), 'addUsersToWorkerRoster').and.callThrough();

    await component.addUserToRoster(userList[0]);

    expect(addUserToRosterSpy).toHaveBeenCalledOnceWith(stationRithmId, userList);
  });


  it('should remove an owner to station roster', async () => {
    component.rosterType = 'owners';
    const addUserToRosterSpy = spyOn(TestBed.inject(StationService), 'removeUsersFromOwnerRoster').and.callThrough();

    await component.removeMemberFromRoster(userList[0]);

    expect(addUserToRosterSpy).toHaveBeenCalledOnceWith(stationRithmId, userList);
  });

  it('should remove a worker to station roster', async () => {
    component.rosterType = 'workers';
    const addUserToRosterSpy = spyOn(TestBed.inject(StationService), 'removeUsersFromWorkerRoster').and.callThrough();

    await component.removeMemberFromRoster(userList[0]);

    expect(addUserToRosterSpy).toHaveBeenCalledOnceWith(stationRithmId, userList);
  });

  it('should get the station owner roster', async () => {
    component.rosterType = 'owners';
    const addUserToRosterSpy = spyOn(TestBed.inject(StationService), 'getStationOwnerRoster').and.callThrough();

    await component.getStationUsersRoster(stationRithmId);

    expect(addUserToRosterSpy).toHaveBeenCalledOnceWith(stationRithmId);
  });

  it('should get the station worker roster', async () => {
    component.rosterType = 'workers';
    const addUserToRosterSpy = spyOn(TestBed.inject(StationService), 'getStationWorkerRoster').and.callThrough();

    await component.getStationUsersRoster(stationRithmId);

    expect(addUserToRosterSpy).toHaveBeenCalledOnceWith(stationRithmId);
  });

  it('should remove an owner from station roster', async () => {
    component.rosterType = 'owners';
    component.users = [
      {
        rithmId: '4CFE69D2-C768-4066-8712-AB29C0241168',
        firstName: 'Rithm',
        lastName: 'Admin',
        email: 'rithmadmin@inpivota.com',
        isOwner: true
      }
    ];
    const userRithmId = '4CFE69D2-C768-4066-8712-AB29C0241168';
    const removeOwnerSpy = spyOn(component, 'removeMemberFromRoster');
    await component.toggleSelectedUser(userRithmId);
    expect(removeOwnerSpy).toHaveBeenCalledOnceWith(userRithmId);
  });

  it('should remove a worker user from station roster', async () => {
    component.rosterType = 'workers';
    component.users = [
      {
        rithmId: '4CFE69D2-C768-4066-8712-AB29C0241168',
        firstName: 'Rithm',
        lastName: 'Admin',
        email: 'rithmadmin@inpivota.com',
        isWorker: true
      }
    ];
    const userRithmId = '4CFE69D2-C768-4066-8712-AB29C0241168';
    const removeWorkerSpy = spyOn(component, 'removeMemberFromRoster');
    await component.toggleSelectedUser(userRithmId);
    expect(removeWorkerSpy).toHaveBeenCalledOnceWith(userRithmId);
  });

  it('should add a worker user to station roster', () => {
    component.rosterType = 'workers';
    component.users = [
      {
        rithmId: '4CFE69D2-C768-4066-8712-AB29C0241168',
        firstName: 'Rithm',
        lastName: 'Admin',
        email: 'rithmadmin@inpivota.com',
        isWorker: false
      }
    ];
    const userRithmId = '4CFE69D2-C768-4066-8712-AB29C0241168';
    const addMemberSpy = spyOn(component, 'addUserToRoster');
    component.toggleSelectedUser(userRithmId);
    expect(addMemberSpy).toHaveBeenCalledOnceWith(userRithmId);
  });

  it('should add an owner to station roster', () => {
    component.rosterType = 'owners';
    component.users = [
      {
        rithmId: '4CFE69D2-C768-4066-8712-AB29C0241168',
        firstName: 'Rithm',
        lastName: 'Admin',
        email: 'rithmadmin@inpivota.com',
        isOwner: false
      }
    ];
    const userRithmId = '4CFE69D2-C768-4066-8712-AB29C0241168';
    const addMemberSpy = spyOn(component, 'addUserToRoster');
    component.toggleSelectedUser(userRithmId);
    expect(addMemberSpy).toHaveBeenCalledOnceWith(userRithmId);
  });

  it('should loading indicator before getting potential members', () => {
    const pageNum = 1;
    component.getPotentialStationRosterMembers(stationRithmId, pageNum);
    expect(component.listLoading).toBe(true);
    const loading = fixture.debugElement.nativeElement.querySelector('#user-organization-loading');
    expect(loading).toBeTruthy();
  });

  it('should show loading-indicators while adding a user to roster', () => {
    component.addUserToRoster(userList[0]);
    expect(component.loadingMembers).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector('#roster-member-loading');
    expect(loadingComponent).toBeTruthy();
  });

  it('should show loading-indicators while remove a user to roster', () => {
    component.removeMemberFromRoster(userList[0]);
    expect(component.loadingMembers).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector('#roster-member-loading');
    expect(loadingComponent).toBeTruthy();
  });
});
