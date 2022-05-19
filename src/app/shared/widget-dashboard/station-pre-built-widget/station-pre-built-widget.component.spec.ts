import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StationService } from 'src/app/core/station.service';
import { MockStationService } from 'src/mocks';
import { RosterModule } from 'src/app/shared/roster/roster.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { StationPreBuiltWidgetComponent } from './station-pre-built-widget.component';
import { throwError } from 'rxjs';
import { MockComponent } from 'ng-mocks';
import { StationDocumentsModalComponent } from 'src/app/shared/station-documents-modal/station-documents-modal.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingWidgetComponent } from 'src/app/shared/widget-dashboard/loading-widget/loading-widget.component';
import { ErrorWidgetComponent } from 'src/app/shared/widget-dashboard/error-widget/error-widget.component';

describe('StationPreBuiltWidgetComponent', () => {
  let component: StationPreBuiltWidgetComponent;
  let fixture: ComponentFixture<StationPreBuiltWidgetComponent>;
  let stationService: StationService;
  let matDialog: MatDialog;
  let sidenavDrawerService: SidenavDrawerService;

  const stationWidgetData = [
    {
      rithmId: 'qwe-321-ert-123',
      name: 'Mars station',
      totalContainers: 5,
      groupName: 'Eagle',
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
        { provide: StationService, useClass: MockStationService },
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationPreBuiltWidgetComponent);
    component = fixture.componentInstance;
    stationService = TestBed.inject(StationService);
    matDialog = TestBed.inject(MatDialog);
    sidenavDrawerService = TestBed.inject(SidenavDrawerService);
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
    component.ngOnInit();
    fixture.detectChanges();
    const errorElement = fixture.debugElement.nativeElement.querySelector(
      '#error-load-widget-station-pre-built'
    );
    expect(errorElement).toBeTruthy();
    expect(component.errorStationPrebuilt).toBeTrue();
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
      minWidth: '300px',
      data: {
        stationName: stationWidgetData[0].name,
        stationId: stationWidgetData[0].rithmId,
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
        stationName: stationWidgetData[0].name,
        stationId: stationWidgetData[0].rithmId,
      },
    };
    const spyModal = spyOn(matDialog, 'open');
    component.openDocsModal(stationWidgetData[0]);
    expect(spyModal).not.toHaveBeenCalledOnceWith(
      StationDocumentsModalComponent,
      expectData
    );
  });

  it('should call and emit toggleDrawer', () => {
    component.isLoading = false;
    component.errorStationPrebuilt = false;
    component.editMode = true;
    component.showButtonSetting = true;
    spyOn(component.toggleDrawer, 'emit');
    spyOn(component, 'toggleEditStation').and.callThrough();
    component.toggleEditStation();
    expect(component.toggleEditStation).toHaveBeenCalled();
    expect(component.toggleDrawer.emit).toHaveBeenCalled();
  });

  it('should call drawer context and compare this context', () => {
    const drawerContext = 'widgetDashboard';
    const spySidenavDrawer = spyOn(
      sidenavDrawerService.drawerContext$,
      'next'
    ).and.callThrough();
    sidenavDrawerService.drawerContext$.next(drawerContext);
    component.ngOnInit();
    expect(component.drawerContext).toBe(drawerContext);
    expect(spySidenavDrawer).toHaveBeenCalled();
  });

  it('should obtain value in isDrawerOpen in sidenavDrawerService', () => {
    const spyMethod = spyOnProperty(
      sidenavDrawerService,
      'isDrawerOpen'
    ).and.returnValue(true);
    component.isDrawerOpen;
    expect(spyMethod).toHaveBeenCalled();
    expect(component.isDrawerOpen).toBeTrue();
  });

  it("should catch error when user don't have permissions", () => {
    spyOn(stationService, 'getStationWidgetPreBuiltData').and.returnValue(
      throwError(() => {
        throw new HttpErrorResponse({ error: 'any error', status: 403 });
      })
    );

    component.getStationWidgetPreBuiltData();

    expect(component.permissionError).toBeFalse();
  });

  it('should catch error when the widget has been deleted', () => {
    spyOn(stationService, 'getStationWidgetPreBuiltData').and.returnValue(
      throwError(() => {
        throw new HttpErrorResponse({ error: 'any error', status: 400 });
      })
    );

    component.getStationWidgetPreBuiltData();
    expect(component.widgetDeleted).toBeTrue();
  });

  it('should call removeWidget', () => {
    const spyDeteleWidget = spyOn(
      component.deleteWidget,
      'emit'
    ).and.callThrough();
    const spyDrawer = spyOn(component.toggleDrawer, 'emit').and.callThrough();
    component.removeWidget();
    expect(spyDeteleWidget).toHaveBeenCalled();
    expect(spyDrawer).toHaveBeenCalledOnceWith(0);
  });
});
