import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { CustomTabWidgetModalComponent } from './custom-tab-widget-modal.component';
import { MockDashboardService, MockErrorService } from 'src/mocks';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorService } from 'src/app/core/error.service';
import { throwError } from 'rxjs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng-mocks';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { ItemListWidgetModalComponent } from '../item-list-widget-modal/item-list-widget-modal.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

describe('CustomTabWidgetModalComponent', () => {
  let component: CustomTabWidgetModalComponent;
  let fixture: ComponentFixture<CustomTabWidgetModalComponent>;
  const dashboardRithmId = 'E204F369-386F-4E41-B3CA-2459E674DF52';
  const DIALOG_TEST_DATA: {
    /** The dashboard rithmId. */ dashboardRithmId: string;
  } = {
    dashboardRithmId: '73d47261-1932-4fcf-82bd-159eb1a7243f',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CustomTabWidgetModalComponent,
        MockComponent(LoadingIndicatorComponent),
        ItemListWidgetModalComponent,
      ],
      imports: [
        MatButtonToggleModule,
        MatTabsModule,
        NoopAnimationsModule,
        MatTableModule,
        MatInputModule,
      ],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
        { provide: ErrorService, useClass: MockErrorService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTabWidgetModalComponent);
    component = fixture.componentInstance;
    component.dashboardRithmId = dashboardRithmId;
    component.indexTab = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get list tab documents', () => {
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getDocumentTabList'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalled();
  });

  it('should get list tab documents error ', () => {
    spyOn(
      TestBed.inject(DashboardService),
      'getDocumentTabList'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
  });

  it('should selected index tabs', () => {
    const indexTab = 1;
    const spyTabs = spyOn(component, 'selectedTab').and.callThrough();
    const btnTab = fixture.nativeElement.querySelector('#tab-button-station');
    expect(btnTab).toBeTruthy();
    btnTab.click();
    expect(spyTabs).toHaveBeenCalledOnceWith(indexTab);
    expect(component.indexTab).toBe(indexTab);
  });

  it('should rendered component loading for document tabs', () => {
    component.isLoadingDocumentTab = true;
    fixture.detectChanges();
    expect(component.isLoadingDocumentTab).toBeTrue();
    const loadingIndicator = fixture.debugElement.nativeElement.querySelector(
      '#loading-tab-document-list'
    );

    expect(loadingIndicator).toBeTruthy();
  });
  it('should get list tab stations', () => {
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getStationTabList'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalled();
  });

  it('should get list tab stations error ', () => {
    spyOn(
      TestBed.inject(DashboardService),
      'getStationTabList'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
    expect(component.errorLoadingStationTab).toBeTrue();
  });

  it('should display error in station list tab', async () => {
    component.indexTab = 1; // station tab
    component.errorLoadingStationTab = true;
    await fixture.detectChanges();
    const errorLoadingStationTab = fixture.nativeElement.querySelector(
      '#error-station-list-tab'
    );
    expect(errorLoadingStationTab).toBeTruthy();
  });

  it('should display loading indicator in station list tab', async () => {
    component.indexTab = 1; // station tab
    component.isLoadingStationTab = true;
    await fixture.detectChanges();
    const LoadingStationTab = fixture.nativeElement.querySelector(
      '#loading-station-list-tab'
    );
    expect(LoadingStationTab).toBeTruthy();
  });

  it('should catch an error if the request to get document tab list fails', () => {
    spyOn(
      TestBed.inject(DashboardService),
      'getDocumentTabList'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.ngOnInit();
    fixture.detectChanges();
    const errorMessage = fixture.debugElement.nativeElement.querySelector(
      '#error-documents-list-tab'
    );
    expect(errorMessage).toBeTruthy();
    expect(component.errorLoadingDocumentTab).toBeTrue();
  });

  it('should get list data for groups the stations', () => {
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getGroupStationTabList'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalled();
  });

  it('should catch error for list tab groups the stations', () => {
    spyOn(
      TestBed.inject(DashboardService),
      'getGroupStationTabList'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
  });
});
