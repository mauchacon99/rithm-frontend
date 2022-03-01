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
      declarations: [CustomTabWidgetModalComponent],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
        { provide: ErrorService, useClass: MockErrorService },
      ],
      imports: [MatButtonToggleModule, MatTabsModule, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTabWidgetModalComponent);
    component = fixture.componentInstance;
    component.dashboardRithmId = dashboardRithmId;
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
});
