import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import {
  MockDocumentService,
  MockErrorService,
  MockStationService,
} from 'src/mocks';

import { StationPreBuiltWidgetComponent } from './station-pre-built-widget.component';
import { throwError } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';

describe('StationPreBuiltWidgetComponent', () => {
  let component: StationPreBuiltWidgetComponent;
  let fixture: ComponentFixture<StationPreBuiltWidgetComponent>;
  let stationService: StationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationPreBuiltWidgetComponent],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DocumentService, useClass: MockDocumentService },
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

  it('should call getContainerWidgetPreBuilt', () => {
    const spyGetContainerWidgetPreBuilt = spyOn(
      TestBed.inject(DocumentService),
      'getContainerWidgetPreBuilt'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyGetContainerWidgetPreBuilt).toHaveBeenCalled();
  });

  it('should catch an error if the request getContainerWidgetPreBuilt fails', () => {
    const spyError = spyOn(
      TestBed.inject(DocumentService),
      'getContainerWidgetPreBuilt'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
  });
});
