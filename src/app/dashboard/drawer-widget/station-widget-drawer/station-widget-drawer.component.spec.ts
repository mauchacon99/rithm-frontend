import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationWidgetDrawerComponent } from './station-widget-drawer.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';

describe('StationWidgetDrawerComponent', () => {
  let component: StationWidgetDrawerComponent;
  let fixture: ComponentFixture<StationWidgetDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationWidgetDrawerComponent],
      providers: [
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationWidgetDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should subscribe to sidenavDrawerService.drawerData$', () => {
    const [stationRithmId, widgetIndex] = [
      '247cf568-27a4-4968-9338-046ccfee24f3',
      1,
    ];
    TestBed.inject(SidenavDrawerService).drawerData$.next({
      stationRithmId,
      widgetIndex,
    });

    expect(component.stationRithmId).toEqual(stationRithmId);
    expect(component.widgetIndex).toEqual(widgetIndex);
  });
});
