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
import { DashboardItem, SelectedItemWidgetModel, WidgetType } from 'src/models';
import { ListWidgetModalComponent } from 'src/app/dashboard/widget-modal/list-widget-modal/list-widget-modal.component';
import { DescriptionWidgetModalComponent } from '../description-widget-modal/description-widget-modal.component';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { MockDashboardService } from 'src/mocks';

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
      ],
      imports: [MatTabsModule, NoopAnimationsModule, MatDialogModule],
      declarations: [
        AddWidgetModalComponent,
        MockComponent(CustomTabWidgetModalComponent),
        MockComponent(ListWidgetModalComponent),
        MockComponent(DescriptionWidgetModalComponent),
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

  it('should generate dataWidget of itemWidgetModalSelected of each case', () => {
    component.itemWidgetModalSelected = {
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
    fixture.detectChanges();
    const expectedDatWidgetByStation = JSON.stringify({
      stationRithmId: itemWidgetModalSelected.itemList.rithmId,
      columns: [{ name: 'name' }],
    });
    const dataWidgetStation = component.dataWidget;
    expect(dataWidgetStation).toBe(expectedDatWidgetByStation);

    component.itemWidgetModalSelected = {
      itemType: 'document',
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
    fixture.detectChanges();
    const expectedDatWidgetByDocument = JSON.stringify({
      documentRithmId: itemWidgetModalSelected.itemList.rithmId,
      columns: [],
    });
    const dataWidgetDocument = component.dataWidget;
    expect(dataWidgetDocument).toBe(expectedDatWidgetByDocument);

    component.itemWidgetModalSelected = {
      itemType: 'group',
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
    fixture.detectChanges();
    const expectedDatWidgetByGroup = JSON.stringify({
      stationGroupRithmId: '',
    });
    const dataWidgetGroup = component.dataWidget;
    expect(dataWidgetGroup).toBe(expectedDatWidgetByGroup);
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
      component.identifyShowElement = 'document';
      component.itemWidgetModalSelected = itemWidgetModalSelected;
      dialogRef = TestBed.inject(MatDialogRef);
    });

    it('should add widget when data it is station table or document list', () => {
      const spyMatDialogRef = spyOn(dialogRef, 'close');
      const spyMethod = spyOn(component, 'addWidget').and.callThrough();
      const spyMath = spyOn(Math, 'random').and.returnValues(123456789);
      component.previewWidgetTypeSelected = WidgetType.Station;
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
      component.previewWidgetTypeSelected = WidgetType.StationTableBanner;
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

    it('should add widget when previewWidgetTypeSelected is defaultDocument', () => {
      const spyMatDialogRef = spyOn(dialogRef, 'close');
      const spyMethod = spyOn(component, 'addWidget').and.callThrough();
      const spyMath = spyOn(Math, 'random').and.returnValues(123456789);
      component.previewWidgetTypeSelected = WidgetType.Document;
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

  it('should return Widget type document when previewWidgetTypeSelected is "defaultDocument"', () => {
    component.previewWidgetTypeSelected = 'defaultDocument';
    const responseData = component['widgetTypeToItem']();
    expect(responseData).toEqual(WidgetType.Document);
  });

  it('should return 2 minItemRows when widget type are banners image', () => {
    component.previewWidgetTypeSelected = WidgetType.DocumentListBanner;
    const responseData = component['minItemRowsWidget']();
    expect(responseData).toEqual(2);
  });

  it('should return 1 minItemRows when widget type are not banners image', () => {
    component.previewWidgetTypeSelected = WidgetType.Station;

    const responseData = component['minItemRowsWidget']();
    expect(responseData).toEqual(1);
  });
});
