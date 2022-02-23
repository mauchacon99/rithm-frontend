import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDrawerComponent } from './widget-drawer.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { MockComponent } from 'ng-mocks';
import { StationWidgetDrawerComponent } from '../station-widget-drawer/station-widget-drawer.component';
import { PopupService } from 'src/app/core/popup.service';
import { MockPopupService } from 'src/mocks';

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
        { provide: PopupService, useClass: MockPopupService },
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
    expect(spyMethod).toHaveBeenCalled();
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
      '#close-widget-drawer'
    );
    expect(toggleButton).toBeTruthy();
    toggleButton.click();
    expect(spyMethod).toHaveBeenCalled();
  });

  it('should display a confirmation pop up', async () => {
    const confirmationData = {
      title: 'Delete Widget?',
      message: 'This cannot be undone!',
      okButtonText: 'Yes',
      cancelButtonText: 'No',
      important: true,
    };

    const popUpConfirmSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();

    const btnDelete = fixture.nativeElement.querySelector(
      '#delete-widget-button'
    );
    expect(btnDelete).toBeTruthy();
    btnDelete.click();

    expect(popUpConfirmSpy).toHaveBeenCalledOnceWith(confirmationData);
  });

  it('should call eventWidgetIndex and emit widgetIndex', async () => {
    const spySetWidgetIndex = spyOn(component.setWidgetIndex, 'emit');
    const spyEventWidgetIndex = spyOn(
      component,
      'eventWidgetIndex'
    ).and.callThrough();
    const widgetIndex = 1;

    component.eventWidgetIndex(widgetIndex);
    expect(spyEventWidgetIndex).toHaveBeenCalledOnceWith(widgetIndex);
    expect(spySetWidgetIndex).toHaveBeenCalledOnceWith(widgetIndex);
  });
});
