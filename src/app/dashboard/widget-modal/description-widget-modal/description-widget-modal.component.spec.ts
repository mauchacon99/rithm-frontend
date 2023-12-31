import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { DashboardItem, SelectedItemWidgetModel, WidgetType } from 'src/models';
import { MockDashboardService } from 'src/mocks';
import { MockComponent } from 'ng-mocks';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { DescriptionWidgetModalComponent } from 'src/app/dashboard/widget-modal/description-widget-modal/description-widget-modal.component';
import { GroupSearchWidgetComponent } from 'src/app/shared/widget-dashboard/group-search-widget/group-search-widget.component';
import { GroupTrafficWidgetComponent } from 'src/app/shared/widget-dashboard/group-traffic-widget/group-traffic-widget.component';
import { StationPreBuiltWidgetComponent } from 'src/app/shared/widget-dashboard/station-pre-built-widget/station-pre-built-widget.component';
import { DocumentWidgetComponent } from 'src/app/shared/widget-dashboard/document-widget/document-widget.component';
import { StationWidgetComponent } from 'src/app/shared/widget-dashboard/station-widget/station-widget.component';

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
        MockComponent(StationWidgetComponent),
        MockComponent(GroupSearchWidgetComponent),
        MockComponent(GroupTrafficWidgetComponent),
        MockComponent(StationPreBuiltWidgetComponent),
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close } },
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

  describe('Parse data widget', () => {
    it('should get data for document', () => {
      const expectData = JSON.stringify({
        documentRithmId: itemWidgetModalSelected.itemList?.rithmId,
        columns: [],
      });
      component.itemWidgetModalSelected = itemWidgetModalSelected;
      component.itemWidgetModalSelected.itemType = 'document';
      fixture.detectChanges();

      expect(component.dataWidget).toEqual(expectData);
    });

    it('should get data for station', () => {
      component.widgetType = WidgetType.Station;
      const expectData = JSON.stringify({
        stationRithmId: itemWidgetModalSelected.itemList?.rithmId,
        columns: [{ name: 'name' }],
      });
      component.itemWidgetModalSelected = itemWidgetModalSelected;
      component.itemWidgetModalSelected.itemType = 'station';
      fixture.detectChanges();

      expect(component.dataWidget).toEqual(expectData);
    });

    it('should get data for stationGroup', () => {
      const expectData = JSON.stringify({
        stationGroupRithmId: itemWidgetModalSelected.itemList?.rithmId,
      });
      component.itemWidgetModalSelected = itemWidgetModalSelected;
      component.itemWidgetModalSelected.itemType = 'group';
      fixture.detectChanges();

      expect(component.dataWidget).toEqual(expectData);
    });

    it('should get data for StationGroupTraffic', () => {
      const expectData = JSON.stringify({
        valueShowGraphic: 5,
        stationGroupRithmId: itemWidgetModalSelected.itemList?.rithmId,
      });
      component.widgetType = WidgetType.StationGroupTraffic;
      component.itemWidgetModalSelected = itemWidgetModalSelected;
      component.itemWidgetModalSelected.itemType = 'group';
      fixture.detectChanges();
      expect(component.dataWidget).toEqual(expectData);
    });

    it('should get data for StationMultiline', () => {
      component.widgetType = WidgetType.StationMultiline;
      const expectData = JSON.stringify({
        stationRithmId: itemWidgetModalSelected.itemList?.rithmId,
        columns: [
          { name: 'name' },
          { name: 'lastUpdatedUTC' },
          { name: 'assignedUser' },
        ],
      });
      component.itemWidgetModalSelected = itemWidgetModalSelected;
      component.itemWidgetModalSelected.itemType = 'station';
      fixture.detectChanges();
      expect(component.dataWidget).toEqual(expectData);
    });

    it('should get data for StationMultilineBanner', () => {
      component.widgetType = WidgetType.StationMultilineBanner;
      const expectData = JSON.stringify({
        stationRithmId: itemWidgetModalSelected.itemList?.rithmId,
        columns: [
          { name: 'name' },
          { name: 'lastUpdatedUTC' },
          { name: 'assignedUser' },
        ],
      });
      component.itemWidgetModalSelected = itemWidgetModalSelected;
      component.itemWidgetModalSelected.itemType = 'station';
      fixture.detectChanges();
      expect(component.dataWidget).toEqual(expectData);
    });
  });

  describe('Add new widget', () => {
    const expectData: DashboardItem = {
      rithmId: 'TEMPID-i3v9',
      cols: 3,
      rows: 1,
      x: 0,
      y: 0,
      widgetType: WidgetType.Station,
      data: '',
      minItemRows: 1,
      minItemCols: 3,
    };

    let dialogRef: MatDialogRef<unknown>;

    beforeEach(() => {
      component.itemWidgetModalSelected = itemWidgetModalSelected;
      dialogRef = TestBed.inject(MatDialogRef);
    });

    it('should add widget when data it is station table or document list', () => {
      const spyMatDialogRef = spyOn(dialogRef, 'close');
      const spyMethod = spyOn(component, 'addWidget').and.callThrough();
      const spyMath = spyOn(Math, 'random').and.returnValues(123456789);
      component.widgetTypeWithoutDefault = WidgetType.Station;
      expectData.widgetType = WidgetType.Station;
      expectData.rows = 1;
      expectData.minItemRows = 1;
      expectData.data = component.dataWidget;
      const btnAddWidget =
        fixture.nativeElement.querySelector('#add-widget-button');
      expect(btnAddWidget).toBeTruthy();
      btnAddWidget.click();

      expect(spyMatDialogRef).toHaveBeenCalledOnceWith(expectData);
      expect(spyMath).toHaveBeenCalled();
      expect(spyMethod).toHaveBeenCalled();
    });

    it('should add widget when data it is station banner or document banner', () => {
      const spyMatDialogRef = spyOn(dialogRef, 'close');
      const spyMethod = spyOn(component, 'addWidget').and.callThrough();
      const spyMath = spyOn(Math, 'random').and.returnValues(123456789);
      component.widgetTypeWithoutDefault = WidgetType.StationTableBanner;
      expectData.widgetType = WidgetType.StationTableBanner;
      expectData.rows = 2;
      expectData.minItemRows = 2;
      expectData.data = component.dataWidget;
      const btnAddWidget =
        fixture.nativeElement.querySelector('#add-widget-button');
      expect(btnAddWidget).toBeTruthy();
      btnAddWidget.click();

      expect(spyMethod).toHaveBeenCalled();
      expect(spyMath).toHaveBeenCalled();
      expect(spyMatDialogRef).toHaveBeenCalledOnceWith(expectData);
    });

    it('should add widget when widgetType is defaultDocument', () => {
      const spyMatDialogRef = spyOn(dialogRef, 'close');
      const spyMethod = spyOn(component, 'addWidget').and.callThrough();
      const spyMath = spyOn(Math, 'random').and.returnValues(123456789);
      component.widgetTypeWithoutDefault = WidgetType.Document;
      component.itemWidgetModalSelected.itemType = 'document';
      expectData.widgetType = WidgetType.Document;
      expectData.rows = 1;
      expectData.minItemRows = 1;
      expectData.data = component.dataWidget;
      const btnAddWidget =
        fixture.nativeElement.querySelector('#add-widget-button');
      expect(btnAddWidget).toBeTruthy();
      btnAddWidget.click();

      expect(spyMethod).toHaveBeenCalled();
      expect(spyMath).toHaveBeenCalled();
      expect(spyMatDialogRef).toHaveBeenCalledOnceWith(expectData);
    });

    it('should add widget when widgetType is preBuilt', () => {
      component.itemWidgetModalSelected.itemType = 'preBuilt';
      fixture.detectChanges();
      const dataWidget = component.dataWidget;
      expect(dataWidget).toBe('');
    });
  });

  it('should return 2 minItemRows when widget type are banners image', () => {
    component.widgetTypeWithoutDefault = WidgetType.DocumentListBanner;
    const responseData = component['minItemRowsWidget']();
    expect(responseData).toEqual(2);
  });

  it('should return 1 minItemRows when widget type are not banners image', () => {
    component.widgetTypeWithoutDefault = WidgetType.Station;

    const responseData = component['minItemRowsWidget']();
    expect(responseData).toEqual(1);
  });

  it('should return 2 minItemRows when widget type for ContainerProfileBanner', () => {
    component.widgetTypeWithoutDefault = WidgetType.ContainerProfileBanner;
    const responseData = component['minItemRowsWidget']();
    expect(responseData).toEqual(2);
  });

  it('should return 4 minItemColsWidget when widget type for preBuilt', () => {
    component.widgetType = WidgetType.PreBuiltStation;
    fixture.detectChanges();
    const responseData = component['minItemColsWidget']();
    expect(responseData).toEqual(4);
  });
});
