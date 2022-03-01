import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { WidgetType, EditDataWidget } from 'src/models';

import { DocumentWidgetDrawerComponent } from './document-widget-drawer.component';

describe('DocumentWidgetDrawerComponent', () => {
  let component: DocumentWidgetDrawerComponent;
  let fixture: ComponentFixture<DocumentWidgetDrawerComponent>;
  const dataEditWidget: EditDataWidget = {
    widgetItem: {
      rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
      cols: 4,
      data: '{"documentRithmId":"1bda1a41-e86a-4031-b3f5-f2329e108db5","columns":[]}',
      maxItemCols: 0,
      maxItemRows: 0,
      minItemCols: 0,
      minItemRows: 0,
      rows: 2,
      widgetType: WidgetType.Document,
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
