import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDrawerComponent } from './widget-drawer.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { MockComponent } from 'ng-mocks';
import { StationWidgetDrawerComponent } from '../station-widget-drawer/station-widget-drawer.component';

describe('WidgetDrawerComponent', () => {
  let component: WidgetDrawerComponent;
  let fixture: ComponentFixture<WidgetDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WidgetDrawerComponent,
        MockComponent(StationWidgetDrawerComponent),
      ],
      providers: [
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to sidenavDrawerService.drawerContext$ and set drawer mode', () => {
    TestBed.inject(SidenavDrawerService).drawerContext$.next('stationWidget');

    expect(component.drawerMode).toEqual('stationWidget');
  });

  it('Should call toggle drawer when click in done', () => {
    const spyService = spyOn(
      TestBed.inject(SidenavDrawerService),
      'toggleDrawer'
    );
    const spyMethod = spyOn(component, 'toggleDrawer').and.callThrough();
    component.drawerMode = 'stationWidget';

    const btnDone = fixture.nativeElement.querySelector('#done-btn');
    expect(btnDone).toBeTruthy();
    btnDone.click();
    expect(spyService).toHaveBeenCalled();
    expect(spyMethod).toHaveBeenCalledOnceWith('stationWidget');
  });
});
