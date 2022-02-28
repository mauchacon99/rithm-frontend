import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { WidgetType } from 'src/models';

import { DocumentWidgetDrawerComponent } from './document-widget-drawer.component';

describe('DocumentWidgetDrawerComponent', () => {
  let component: DocumentWidgetDrawerComponent;
  let fixture: ComponentFixture<DocumentWidgetDrawerComponent>;
  const dataEditWidget = {
    widgetItem: {
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
    isCloseDrawer: false,
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
