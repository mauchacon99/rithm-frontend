import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { StationWidgetTemplateModalComponent } from 'src/app/dashboard/widget-modal/station-widget-template-modal/station-widget-template-modal.component';
import { SelectedItemWidgetModel, WidgetType } from 'src/models';

import { ListWidgetModalComponent } from './list-widget-modal.component';
import { DocumentWidgetTemplateModalComponent } from 'src/app/dashboard/widget-modal/document-widget-template-modal/document-widget-template-modal.component';

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
    component.emitPreviewWidgetSelected('List');
    expect(spyEmit).toHaveBeenCalledOnceWith('List');
  });
});
