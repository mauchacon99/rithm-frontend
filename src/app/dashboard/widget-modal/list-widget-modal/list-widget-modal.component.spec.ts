import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { StationWidgetTemplateModalComponent } from 'src/app/dashboard/widget-modal/station-widget-template-modal/station-widget-template-modal.component';
import { SelectedItemWidgetModel, WidgetType } from 'src/models';

import { ListWidgetModalComponent } from './list-widget-modal.component';
import { DocumentWidgetTemplateModalComponent } from 'src/app/dashboard/widget-modal/document-widget-template-modal/document-widget-template-modal.component';
import { GroupWidgetTemplateModalComponent } from '../group-widget-template-modal/group-widget-template-modal.component';
import { ComingSoonMessageComponent } from 'src/app/shared/coming-soon-message/coming-soon-message.component';
import { UserService } from 'src/app/core/user.service';
import { MockErrorService, MockSplitService, MockUserService } from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
import { SplitService } from 'src/app/core/split.service';

describe('ListWidgetModalComponent', () => {
  let component: ListWidgetModalComponent;
  let fixture: ComponentFixture<ListWidgetModalComponent>;

  const itemWidgetModalSelected: SelectedItemWidgetModel = {
    itemType: 'document',
    itemList: {
      rithmId: '6687-65451-65654-65465',
      name: 'Document Name',
      totalDocuments: 1,
      groupName: 'Group Document Test',
      isChained: true,
      totalStations: 0,
      totalSubGroups: 0,
      stationName: 'Station Test',
      stationGroupName: 'Group Station Test',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ListWidgetModalComponent,
        MockComponent(StationWidgetTemplateModalComponent),
        MockComponent(DocumentWidgetTemplateModalComponent),
        MockComponent(GroupWidgetTemplateModalComponent),
        MockComponent(ComingSoonMessageComponent),
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: SplitService, useClass: MockSplitService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWidgetModalComponent);
    component = fixture.componentInstance;
    component.itemWidgetModalSelected = itemWidgetModalSelected;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit previewWidgetSelected', () => {
    const spyEmit = spyOn(
      component.previewWidgetSelected,
      'emit'
    ).and.callThrough();
    component.emitPreviewWidgetSelected(WidgetType.Station);
    expect(spyEmit).toHaveBeenCalledOnceWith(WidgetType.Station);
  });

  describe('Testing split.io', () => {
    let splitService: SplitService;
    let userService: UserService;

    beforeEach(() => {
      splitService = TestBed.inject(SplitService);
      userService = TestBed.inject(UserService);
    });

    it('should call split service and treatments', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      const spyGetConfigWidgetsTreatment = spyOn(
        splitService,
        'getProfileBannerTreatment'
      ).and.callThrough();

      splitService.sdkReady$.next();
      component.ngOnInit();

      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(spyGetConfigWidgetsTreatment).toHaveBeenCalled();
      expect(component.isContainerProfileBanner).toBeTrue();
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
      expect(component.isContainerProfileBanner).toBeFalse();
    });
  });
});
