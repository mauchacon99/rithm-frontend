import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockErrorService, MockStationService } from 'src/mocks';
import { StationGroupData, StationListGroup } from 'src/models';
import { ExpansionMemberGroupAdminComponent } from './expansion-member-group-admin.component';

describe('ExpansionMemberGroupAdminComponent', () => {
  let component: ExpansionMemberGroupAdminComponent;
  let fixture: ComponentFixture<ExpansionMemberGroupAdminComponent>;
  let stationService: StationService;

  const subStationGroup: StationGroupData = {
    rithmId: '1375027-78345-73824-542442',
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ExpansionMemberGroupAdminComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [MatExpansionModule, NoopAnimationsModule],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: StationService, useClass: MockStationService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionMemberGroupAdminComponent);
    component = fixture.componentInstance;
    stationService = TestBed.inject(StationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Selected item is group', () => {
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

    beforeEach(() => {
      component.selectedItem = subStationGroups;
      fixture.detectChanges();
    });

    it('should  return true if isGroup', () => {
      const result = component.isGroup;
      expect(result).toBeTrue();
    });

    it('should call service that return station members for groups how admin', () => {
      const spyService = spyOn(
        stationService,
        'getStationOwnerRoster'
      ).and.callThrough();
      component.isAdmin = true;
      component.stationSelected = subStationGroups;
      fixture.detectChanges();
      component.getStationsMembers();
      expect(spyService).toHaveBeenCalledOnceWith(subStationGroups.rithmId);
    });

    it('should call service that return station members for groups how user', () => {
      const spyService = spyOn(
        stationService,
        'getStationWorkerRoster'
      ).and.callThrough();
      component.isAdmin = false;
      component.stationSelected = subStationGroups;
      fixture.detectChanges();
      component.getStationsMembers();
      expect(spyService).toHaveBeenCalledOnceWith(subStationGroups.rithmId);
    });
  });

  describe('Selected item is station', () => {
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

    beforeEach(() => {
      component.selectedItem = stations;
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
      component.stationSelected = stations;
      fixture.detectChanges();
      component.getStationsMembers();
      expect(spyService).toHaveBeenCalledOnceWith(stations.rithmId);
    });

    it('should call service that return station members for stations how user', () => {
      const spyService = spyOn(
        stationService,
        'getStationWorkerRoster'
      ).and.callThrough();
      component.isAdmin = false;
      component.stationSelected = stations;
      fixture.detectChanges();
      component.getStationsMembers();
      expect(spyService).toHaveBeenCalledOnceWith(stations.rithmId);
    });
  });

  it('should show error message when request getStationsMembers fail', () => {
    const spyError = spyOn(
      stationService,
      'getStationWorkerRoster'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.stationSelected = subStationGroup;
    component.getStationsMembers();
    fixture.detectChanges();
    const showMessage =
      fixture.debugElement.nativeElement.querySelector('#failed-get-users');
    expect(spyError).toHaveBeenCalled();
    expect(showMessage).toBeTruthy();
    expect(component.isErrorGetUsers).toBeTrue();
  });

  it('should show loading while request getStationsMembers', () => {
    const spyMethod = spyOn(
      stationService,
      'getStationWorkerRoster'
    ).and.callThrough();
    component.stationSelected = subStationGroup;
    component.getStationsMembers();
    fixture.detectChanges();
    const loader = fixture.debugElement.nativeElement.querySelector(
      '#loading-get-members'
    );
    expect(spyMethod).toHaveBeenCalled();
    expect(loader).toBeTruthy();
    expect(component.isLoading).toBeTrue();
  });
});
