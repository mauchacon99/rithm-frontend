import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { StationWidgetTemplateModalComponent } from 'src/app/dashboard/widget-modal/station-widget-template-modal/station-widget-template-modal.component';
import { SelectedItemWidgetModel, WidgetType } from 'src/models';

import { ListWidgetModalComponent } from './list-widget-modal.component';
import { DocumentWidgetTemplateModalComponent } from 'src/app/dashboard/widget-modal/document-widget-template-modal/document-widget-template-modal.component';
import { GroupWidgetTemplateModalComponent } from 'src/app/dashboard/widget-modal/group-widget-template-modal/group-widget-template-modal.component';
import { ComingSoonMessageModule } from 'src/app/shared/coming-soon-message/coming-soon-message.module';

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
      ],
      imports: [ComingSoonMessageModule],
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

  it('should show group widget when permission is true', () => {
    component.showGroupTemplate = true;
    component.ShowGroupTrafficTemplate = true;
    component.itemWidgetModalSelected.itemType = 'group';
    fixture.detectChanges();
    const sectionPermissionDenied =
      fixture.debugElement.nativeElement.querySelector('#comingSoonSection');
    expect(sectionPermissionDenied).toBeNull();
  });

  it('should not show group widget when permission is false', () => {
    component.showGroupTemplate = false;
    component.itemWidgetModalSelected.itemType = 'group';
    fixture.detectChanges();
    const sectionPermissionDenied =
      fixture.debugElement.nativeElement.querySelector('#comingSoonSection');
    expect(sectionPermissionDenied).toBeTruthy();
  });

  it('should show profile banner widget when permission is true', () => {
    component.showContainerProfileBanner = true;
    component.itemWidgetModalSelected.itemType = 'document';
    fixture.detectChanges();
    const sectionPermissionDenied =
      fixture.debugElement.nativeElement.querySelector('#comingSoonSection');
    expect(sectionPermissionDenied).toBeNull();
  });

  it('should not show profile banner widget when permission is false', () => {
    component.showContainerProfileBanner = false;
    component.itemWidgetModalSelected.itemType = 'document';
    fixture.detectChanges();
    const sectionPermissionDenied =
      fixture.debugElement.nativeElement.querySelector('#comingSoonSection');
    expect(sectionPermissionDenied).toBeTruthy();
  });
});
