import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { throwError } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { MockDocumentService, MockErrorService } from 'src/mocks';
import { DocumentGenerationStatus } from 'src/models';
import { StationWidgetComponent } from './station-widget.component';

describe('StationWidgetComponent', () => {
  let component: StationWidgetComponent;
  let fixture: ComponentFixture<StationWidgetComponent>;
  const stationRithmId =
    '{"stationRithmId":"247cf568-27a4-4968-9338-046ccfee24f3"}';
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationWidgetComponent],
      imports: [MatCardModule],
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
    component.dataStationWidget = {
      stationName: 'Station Name',
      documentGeneratorStatus: DocumentGenerationStatus.Manual,
      documents: [
        {
          rithmId: '123-123-',
          name: 'Document Name',
          priority: 0,
          lastUpdatedUTC: '2022-01-17T15:03:26.371Z',
          flowedTimeUTC: '2022-01-17T15:03:26.371Z',
          assignedUser: {
            rithmId: 'string',
            firstName: 'string',
            lastName: 'string',
            email: 'string',
            isAssigned: true,
          },
        },
      ],
    };
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
});
