import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ListWidgetModalComponent } from './list-widget-modal.component';
import { DocumentWidgetTemplateModalComponent } from 'src/app/dashboard/widget-modal/document-widget-template-modal/document-widget-template-modal.component';
import { SelectedItemWidgetModel } from '../../../../models';

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
});
