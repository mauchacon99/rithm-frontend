import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { MockDocumentService, MockErrorService } from 'src/mocks';
import { DocumentGenerationStatus, StationWidgetData } from 'src/models';
import { StationWidgetComponent } from './station-widget.component';

describe('StationWidgetComponent', () => {
  let component: StationWidgetComponent;
  let fixture: ComponentFixture<StationWidgetComponent>;
  const stationRithmId =
    '{"stationRithmId":"247cf568-27a4-4968-9338-046ccfee24f3"}';
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationWidgetComponent],
      providers: [
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: ErrorService, useClass: MockErrorService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationWidgetComponent);
    component = fixture.componentInstance;
    component.stationRithmId = stationRithmId;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service that return station widget data', () => {
    const spyService = spyOn(
      TestBed.inject(DocumentService),
      'getStationWidgetDocuments'
    ).and.callThrough();
    component.stationRithmId = stationRithmId;
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith(component.stationRithmId);
  });

  it('should show error message when request station widget document  data', () => {
    spyOn(
      TestBed.inject(DocumentService),
      'getStationWidgetDocuments'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyService = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.stationRithmId = stationRithmId;
    component.ngOnInit();
    expect(spyService).toHaveBeenCalled();
  });

  it('should show button if station is manual', () => {
    component.stationRithmId = stationRithmId;
    const dataWidgetStation: StationWidgetData = {
      stationName: 'Dev1',
      documentGeneratorStatus: DocumentGenerationStatus.Manual,
      documents: [
        {
          rithmId: '123-123-123',
          name: 'Granola',
          priority: 1,
          flowedTimeUTC: '2022-01-13T16:43:57.901Z',
          lastUpdatedUTC: '2022-01-13T16:43:57.901Z',
          assignedUser: {
            rithmId: '123-123-123',
            firstName: 'Pedro',
            lastName: 'Jeria',
            email: 'pablo@mundo.com',
            isAssigned: true,
          },
        },
      ],
    };

    spyOn(
      TestBed.inject(DocumentService),
      'getStationWidgetDocuments'
    ).and.returnValue(of(dataWidgetStation));

    component.ngOnInit();
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector(
      '#create-new-document'
    );
    expect(button).toBeTruthy();
  });
});
