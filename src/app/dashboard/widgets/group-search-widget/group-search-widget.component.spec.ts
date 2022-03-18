import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';

import { GroupSearchWidgetComponent } from './group-search-widget.component';
import { StationService } from 'src/app/core/station.service';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService, MockStationService } from 'src/mocks';
import { LoadingWidgetComponent } from '../loading-widget/loading-widget.component';
import { MockComponent } from 'ng-mocks';
import { ErrorWidgetComponent } from '../error-widget/error-widget.component';

describe('GroupSearchWidgetComponent', () => {
  let component: GroupSearchWidgetComponent;
  let fixture: ComponentFixture<GroupSearchWidgetComponent>;
  const dataWidget =
    // eslint-disable-next-line max-len
    '{"stationGroupRithmId":"4fb462ec-0772-49dc-8cfb-3849d70ad168"}';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GroupSearchWidgetComponent,
        MockComponent(LoadingWidgetComponent),
        MockComponent(ErrorWidgetComponent),
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSearchWidgetComponent);
    component = fixture.componentInstance;
    component.dataWidget = dataWidget;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service that return station widget data', () => {
    const spyService = spyOn(
      TestBed.inject(StationService),
      'getStationGroupsWidget'
    ).and.callThrough();
    const expectData = JSON.parse(dataWidget).stationGroupRithmId;
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith(expectData);
  });

  it('should show error message when request station widget document  data', () => {
    spyOn(
      TestBed.inject(StationService),
      'getStationGroupsWidget'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyService = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    const errorElement = fixture.debugElement.nativeElement.querySelector(
      '#error-load-widget-station-group'
    );
    expect(errorElement).toBeTruthy();
    expect(spyService).toHaveBeenCalled();
  });

  it('should rendered component loading for widget', () => {
    component.isLoadingStationGroup = true;
    fixture.detectChanges();
    expect(component.isLoadingStationGroup).toBeTrue();
    const loadingIndicator = fixture.debugElement.nativeElement.querySelector(
      '#app-loading-indicator-station-group'
    );
    expect(loadingIndicator).toBeTruthy();
  });
});
