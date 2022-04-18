import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService } from 'src/mocks';

import { StationPreBuiltWidgetComponent } from './station-pre-built-widget.component';
import { throwError } from 'rxjs';

describe('StationPreBuiltWidgetComponent', () => {
  let component: StationPreBuiltWidgetComponent;
  let fixture: ComponentFixture<StationPreBuiltWidgetComponent>;
  let stationService: StationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationPreBuiltWidgetComponent],
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
    const spyMethod = spyOn(
      component,
      'getStationWidgetPreBuiltData'
    ).and.callThrough();
    const spyGetUserStationData = spyOn(
      stationService,
      'getStationWidgetPreBuiltData'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyMethod).toHaveBeenCalled();
    expect(spyGetUserStationData).toHaveBeenCalled();
  });

  it('should catch an error if the request getStationWidgetPreBuiltData fails', () => {
    const spyError = spyOn(
      stationService,
      'getStationWidgetPreBuiltData'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
  });
});
