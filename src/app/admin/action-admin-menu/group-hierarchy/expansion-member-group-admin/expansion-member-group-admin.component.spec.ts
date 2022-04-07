import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { StationService } from 'src/app/core/station.service';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { RosterManagementModalComponent } from 'src/app/shared/roster-management-modal/roster-management-modal.component';
import { RosterComponent } from 'src/app/shared/roster/roster.component';
import { UserAvatarComponent } from 'src/app/shared/user-avatar/user-avatar.component';
import {
  MockErrorService,
  MockPopupService,
  MockStationService,
} from 'src/mocks';
import { StationGroupData, StationListGroup } from 'src/models';
import { ExpansionMemberGroupAdminComponent } from './expansion-member-group-admin.component';

describe('ExpansionMemberGroupAdminComponent', () => {
  let component: ExpansionMemberGroupAdminComponent;
  let fixture: ComponentFixture<ExpansionMemberGroupAdminComponent>;
  let stationService: StationService;
  let errorService: ErrorService;

  const subStationGroups: StationGroupData = {
    rithmId: '1375027-78345-73824-54244',
    title: 'Sub Station Group',
    subStationGroups: [],
    stations: [],
    users: [
      {
        rithmId: '789-798-456',
        firstName: 'Noah',
        lastName: 'Smith',
        email: 'name2@company.com',
        isWorker: true,
        isOwner: true,
      },
    ],
    admins: [
      {
        rithmId: '159-753-456',
        firstName: 'Taylor',
        lastName: 'Du',
        email: 'name3@company.com',
        isWorker: true,
        isOwner: true,
      },
    ],
    isChained: true,
    isImplicitRootStationGroup: true,
  };

  const stations: StationListGroup = {
    rithmId: '123-321-456',
    name: 'station 1',
    workers: [
      {
        rithmId: '123-321-456',
        firstName: 'John',
        lastName: 'Wayne',
        email: 'name@company.com',
        isWorker: true,
        isOwner: true,
      },
    ],
    stationOwners: [
      {
        rithmId: '789-798-456',
        firstName: 'Peter',
        lastName: 'Doe',
        email: 'name1@company.com',
        isWorker: true,
        isOwner: true,
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ExpansionMemberGroupAdminComponent,
        MockComponent(LoadingIndicatorComponent),
        MockComponent(UserAvatarComponent),
        MockComponent(RosterComponent),
      ],
      imports: [
        MatExpansionModule,
        NoopAnimationsModule,
        MatListModule,
        MatDialogModule,
      ],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: StationService, useClass: MockStationService },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionMemberGroupAdminComponent);
    stationService = TestBed.inject(StationService);
    errorService = TestBed.inject(ErrorService);
    component = fixture.componentInstance;
    component.stationOrGroupSelected = stations;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Selected item is group', () => {
    beforeEach(() => {
      component.stationOrGroupSelected = subStationGroups;
      fixture.detectChanges();
    });

    it('should  return true if isGroup', () => {
      const result = component.isGroup;
      expect(result).toBeTrue();
    });

    it('should call method delete for remove admin in group', () => {
      const idsUsers = '123-654-789-95123687';
      component.isAdmin = true;
      const spyService = spyOn(
        stationService,
        'removeUsersFromOwnerRosterGroup'
      ).and.callThrough();
      component.removeMemberFromRosterGroup(idsUsers);
      expect(spyService).toHaveBeenCalledOnceWith(subStationGroups.rithmId, [
        idsUsers,
      ]);
    });

    it('should catch error if petition delete member admin in group', () => {
      const idsUsers = '123-654-789-95123687';
      component.isAdmin = true;
      spyOn(stationService, 'removeUsersFromOwnerRosterGroup').and.returnValue(
        throwError(() => {
          throw new Error();
        })
      );
      const spyError = spyOn(errorService, 'displayError').and.callThrough();
      component.removeMemberFromRosterGroup(idsUsers);
      expect(spyError).toHaveBeenCalled();
    });

    it('should call method delete for remove users in group', () => {
      const idsUsers = '123-654-789-95123687';
      component.isAdmin = false;
      const spyService = spyOn(
        stationService,
        'removeUsersFromWorkerRosterGroup'
      ).and.callThrough();
      component.removeMemberFromRosterGroup(idsUsers);
      expect(spyService).toHaveBeenCalledOnceWith(subStationGroups.rithmId, [
        idsUsers,
      ]);
    });

    it('should catch error if petition delete member users in group', () => {
      const idsUsers = '123-654-789-95123687';
      component.isAdmin = false;
      spyOn(stationService, 'removeUsersFromWorkerRosterGroup').and.returnValue(
        throwError(() => {
          throw new Error();
        })
      );
      const spyError = spyOn(errorService, 'displayError').and.callThrough();
      component.removeMemberFromRosterGroup(idsUsers);
      expect(spyError).toHaveBeenCalled();
    });

    it('should call service that return station group members for stations group how admin', () => {
      component.isAdmin = true;
      const spyService = spyOn(
        stationService,
        'getStationGroupOwnerRoster'
      ).and.callThrough();
      component.ngOnInit();
      expect(spyService).toHaveBeenCalled();
    });

    it('should call service that return station group members for stations group how user', () => {
      const spyService = spyOn(
        stationService,
        'getStationGroupWorkerRoster'
      ).and.callThrough();
      component.isAdmin = false;
      component.ngOnInit();
      expect(spyService).toHaveBeenCalled();
    });

    it('should show error message when station group members for stations group how user fail', () => {
      spyOn(stationService, 'getStationGroupWorkerRoster').and.returnValue(
        throwError(() => {
          throw new Error();
        })
      );
      const spyService = spyOn(
        TestBed.inject(ErrorService),
        'displayError'
      ).and.callThrough();
      component.ngOnInit();
      expect(spyService).toHaveBeenCalled();
    });

    it('should show error message when station group members for stations group how admin fail', () => {
      component.isAdmin = true;
      spyOn(stationService, 'getStationGroupOwnerRoster').and.returnValue(
        throwError(() => {
          throw new Error();
        })
      );
      const spyService = spyOn(
        TestBed.inject(ErrorService),
        'displayError'
      ).and.callThrough();
      component.ngOnInit();
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('Selected item is station', () => {
    const members = [
      {
        rithmId: 'a3f2e8ef-c7cc-4eaf-8833-d6385d4b35f9',
        firstName: 'Bo-Katan',
        lastName: 'Kryze',
        email: 'bokatan.kryze@inpivota.com',
        isWorker: false,
        isOwner: true,
      },
    ];

    beforeEach(() => {
      component.stationOrGroupSelected = stations;
      fixture.detectChanges();
    });

    it('should  return false if is station', () => {
      const result = component.isGroup;
      expect(result).toBeFalse();
    });

    it('should call service that return station members for stations how admin', () => {
      const spyService = spyOn(
        stationService,
        'getStationOwnerRoster'
      ).and.callThrough();
      component.isAdmin = true;
      fixture.detectChanges();
      component.ngOnInit();
      expect(spyService).toHaveBeenCalledOnceWith(stations.rithmId);
    });

    it('should call service that return station members for stations how user', () => {
      const spyService = spyOn(
        stationService,
        'getStationWorkerRoster'
      ).and.callThrough();
      component.isAdmin = false;
      fixture.detectChanges();
      component.ngOnInit();
      expect(spyService).toHaveBeenCalledOnceWith(stations.rithmId);
    });

    it('should display a confirmation pop up', async () => {
      const confirmationData = {
        title: 'Remove Member?',
        message: 'This cannot be undone!',
        okButtonText: 'Yes',
        cancelButtonText: 'No',
        important: true,
      };

      const popUpConfirmSpy = spyOn(
        TestBed.inject(PopupService),
        'confirm'
      ).and.callThrough();

      await component.confirmRemoveMember(members[0].rithmId);
      expect(popUpConfirmSpy).toHaveBeenCalledOnceWith(confirmationData);
    });

    it('should remove member admin on station specified', () => {
      component.isAdmin = true;
      fixture.detectChanges();
      const spyRemoveUsersFromOwnerRoster = spyOn(
        stationService,
        'removeUsersFromOwnerRoster'
      ).and.callThrough();
      component.removeMemberFromRosterStation(members[0].rithmId);
      expect(spyRemoveUsersFromOwnerRoster).toHaveBeenCalledOnceWith(
        stations.rithmId,
        [members[0].rithmId]
      );
    });

    it('should remove member user on station specified', () => {
      component.isAdmin = false;
      fixture.detectChanges();
      const spyRemoveUsersFromWorkerRoster = spyOn(
        stationService,
        'removeUsersFromWorkerRoster'
      ).and.callThrough();
      component.removeMemberFromRosterStation(members[0].rithmId);
      expect(spyRemoveUsersFromWorkerRoster).toHaveBeenCalledOnceWith(
        stations.rithmId,
        [members[0].rithmId]
      );
    });

    it('should call alert error if petition removeMemberFromRosterStation for workers fail', () => {
      component.isAdmin = false;
      spyOn(stationService, 'removeUsersFromWorkerRoster').and.returnValue(
        throwError(() => {
          throw new Error();
        })
      );
      const spyError = spyOn(errorService, 'displayError').and.callThrough();
      component.removeMemberFromRosterStation(members[0].rithmId);
      expect(spyError).toHaveBeenCalled();
    });

    it('should call alert error if petition removeMemberFromRosterStation for owners fail', () => {
      component.isAdmin = true;
      spyOn(stationService, 'removeUsersFromOwnerRoster').and.returnValue(
        throwError(() => {
          throw new Error();
        })
      );
      const spyError = spyOn(errorService, 'displayError').and.callThrough();
      component.removeMemberFromRosterStation(members[0].rithmId);
      expect(spyError).toHaveBeenCalled();
    });

    it('should call method for remove members if is group', async () => {
      component.stationOrGroupSelected = subStationGroups;
      fixture.detectChanges();

      const popUpConfirmSpy = spyOn(
        TestBed.inject(PopupService),
        'confirm'
      ).and.callThrough();

      const removeMemberFromRosterStation = spyOn(
        component,
        'removeMemberFromRosterStation'
      ).and.callThrough();

      const removeMemberFromRosterGroup = spyOn(
        component,
        'removeMemberFromRosterGroup'
      ).and.callThrough();

      await component.confirmRemoveMember(members[0].rithmId);
      expect(popUpConfirmSpy).toHaveBeenCalled();
      expect(removeMemberFromRosterStation).not.toHaveBeenCalled();
      expect(removeMemberFromRosterGroup).toHaveBeenCalled();
    });

    it('should call method for remove members if is station', async () => {
      component.stationOrGroupSelected = stations;
      fixture.detectChanges();

      const popUpConfirmSpy = spyOn(
        TestBed.inject(PopupService),
        'confirm'
      ).and.callThrough();

      const removeMemberFromRosterStation = spyOn(
        component,
        'removeMemberFromRosterStation'
      ).and.callThrough();

      const removeMemberFromRosterGroup = spyOn(
        component,
        'removeMemberFromRosterGroup'
      ).and.callThrough();

      await component.confirmRemoveMember(members[0].rithmId);
      expect(popUpConfirmSpy).toHaveBeenCalled();
      expect(removeMemberFromRosterStation).toHaveBeenCalled();
      expect(removeMemberFromRosterGroup).not.toHaveBeenCalled();
    });
  });

  it('should show error message when request getStationsMembers fail', () => {
    spyOn(stationService, 'getStationWorkerRoster').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(errorService, 'displayError').and.returnValue();
    component.ngOnInit();
    fixture.detectChanges();
    const showMessage =
      fixture.debugElement.nativeElement.querySelector('#failed-get-users');
    expect(spyError).toHaveBeenCalled();
    expect(showMessage).toBeTruthy();
    expect(component.isErrorGetUsers).toBeTrue();
  });

  it('should show loading indicator', () => {
    component.isLoading = true;

    fixture.detectChanges();
    const isLoading = fixture.debugElement.nativeElement.querySelector(
      '#loading-get-members'
    );

    expect(isLoading).toBeTruthy();
  });

  it('should call modal RosterManagementModal', () => {
    const expectedParam = {
      panelClass: ['w-5/6', 'sm:w-4/5'],
      maxWidth: '1024px',
      disableClose: true,
      data: {
        stationId: stations.rithmId,
        type: 'owners',
      },
    };

    component.isAdmin = true;
    fixture.detectChanges();
    const spyMethod = spyOn(
      component,
      'openManagementRosterModal'
    ).and.callThrough();

    const spyGetStationsMembers = spyOn(
      stationService,
      'getStationOwnerRoster'
    ).and.callThrough();

    const spyDialog = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue({
      afterClosed: () => of(false),
    } as MatDialogRef<typeof component>);

    const buttonAdd =
      fixture.debugElement.nativeElement.querySelector('#add-user-button');
    expect(buttonAdd).toBeTruthy();

    buttonAdd.click();
    expect(spyMethod).toHaveBeenCalled();
    expect(spyDialog).toHaveBeenCalledOnceWith(
      RosterManagementModalComponent,
      expectedParam
    );
    expect(spyGetStationsMembers).toHaveBeenCalled();
  });
});
