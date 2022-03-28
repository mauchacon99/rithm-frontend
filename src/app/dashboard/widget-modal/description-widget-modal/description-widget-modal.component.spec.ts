import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionWidgetModalComponent } from './description-widget-modal.component';
import { DashboardItem, SelectedItemWidgetModel, WidgetType } from 'src/models';
import { MockDashboardService } from 'src/mocks';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { MockComponent } from 'ng-mocks';
import { GroupSearchWidgetComponent } from 'src/app/dashboard/widgets/group-search-widget/group-search-widget.component';
import { DocumentWidgetComponent } from 'src/app/dashboard/widgets/document-widget/document-widget.component';
import { MatDialogRef } from '@angular/material/dialog';
import { StationWidgetComponent } from 'src/app/dashboard/widgets/station-widget/station-widget.component';

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
        documentRithmId: itemWidgetModalSelected.itemList.rithmId,
        columns: [],
      });
      component.itemWidgetModalSelected = itemWidgetModalSelected;
      component.itemWidgetModalSelected.itemType = 'document';
      fixture.detectChanges();

      expect(component.dataWidget).toEqual(expectData);
    });

    it('should get data for station', () => {
      const expectData = JSON.stringify({
        stationRithmId: itemWidgetModalSelected.itemList.rithmId,
        columns: [{ name: 'name' }],
      });
      component.itemWidgetModalSelected = itemWidgetModalSelected;
      component.itemWidgetModalSelected.itemType = 'station';
      fixture.detectChanges();

      expect(component.dataWidget).toEqual(expectData);
    });

    it('should get data for stationGroup', () => {
      const expectData = JSON.stringify({
        stationGroupRithmId: itemWidgetModalSelected.itemList.rithmId,
      });
      component.itemWidgetModalSelected = itemWidgetModalSelected;
      component.itemWidgetModalSelected.itemType = 'group';
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
      fixture.detectChanges();
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
      fixture.detectChanges();
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
      fixture.detectChanges();
      expectData.data = component.dataWidget;
      const btnAddWidget =
        fixture.nativeElement.querySelector('#add-widget-button');
      expect(btnAddWidget).toBeTruthy();
      btnAddWidget.click();

      expect(spyMethod).toHaveBeenCalled();
      expect(spyMath).toHaveBeenCalled();
      expect(spyMatDialogRef).toHaveBeenCalledOnceWith(expectData);
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
});
