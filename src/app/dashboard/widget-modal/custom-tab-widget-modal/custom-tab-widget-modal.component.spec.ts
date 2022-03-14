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
import { SelectedItemWidgetModel } from 'src/models';
import { FormsModule } from '@angular/forms';

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
        FormsModule,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spyService = spyOn<any>(
      component,
      'getSearchResultTab'
    ).and.callThrough();
    const btnTab = fixture.nativeElement.querySelector('#tab-button-station');
    expect(btnTab).toBeTruthy();
    btnTab.click();
    expect(spyTabs).toHaveBeenCalledOnceWith(indexTab);
    expect(spyService).toHaveBeenCalled();
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
    component.indexTab = 1;
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getStationTabList'
    ).and.callThrough();
    component['getSearchResultTab']();
    expect(spyService).toHaveBeenCalled();
  });

  it('should get list tab stations error ', () => {
    component.indexTab = 1;
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
    component['getSearchResultTab']();
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

  it('should catch error for list tab groups the stations', () => {
    component.indexTab = 2;
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
    component['getSearchResultTab']();
    expect(spyError).toHaveBeenCalled();
  });

  it('should catch error group list tabs and show message ', async () => {
    component.indexTab = 3; // group tab
    component.errorLoadingGroupTab = true;
    await fixture.detectChanges();
    const errorLoadingStationTab = fixture.nativeElement.querySelector(
      '#error-group-list-tab'
    );
    expect(errorLoadingStationTab).toBeTruthy();
  });
  it('should display loading indicator in group list tab', async () => {
    component.indexTab = 2; // group tab
    component.isLoadingGroupTab = true;
    await fixture.detectChanges();
    const LoadingGrouTab =
      fixture.nativeElement.querySelector('#loading-tab-group');
    expect(LoadingGrouTab).toBeTruthy();
  });

  it('should test emit value', () => {
    const expectedValue: SelectedItemWidgetModel = {
      itemType: 'station',
      itemList: {
        rithmId: 'string',
        name: 'string',
        totalDocuments: 0,
        groupName: 'string',
        isChained: false,
        totalStations: 0,
        totalSubGroups: 0,
        stationName: 'string',
        stationGroupName: 'string',
      },
    };
    const emitCall = spyOn(component.itemSelected, 'emit');
    component.selectTypeElement(expectedValue);
    expect(emitCall).toHaveBeenCalled();
  });

  it('should call service to get document tab list', () => {
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getDocumentTabList'
    ).and.callThrough();

    const testPromise = new Promise(() => {
      component.getSearchResult();
    });
    testPromise.then(() => {
      expect(spyService).toHaveBeenCalled();
    });
  });

  it('should call service to get group stations tab list', () => {
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getGroupStationTabList'
    ).and.callThrough();

    const testPromise = new Promise(() => {
      component.getSearchResult();
    });
    testPromise.then(() => {
      expect(spyService).toHaveBeenCalled();
    });
  });
  it('should call service to get stations tab list', () => {
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getStationTabList'
    ).and.callThrough();

    const testPromise = new Promise(() => {
      component.getSearchResult();
    });
    testPromise.then(() => {
      expect(spyService).toHaveBeenCalled();
    });
  });

  it('should call method depending active tab', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spyService = spyOn<any>(
      component,
      'getSearchResultTab'
    ).and.callThrough();

    const testPromise = new Promise(() => {
      component.getSearchResult();
    });
    testPromise.then(() => {
      expect(spyService).toHaveBeenCalled();
    });
  });

  it('should call method depending documents active tab', () => {
    component.indexTab = 0;
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getDocumentTabList'
    ).and.callThrough();
    component['getSearchResultTab']();
    expect(spyService).toHaveBeenCalled();
  });

  it('should call method depending stations active tab', () => {
    component.indexTab = 1;
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getStationTabList'
    ).and.callThrough();
    component['getSearchResultTab']();
    expect(spyService).toHaveBeenCalled();
  });

  it('should call method depending groups active tab', () => {
    component.indexTab = 2;
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'getGroupStationTabList'
    ).and.callThrough();
    component['getSearchResultTab']();
    expect(spyService).toHaveBeenCalled();
  });

  it('should call method depending groups active tab case default', () => {
    component.indexTab = 4;
    const spyServiceGroup = spyOn(
      TestBed.inject(DashboardService),
      'getGroupStationTabList'
    ).and.callThrough();
    const spyServiceStation = spyOn(
      TestBed.inject(DashboardService),
      'getStationTabList'
    ).and.callThrough();
    const spyServiceDocument = spyOn(
      TestBed.inject(DashboardService),
      'getDocumentTabList'
    ).and.callThrough();
    component['getSearchResultTab']();
    expect(spyServiceDocument).toHaveBeenCalled();
    expect(spyServiceGroup).toHaveBeenCalled();
    expect(spyServiceStation).toHaveBeenCalled();
  });
});
