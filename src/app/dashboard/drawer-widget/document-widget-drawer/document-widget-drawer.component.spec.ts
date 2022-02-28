import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { WidgetType, EditDataWidget } from 'src/models';

import { DocumentWidgetDrawerComponent } from './document-widget-drawer.component';

describe('DocumentWidgetDrawerComponent', () => {
  let component: DocumentWidgetDrawerComponent;
  let fixture: ComponentFixture<DocumentWidgetDrawerComponent>;
  const dataEditWidget: EditDataWidget = {
    widgetItem: {
      cols: 4,
      // eslint-disable-next-line max-len
      data: '{"stationRithmId":"9897ba11-9f11-4fcf-ab3f-f74a75b9d5a1","columns": [{"name": "name"}, {"name": "name", "questionId": "d17f6f7a-9642-45e0-8221-e48045d3c97e"}]}',
      maxItemCols: 0,
      maxItemRows: 0,
      minItemCols: 0,
      minItemRows: 0,
      rows: 2,
      widgetType: WidgetType.Station,
      x: 0,
      y: 0,
    },
    widgetIndex: 0,
    quantityElementsWidget: 2,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentWidgetDrawerComponent],
      providers: [
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentWidgetDrawerComponent);
    component = fixture.componentInstance;
    component.quantityElementsWidget = 2;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should subscribe to SidenavDrawerService.drawerData$', () => {
    TestBed.inject(SidenavDrawerService).drawerData$.next(dataEditWidget);
    expect(component.widgetIndex).toEqual(dataEditWidget.widgetIndex);
    expect(component.widgetItem).toEqual(dataEditWidget.widgetItem);
  });
});
