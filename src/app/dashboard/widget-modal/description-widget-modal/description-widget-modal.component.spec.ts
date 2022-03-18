import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionWidgetModalComponent } from './description-widget-modal.component';
import { SelectedItemWidgetModel, WidgetType } from 'src/models';
import { MockDashboardService } from 'src/mocks';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { MockComponent } from 'ng-mocks';
import { GroupSearchWidgetComponent } from 'src/app/dashboard/widgets/group-search-widget/group-search-widget.component';
import { DocumentWidgetComponent } from 'src/app/dashboard/widgets/document-widget/document-widget.component';

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
      declarations: [
        DescriptionWidgetModalComponent,
        MockComponent(DocumentWidgetComponent),
        MockComponent(GroupSearchWidgetComponent),
      ],
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

  it('should set data template', () => {
    const expectedDataTemplate =
      TestBed.inject(DashboardService).dataTemplatePreviewWidgetModal;
    expect(component.dataTemplate).toEqual(expectedDataTemplate);
    expect(component.dataTemplate[component.widgetType]).toEqual(
      expectedDataTemplate[widgetType]
    );
  });

  it('should validate that widgetType not be defaultDocument', () => {
    component.widgetType = 'defaultDocument';
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.widgetTypeWithoutDefault).toBe(WidgetType.Document);
  });

  it('should generate dataWidget stringify', () => {
    const dataWidgetExpected = {
      documentRithmId: itemWidgetModalSelected.itemList.rithmId,
      columns: [],
    };
    component.ngOnInit();
    expect(component.dataWidget).toBe(JSON.stringify(dataWidgetExpected));
  });
});
