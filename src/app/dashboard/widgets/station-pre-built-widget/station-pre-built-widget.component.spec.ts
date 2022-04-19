import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService } from 'src/mocks';

import { StationPreBuiltWidgetComponent } from './station-pre-built-widget.component';
import { throwError } from 'rxjs';
import { LoadingWidgetComponent } from '../loading-widget/loading-widget.component';
import { ErrorWidgetComponent } from '../error-widget/error-widget.component';
import { MockComponent } from 'ng-mocks';

describe('StationPreBuiltWidgetComponent', () => {
  let component: StationPreBuiltWidgetComponent;
  let fixture: ComponentFixture<StationPreBuiltWidgetComponent>;
  let stationService: StationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationPreBuiltWidgetComponent,
        MockComponent(LoadingWidgetComponent),
        MockComponent(ErrorWidgetComponent),
      ],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: StationService, useClass: MockStationService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationPreBuiltWidgetComponent);
    component = fixture.componentInstance;
    stationService = TestBed.inject(StationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getStationWidgetPreBuiltData', () => {
    const spyGetStationWidgetPreBuiltData = spyOn(
      stationService,
      'getStationWidgetPreBuiltData'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyGetStationWidgetPreBuiltData).toHaveBeenCalled();
  });

  it('should rendered component loading for widget', () => {
    component.isLoading = true;
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();
    const loadingIndicator = fixture.debugElement.nativeElement.querySelector(
      '#app-loading-indicator-station-prebuilt'
    );
    expect(loadingIndicator).toBeTruthy();
  });

  it('should show error message when request station prebuilt data', () => {
    const spyError = spyOn(
      TestBed.inject(StationService),
      'getStationWidgetPreBuiltData'
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
      '#error-load-widget-station-prebuilt'
    );
    expect(errorElement).toBeTruthy();
    expect(component.errorStationPrebuilt).toBeTrue();
    expect(spyService).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });
});
