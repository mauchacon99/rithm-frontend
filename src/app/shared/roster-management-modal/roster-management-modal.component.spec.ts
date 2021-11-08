import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService } from 'src/mocks';

import { RosterManagementModalComponent } from './roster-management-modal.component';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { MockComponent } from 'ng-mocks';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';

const DIALOG_TEST_DATA: {/** The station rithmId. */ stationId: string } = {
  stationId: 'jk34jk34jk34'
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
        MockComponent(LoadingIndicatorComponent),
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
    component.rosterType = 'owner';
    const addUserToRosterSpy = spyOn(TestBed.inject(StationService), 'addUsersToOwnersRoster').and.callThrough();

    await component.addUsersToRoster(stationRithmId, userList);

    expect(addUserToRosterSpy).toHaveBeenCalledOnceWith(stationRithmId, userList);
  });

  it('should add a worker to station roster', async () => {
    component.rosterType = 'worker';
    const addUserToRosterSpy = spyOn(TestBed.inject(StationService), 'addUsersToWorkerRoster').and.callThrough();

    await component.addUsersToRoster(stationRithmId, userList);

    expect(addUserToRosterSpy).toHaveBeenCalledOnceWith(stationRithmId, userList);
  });

  it('should call remove users from station user list', async () => {
    component.rosterType = 'owner';
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
    const removeOwnerSpy = spyOn(component,'removeMemberFromRoster');
    await component.toggleSelectedUser(userRithmId);
    expect(removeOwnerSpy).toHaveBeenCalledOnceWith(userRithmId);
  });

  it('should call remove users from station user list', async () => {
    component.rosterType = 'worker';
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

});
