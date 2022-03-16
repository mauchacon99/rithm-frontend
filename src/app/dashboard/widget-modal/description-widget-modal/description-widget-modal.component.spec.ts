import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionWidgetModalComponent } from './description-widget-modal.component';
import { SelectedItemWidgetModel } from 'src/models';
import { MockDashboardService } from 'src/mocks';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

describe('DescriptionWidgetModalComponent', () => {
  let component: DescriptionWidgetModalComponent;
  let fixture: ComponentFixture<DescriptionWidgetModalComponent>;

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

  const widgetType = 'defaultDocument';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DescriptionWidgetModalComponent],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionWidgetModalComponent);
    component = fixture.componentInstance;
    component.itemWidgetModalSelected = itemWidgetModalSelected;
    component.widgetType = widgetType;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
