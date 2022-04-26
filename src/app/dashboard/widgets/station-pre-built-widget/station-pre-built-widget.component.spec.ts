import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { MockErrorService, MockStationService } from 'src/mocks';
import { RosterModule } from 'src/app/shared/roster/roster.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { StationPreBuiltWidgetComponent } from './station-pre-built-widget.component';
import { throwError } from 'rxjs';
import { LoadingWidgetComponent } from 'src/app/dashboard/widgets/loading-widget/loading-widget.component';
import { ErrorWidgetComponent } from 'src/app/dashboard/widgets/error-widget/error-widget.component';
import { MockComponent } from 'ng-mocks';
import { StationDocumentsModalComponent } from 'src/app/shared/station-documents-modal/station-documents-modal.component';

describe('StationPreBuiltWidgetComponent', () => {
  let component: StationPreBuiltWidgetComponent;
  let fixture: ComponentFixture<StationPreBuiltWidgetComponent>;
  let stationService: StationService;
  let errorService: ErrorService;
  let matDialog: MatDialog;

  const stationWidgetData = [
    {
      stationRithmId: 'qwe-321-ert-123',
      stationName: 'Mars station',
      totalContainers: 5,
      stationGroup: 'Eagle',
      stationOwners: [
        {
          rithmId: '',
          firstName: 'Marry',
          lastName: 'Poppins',
          email: 'marrypoppins@inpivota.com',
          isOwner: false,
          isWorker: true,
        },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationPreBuiltWidgetComponent,
        MockComponent(LoadingWidgetComponent),
        MockComponent(ErrorWidgetComponent),
        MockComponent(StationDocumentsModalComponent),
      ],
      imports: [RosterModule, MatDialogModule, MatSortModule],
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
    errorService = TestBed.inject(ErrorService);
    matDialog = TestBed.inject(MatDialog);
    component.stationWidgetData = stationWidgetData;
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
      '#app-loading-indicator-station-pre-built'
    );
    expect(loadingIndicator).toBeTruthy();
  });

  it('should show error message when request station prebuilt data', () => {
    const spyError = spyOn(
      stationService,
      'getStationWidgetPreBuiltData'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyService = spyOn(errorService, 'logError').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    const errorElement = fixture.debugElement.nativeElement.querySelector(
      '#error-load-widget-station-pre-built'
    );
    expect(errorElement).toBeTruthy();
    expect(component.errorStationPrebuilt).toBeTrue();
    expect(spyService).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  it('should show message error and try again', () => {
    const spyMethod = spyOn(
      component,
      'getStationWidgetPreBuiltData'
    ).and.callThrough();

    const spyError = spyOn(
      stationService,
      'getStationWidgetPreBuiltData'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.ngOnInit();
    fixture.detectChanges();
    const errorComponent = fixture.nativeElement.querySelector(
      '#error-load-widget-station-pre-built'
    );
    expect(errorComponent).toBeTruthy();
    expect(spyError).toHaveBeenCalled();
    expect(spyMethod).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  it('should executed modal for render documents the specific station', () => {
    const expectData = {
      minWidth: '370px',
      data: {
        stationName: stationWidgetData[0].stationName,
        stationId: stationWidgetData[0].stationRithmId,
      },
    };
    const spyModal = spyOn(matDialog, 'open');
    component.openDocsModal(stationWidgetData[0]);
    expect(spyModal).toHaveBeenCalledOnceWith(
      StationDocumentsModalComponent,
      expectData
    );
  });

  it('should not show modal when edit mode is active', () => {
    component.editMode = true;
    const expectData = {
      minWidth: '370px',
      data: {
        stationName: stationWidgetData[0].stationName,
        stationId: stationWidgetData[0].stationRithmId,
      },
    };
    const spyModal = spyOn(matDialog, 'open');
    component.openDocsModal(stationWidgetData[0]);
    expect(spyModal).not.toHaveBeenCalledOnceWith(
      StationDocumentsModalComponent,
      expectData
    );
  });
});
