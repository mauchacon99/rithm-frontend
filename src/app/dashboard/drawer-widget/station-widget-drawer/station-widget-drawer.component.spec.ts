import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationWidgetDrawerComponent } from './station-widget-drawer.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { WidgetDrawerStationData } from 'src/models';

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
    const [stationData, widgetIndex] = [
      // eslint-disable-next-line max-len
      '{"stationRithmId":"21316c62-8a45-4e79-ba58-0927652569cc", "columns": [{"name": "document"}, {"name": "last Updated"}, {"name": "name", "questionId": "d17f6f7a-9642-45e0-8221-e48045d3c97e"}]}',
      1,
    ];
    TestBed.inject(SidenavDrawerService).drawerData$.next({
      stationData,
      widgetIndex,
    });
    const expectStationData = JSON.parse(
      stationData
    ) as WidgetDrawerStationData;
    expect(component.stationRithmId).toEqual(expectStationData.stationRithmId);
    expect(component.stationColumns).toEqual(expectStationData.columns);
    expect(component.widgetIndex).toEqual(widgetIndex);
  });

  it('should show/hide the station widget  drawer', () => {
    component.drawerMode = 'stationWidget';
    const infoDrawerSpy = spyOn(
      TestBed.inject(SidenavDrawerService),
      'toggleDrawer'
    );
    component.toggleDrawer();
    expect(infoDrawerSpy).toHaveBeenCalled();

    const spyMethod = spyOn(component, 'toggleDrawer');
    const toggleButton = fixture.debugElement.nativeElement.querySelector(
      '#close-station-widget-drawer'
    );
    expect(toggleButton).toBeTruthy();
    toggleButton.click();
    expect(spyMethod).toHaveBeenCalled();
  });
});
