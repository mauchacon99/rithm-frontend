import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockErrorService, MockStationService } from 'src/mocks';

import { GroupListHierarchyComponent } from './group-list-hierarchy.component';

describe('GroupListHierarchyComponent', () => {
  let component: GroupListHierarchyComponent;
  let fixture: ComponentFixture<GroupListHierarchyComponent>;
  let stationService: StationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GroupListHierarchyComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: StationService, useClass: MockStationService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupListHierarchyComponent);
    component = fixture.componentInstance;
    stationService = TestBed.inject(StationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service that return station groups data', () => {
    const spyService = spyOn(
      stationService,
      'getStationGroups'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith('');
  });

  it('should show error message when request station widget document  data', () => {
    spyOn(stationService, 'getStationGroups').and.returnValue(
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

  it('should show error message when request getStationGroups fail', () => {
    const spyError = spyOn(
      TestBed.inject(StationService),
      'getStationGroups'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component['getStationGroups']();
    fixture.detectChanges();
    const showMessage =
      fixture.debugElement.nativeElement.querySelector('#failed-groups');
    expect(spyError).toHaveBeenCalled();
    expect(showMessage).toBeTruthy();
  });

  it('should show loading while request getStationGroups', () => {
    const spyMethod = spyOn(
      TestBed.inject(StationService),
      'getStationGroups'
    ).and.callThrough();
    component['getStationGroups']();
    fixture.detectChanges();
    const loader = fixture.debugElement.nativeElement.querySelector(
      '#loader-groups-hierarchy'
    );
    expect(spyMethod).toHaveBeenCalled();
    expect(loader).toBeTruthy();
  });
});
