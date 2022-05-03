import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService } from 'src/mocks';

import { RosterManagementModalComponent } from './roster-management-modal.component';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { MockComponent } from 'ng-mocks';
import { PaginationComponent } from '../pagination/pagination.component';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { throwError } from 'rxjs';

const DIALOG_TEST_DATA: { /** The station rithmId. */ stationId: string } = {
  stationId: '73d47261-1932-4fcf-82bd-159eb1a7243f',
};

describe('RosterManagementModalComponent', () => {
  let component: RosterManagementModalComponent;
  let fixture: ComponentFixture<RosterManagementModalComponent>;
  const stationRithmId = '73d47261-1932-4fcf-82bd-159eb1a7243f';
  const stationOrGroupRithmId = '3d147261-1333-2f2f-10bd-159eb1a7243g';
  const userList = ['495FC055-4472-45FE-A68E-B7A0D060E1C8'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RosterManagementModalComponent,
        MockComponent(UserAvatarComponent),
        MockComponent(PaginationComponent),
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [MatDialogModule],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
      ],
    }).compileComponents();
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
    const addUserToRosterSpy = spyOn(
      TestBed.inject(StationService),
      'addUsersToOwnersRoster'
    ).and.callThrough();

    await component.addUserToRoster(userList[0]);

    expect(addUserToRosterSpy).toHaveBeenCalledOnceWith(
      stationRithmId,
      userList
    );
  });

  it('should add a worker to station roster', async () => {
    component.rosterType = 'workers';
    const addUserToRosterSpy = spyOn(
      TestBed.inject(StationService),
      'addUsersToWorkerRoster'
    ).and.callThrough();

    await component.addUserToRoster(userList[0]);

    expect(addUserToRosterSpy).toHaveBeenCalledOnceWith(
      stationRithmId,
      userList
    );
  });

  it('should remove an owner to station roster', async () => {
    component.rosterType = 'owners';
    const addUserToRosterSpy = spyOn(
      TestBed.inject(StationService),
      'removeUsersFromOwnerRoster'
    ).and.callThrough();

    await component.removeMemberFromRoster(userList[0]);

    expect(addUserToRosterSpy).toHaveBeenCalledOnceWith(
      stationRithmId,
      userList
    );
  });

  it('should remove a worker to station roster', async () => {
    component.rosterType = 'workers';
    const addUserToRosterSpy = spyOn(
      TestBed.inject(StationService),
      'removeUsersFromWorkerRoster'
    ).and.callThrough();

    await component.removeMemberFromRoster(userList[0]);

    expect(addUserToRosterSpy).toHaveBeenCalledOnceWith(
      stationRithmId,
      userList
    );
  });

  it('should get the station owner roster', async () => {
    component.rosterType = 'owners';
    const addUserToRosterSpy = spyOn(
      TestBed.inject(StationService),
      'getStationOwnerRoster'
    ).and.callThrough();

    await component.getStationUsersRoster(stationRithmId);

    expect(addUserToRosterSpy).toHaveBeenCalledOnceWith(stationRithmId);
  });

  it('should get the station worker roster', async () => {
    component.rosterType = 'workers';
    const addUserToRosterSpy = spyOn(
      TestBed.inject(StationService),
      'getStationWorkerRoster'
    ).and.callThrough();

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
        isOwner: true,
      },
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
        isWorker: true,
      },
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
        isWorker: false,
      },
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
        isOwner: false,
      },
    ];
    const userRithmId = '4CFE69D2-C768-4066-8712-AB29C0241168';
    const addMemberSpy = spyOn(component, 'addUserToRoster');
    component.toggleSelectedUser(userRithmId);
    expect(addMemberSpy).toHaveBeenCalledOnceWith(userRithmId);
  });

  it('should display a loading indicator while getting potential members', () => {
    const pageNum = 1;
    component.getPotentialStationRosterMembers(stationRithmId, pageNum);
    expect(component.listLoading).toBe(true);
    const loading = fixture.debugElement.nativeElement.querySelector(
      '#user-organization-loading'
    );
    expect(loading).toBeTruthy();
  });

  it('should show loading-indicators while adding a user to roster', () => {
    component.addUserToRoster(userList[0]);
    expect(component.loadingMembers).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#roster-member-loading'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should show loading-indicators while remove a user to roster', () => {
    component.removeMemberFromRoster(userList[0]);
    expect(component.loadingMembers).toBe(true);
    const loadingComponent = fixture.debugElement.nativeElement.querySelector(
      '#roster-member-loading'
    );
    expect(loadingComponent).toBeTruthy();
  });

  it('should add a worker user to stationGroup roster', () => {
    component.rosterType = 'workers';
    fixture.detectChanges();
    const addUserStationGroupToRosterSpy = spyOn(
      TestBed.inject(StationService),
      'addUserStationGroupWorkersRoster'
    ).and.callThrough();
    component.addUserStationGroupToRoster(userList[0]);
    expect(addUserStationGroupToRosterSpy).toHaveBeenCalledOnceWith(
      stationRithmId,
      userList
    );
  });

  it('should add a worker user to stationGroup owners', () => {
    component.rosterType = 'owners';
    fixture.detectChanges();
    const addUserStationGroupToOwnersRosterSpy = spyOn(
      TestBed.inject(StationService),
      'addUserStationGroupToOwnersRoster'
    ).and.callThrough();
    component.addUserStationGroupToRoster(userList[0]);
    expect(addUserStationGroupToOwnersRosterSpy).toHaveBeenCalledOnceWith(
      stationRithmId,
      userList
    );
  });

  it('should call errorService if request in addUserStationGroupToRoster for owner fail', () => {
    component.rosterType = 'owners';
    fixture.detectChanges();
    const errorSpy = spyOn(
      TestBed.inject(StationService),
      'addUserStationGroupToOwnersRoster'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();

    component.addUserStationGroupToRoster(userList[0]);
    expect(errorSpy).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  it('should call errorService if request in addUserStationGroupToRoster for worker fail', () => {
    component.rosterType = 'workers';
    fixture.detectChanges();
    const errorSpy = spyOn(
      TestBed.inject(StationService),
      'addUserStationGroupWorkersRoster'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();

    component.addUserStationGroupToRoster(userList[0]);
    expect(errorSpy).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  it('should call getPotentialStationRosterMembers if not isGroup', () => {
    component.isGroup = false;
    fixture.detectChanges();
    const spyMethod = spyOn(
      component,
      'getPotentialStationRosterMembers'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyMethod).toHaveBeenCalled();
  });

  it('should call addUserStationGroupToRoster in toggleSelectedUser if isGroup', () => {
    component.users = [
      {
        rithmId: '4CFE69D2-C768-4066-8712-AB29C0241168',
        firstName: 'Rithm',
        lastName: 'Admin',
        email: 'rithmadmin@inpivota.com',
        isOwner: true,
      },
    ];
    const userRithmId = '4CFE69D2-C768-4066-8712-AB29C0241168';
    component.isGroup = true;
    component.rosterType = 'workers';
    fixture.detectChanges();
    const spyMethod = spyOn(
      component,
      'addUserStationGroupToRoster'
    ).and.callThrough();
    component.toggleSelectedUser(userRithmId);
    expect(spyMethod).toHaveBeenCalled();
  });

  it('should call addUserToRoster in toggleSelectedUser if not isGroup', () => {
    component.users = [
      {
        rithmId: '4CFE69D2-C768-4066-8712-AB29C0241168',
        firstName: 'Rithm',
        lastName: 'Admin',
        email: 'rithmadmin@inpivota.com',
        isOwner: true,
      },
    ];
    const userRithmId = '4CFE69D2-C768-4066-8712-AB29C0241168';
    component.isGroup = false;
    component.rosterType = 'workers';
    fixture.detectChanges();
    const spyMethod = spyOn(component, 'addUserToRoster').and.callThrough();
    component.toggleSelectedUser(userRithmId);
    expect(spyMethod).toHaveBeenCalled();
  });

  it('should get potential user for stationGroup', () => {
    component.isGroup = true;
    fixture.detectChanges();
    const getPotentialStationGroupRosterMemberSpy = spyOn(
      TestBed.inject(StationService),
      'getPotentialStationGroupRosterMembers'
    ).and.callThrough();
    component.getPotentialStationRosterMembers(stationOrGroupRithmId, 1);
    expect(getPotentialStationGroupRosterMemberSpy).toHaveBeenCalledOnceWith(
      stationOrGroupRithmId,
      1
    );
  });

  it('should call errorService if request getPotentialStationGroupRosterMembers fail', () => {
    component.isGroup = true;
    fixture.detectChanges();
    const errorSpy = spyOn(
      TestBed.inject(StationService),
      'getPotentialStationGroupRosterMembers'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();

    component.getPotentialStationRosterMembers(stationOrGroupRithmId, 1);
    expect(errorSpy).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  it('should call getStationGroupUsersRoster when is group and is worker', () => {
    component.isGroup = true;
    component.rosterType = 'workers';
    component.stationOrGroupRithmId = stationOrGroupRithmId;
    fixture.detectChanges();
    const getStationGroupUsersRosterSpy = spyOn(
      component,
      'getStationGroupUsersRoster'
    ).and.callThrough();

    const getStationGroupWorkerRosterSpy = spyOn(
      TestBed.inject(StationService),
      'getStationGroupWorkerRoster'
    ).and.callThrough();

    component.ngOnInit();
    expect(getStationGroupUsersRosterSpy).toHaveBeenCalledOnceWith(
      stationOrGroupRithmId
    );
    expect(getStationGroupWorkerRosterSpy).toHaveBeenCalledOnceWith(
      stationOrGroupRithmId
    );
  });

  it('should call getStationGroupUsersRoster when is group and is owner', () => {
    component.isGroup = true;
    component.rosterType = 'owners';
    component.stationOrGroupRithmId = stationOrGroupRithmId;
    fixture.detectChanges();
    const getStationGroupUsersRosterSpy = spyOn(
      component,
      'getStationGroupUsersRoster'
    ).and.callThrough();

    const getStationGroupOwnerRosterSpy = spyOn(
      TestBed.inject(StationService),
      'getStationGroupOwnerRoster'
    ).and.callThrough();

    component.ngOnInit();
    expect(getStationGroupUsersRosterSpy).toHaveBeenCalledOnceWith(
      stationOrGroupRithmId
    );
    expect(getStationGroupOwnerRosterSpy).toHaveBeenCalledOnceWith(
      stationOrGroupRithmId
    );
  });

  it('should call getStationGroupUsersRoster when is not group', () => {
    component.isGroup = false;
    component.stationOrGroupRithmId = stationOrGroupRithmId;
    fixture.detectChanges();
    const getStationUsersRosterSpy = spyOn(
      component,
      'getStationUsersRoster'
    ).and.callThrough();
    component.ngOnInit();
    expect(getStationUsersRosterSpy).toHaveBeenCalledOnceWith(
      stationOrGroupRithmId
    );
  });

  it('should call removeMemberFromRosterGroup if isGroup and is owners', () => {
    const userRithmId = '4CFE69D2-C768-4066-8712-AB29C0241168';
    component.users = [
      {
        rithmId: userRithmId,
        firstName: 'Rithm',
        lastName: 'Admin',
        email: 'rithmadmin@inpivota.com',
        isOwner: true,
      },
    ];
    component.rosterType = 'owners';
    component.isGroup = true;
    component.stationOrGroupRithmId = stationOrGroupRithmId;
    fixture.detectChanges();

    const removeMemberFromRosterGroupSpy = spyOn(
      component,
      'removeMemberFromRosterGroup'
    ).and.callThrough();

    const removeUsersFromOwnerRosterSpy = spyOn(
      TestBed.inject(StationService),
      'removeUsersFromOwnerRosterGroup'
    ).and.callThrough();

    component.toggleSelectedUser(userRithmId);
    expect(removeMemberFromRosterGroupSpy).toHaveBeenCalledOnceWith(
      userRithmId
    );
    expect(removeUsersFromOwnerRosterSpy).toHaveBeenCalledOnceWith(
      stationOrGroupRithmId,
      [userRithmId]
    );
  });

  it('should call removeMemberFromRosterGroup if isGroup and is workers', () => {
    const userRithmId = '4CFE69D2-C768-4066-8712-AB29C0241168';
    component.users = [
      {
        rithmId: userRithmId,
        firstName: 'Rithm',
        lastName: 'Admin',
        email: 'rithmadmin@inpivota.com',
        isWorker: true,
      },
    ];
    component.rosterType = 'workers';
    component.isGroup = true;
    component.stationOrGroupRithmId = stationOrGroupRithmId;
    fixture.detectChanges();

    const removeMemberFromRosterGroupSpy = spyOn(
      component,
      'removeMemberFromRosterGroup'
    ).and.callThrough();

    const removeUsersFromWorkerRosterGroupSpy = spyOn(
      TestBed.inject(StationService),
      'removeUsersFromWorkerRosterGroup'
    ).and.callThrough();

    component.toggleSelectedUser(userRithmId);
    expect(removeMemberFromRosterGroupSpy).toHaveBeenCalledOnceWith(
      userRithmId
    );
    expect(removeUsersFromWorkerRosterGroupSpy).toHaveBeenCalledOnceWith(
      stationOrGroupRithmId,
      [userRithmId]
    );
  });

  it('should call removeMemberFromRoster if station', () => {
    const userRithmId = '4CFE69D2-C768-4066-8712-AB29C0241168';
    component.users = [
      {
        rithmId: userRithmId,
        firstName: 'Rithm',
        lastName: 'Admin',
        email: 'rithmadmin@inpivota.com',
        isWorker: true,
      },
    ];
    component.rosterType = 'workers';
    component.isGroup = false;
    component.stationOrGroupRithmId = stationOrGroupRithmId;
    fixture.detectChanges();

    const removeMemberFromRosterGroupSpy = spyOn(
      component,
      'removeMemberFromRoster'
    ).and.callThrough();

    component.toggleSelectedUser(userRithmId);
    expect(removeMemberFromRosterGroupSpy).toHaveBeenCalledOnceWith(
      userRithmId
    );
  });

  it('should call errorService if request getStationGroupOwnerRoster fail', () => {
    component.rosterType = 'owners';
    component.stationOrGroupRithmId = stationOrGroupRithmId;
    fixture.detectChanges();

    const errorServiceSpy = spyOn(
      TestBed.inject(StationService),
      'getStationGroupOwnerRoster'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();

    component.getStationGroupUsersRoster(stationOrGroupRithmId);
    expect(errorServiceSpy).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  it('should call errorService if request getStationGroupWorkerRoster fail', () => {
    component.rosterType = 'workers';
    component.stationOrGroupRithmId = stationOrGroupRithmId;
    fixture.detectChanges();

    const errorServiceSpy = spyOn(
      TestBed.inject(StationService),
      'getStationGroupWorkerRoster'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();

    component.getStationGroupUsersRoster(stationOrGroupRithmId);
    expect(errorServiceSpy).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  it('should call errorService if request removeUsersFromWorkerRosterGroup fail', () => {
    const userRithmId = '4CFE69D2-C768-4066-8712-AB29C0241168';
    component.users = [
      {
        rithmId: userRithmId,
        firstName: 'Rithm',
        lastName: 'Admin',
        email: 'rithmadmin@inpivota.com',
        isWorker: true,
      },
    ];
    component.rosterType = 'workers';
    component.stationOrGroupRithmId = stationOrGroupRithmId;
    fixture.detectChanges();

    const errorServiceSpy = spyOn(
      TestBed.inject(StationService),
      'removeUsersFromWorkerRosterGroup'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();

    component.removeMemberFromRosterGroup(stationOrGroupRithmId);
    expect(errorServiceSpy).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  it('should call errorService if request removeUsersFromOwnerRosterGroup fail', () => {
    const userRithmId = '4CFE69D2-C768-4066-8712-AB29C0241168';
    component.users = [
      {
        rithmId: userRithmId,
        firstName: 'Rithm',
        lastName: 'Admin',
        email: 'rithmadmin@inpivota.com',
        isOwner: true,
      },
    ];
    component.rosterType = 'owners';
    component.stationOrGroupRithmId = stationOrGroupRithmId;
    fixture.detectChanges();

    const errorServiceSpy = spyOn(
      TestBed.inject(StationService),
      'removeUsersFromOwnerRosterGroup'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();

    component.removeMemberFromRosterGroup(stationOrGroupRithmId);
    expect(errorServiceSpy).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });
});
