import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { AddWidgetModalComponent } from './add-widget-modal.component';
import { MockComponent } from 'ng-mocks';
import { CustomTabWidgetModalComponent } from 'src/app/dashboard/widget-modal/custom-tab-widget-modal/custom-tab-widget-modal.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SelectedItemWidgetModel } from 'src/models';
import { ListWidgetModalComponent } from 'src/app/dashboard/widget-modal/list-widget-modal/list-widget-modal.component';
import { DescriptionWidgetModalComponent } from 'src/app/dashboard/widget-modal/description-widget-modal/description-widget-modal.component';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import {
  MockDashboardService,
  MockErrorService,
  MockSplitService,
  MockUserService,
} from 'src/mocks';
import { UserService } from 'src/app/core/user.service';
import { ErrorService } from 'src/app/core/error.service';
import { SplitService } from 'src/app/core/split.service';
import { ComingSoonMessageComponent } from 'src/app/shared/coming-soon-message/coming-soon-message.component';

describe('AddWidgetModalComponent', () => {
  let component: AddWidgetModalComponent;
  let fixture: ComponentFixture<AddWidgetModalComponent>;
  const DIALOG_TEST_DATA: {
    /** The dashboard rithmId. */ dashboardRithmId: string;
  } = {
    dashboardRithmId: '73d47261-1932-4fcf-82bd-159eb1a7243f',
  };

  const itemWidgetModalSelected: SelectedItemWidgetModel = {
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: { close } },
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
        { provide: UserService, useClass: MockUserService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: SplitService, useClass: MockSplitService },
      ],
      imports: [MatTabsModule, NoopAnimationsModule, MatDialogModule],
      declarations: [
        AddWidgetModalComponent,
        MockComponent(CustomTabWidgetModalComponent),
        MockComponent(ListWidgetModalComponent),
        MockComponent(DescriptionWidgetModalComponent),
        MockComponent(ComingSoonMessageComponent),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWidgetModalComponent);
    component = fixture.componentInstance;
    component.tabParentSelect = 0;
    component.itemWidgetModalSelected = itemWidgetModalSelected;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call close the modal in dialogRef service', () => {
    const spyMatDialogRef = spyOn(TestBed.inject(MatDialogRef), 'close');
    const spyMethod = spyOn(component, 'closeModal').and.callThrough();
    const btnClose = fixture.nativeElement.querySelector(
      '#close-widget-builder'
    );
    expect(btnClose).toBeTruthy();
    btnClose.click();
    expect(spyMethod).toHaveBeenCalled();
    expect(spyMatDialogRef).toHaveBeenCalled();
  });

  it('should test emit value', () => {
    const expectedValue: SelectedItemWidgetModel = itemWidgetModalSelected;
    component.selectTypeElement(expectedValue);
    expect(component.identifyShowElement).toBe(expectedValue.itemType);
    expect(component.itemWidgetModalSelected).toBe(expectedValue);
  });

  it('should show and return button to custom lists', () => {
    const spyMethod = spyOn(component, 'returnCustomLists').and.callThrough();
    component.identifyShowElement = 'document';
    fixture.detectChanges();
    const btnReturnCustom = fixture.nativeElement.querySelector(
      '#return-custom-lists'
    );
    expect(btnReturnCustom).toBeTruthy();
    btnReturnCustom.click();
    expect(spyMethod).toHaveBeenCalled();
    expect(component.identifyShowElement).toEqual('tabs');
  });

  it('should not show return button to custom lists', () => {
    component.identifyShowElement = 'tabs';
    fixture.detectChanges();
    const btnReturnCustom = fixture.nativeElement.querySelector(
      '#return-custom-lists'
    );
    expect(btnReturnCustom).toBeNull();
  });

  it('should return to app-list-widget-modal', () => {
    component.identifyShowElement = 'document';
    component.previewWidgetTypeSelected = 'defaultDocument';
    fixture.detectChanges();
    const btnReturnCustom = fixture.nativeElement.querySelector(
      '#return-custom-lists'
    );
    expect(btnReturnCustom).toBeTruthy();
    btnReturnCustom.click();
    expect(component.previewWidgetTypeSelected).toBeNull();
    expect(component.identifyShowElement).toEqual('document');
  });

  describe('Testing split.io', () => {
    let splitService: SplitService;
    let userService: UserService;
    beforeEach(() => {
      splitService = TestBed.inject(SplitService);
      userService = TestBed.inject(UserService);
    });

    it('should get split for group widget.', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      const method = spyOn(
        splitService,
        'getGroupSectionAddWidgetTreatment'
      ).and.callThrough();
      splitService.sdkReady$.next();
      component.ngOnInit();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(method).toHaveBeenCalled();
      expect(component.showGroupTemplate).toBeDefined();
    });

    it('should show group widget when permission exits.', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      const method = spyOn(
        splitService,
        'getGroupSectionAddWidgetTreatment'
      ).and.returnValue('on');
      splitService.sdkReady$.next();
      component.ngOnInit();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(method).toHaveBeenCalled();
      expect(component.showGroupTemplate).toBeTrue();
    });

    it('should not show group widget when permission does not exits.', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      const method = spyOn(
        splitService,
        'getGroupSectionAddWidgetTreatment'
      ).and.returnValue('off');

      splitService.sdkReady$.next();
      component.ngOnInit();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(method).toHaveBeenCalled();
      expect(component.showGroupTemplate).toBeFalse();
    });

    it('should catch split error ', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      splitService.sdkReady$.error('error');
      const errorService = spyOn(
        TestBed.inject(ErrorService),
        'logError'
      ).and.callThrough();
      component.ngOnInit();

      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(errorService).toHaveBeenCalled();
      expect(component.showGroupTemplate).toBeFalse();
    });
  });
});
