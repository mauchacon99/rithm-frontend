import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDrawerComponent } from './widget-drawer.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { MockComponent } from 'ng-mocks';
import { StationWidgetDrawerComponent } from '../station-widget-drawer/station-widget-drawer.component';
import { DocumentWidgetDrawerComponent } from 'src/app/dashboard/drawer-widget/document-widget-drawer/document-widget-drawer.component';
import { PopupService } from 'src/app/core/popup.service';
import { MockPopupService } from 'src/mocks';
import { WidgetType } from 'src/models';

describe('WidgetDrawerComponent', () => {
  let component: WidgetDrawerComponent;
  let fixture: ComponentFixture<WidgetDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WidgetDrawerComponent,
        MockComponent(StationWidgetDrawerComponent),
        MockComponent(DocumentWidgetDrawerComponent),
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

  it('should display a confirmation Popup', () => {
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

  it('should emit event deleteWidget', async () => {
    const widgetIndex = 1;
    component.widgetIndex = widgetIndex;
    component.drawerMode = 'stationWidget';

    const popUpConfirmSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();

    const infoDrawerSpy = spyOn(
      TestBed.inject(SidenavDrawerService),
      'toggleDrawer'
    );

    const spyDeleteWidget = spyOn(component.deleteWidget, 'emit');

    await component.confirmWidgetDelete();
    expect(infoDrawerSpy).toHaveBeenCalled();
    expect(popUpConfirmSpy).toHaveBeenCalled();
    expect(spyDeleteWidget).toHaveBeenCalledOnceWith(widgetIndex);
  });

  it('should call setWidgetIndex', () => {
    const widgetIndex = 1;

    const spySetWidgetIndex = spyOn(
      component,
      'setWidgetIndex'
    ).and.callThrough();

    component.setWidgetIndex(widgetIndex);
    expect(spySetWidgetIndex).toHaveBeenCalledOnceWith(widgetIndex);
    expect(component.widgetIndex).toBe(widgetIndex);
  });

  it('should show section upload image and defined input in button', () => {
    component.widgetType = WidgetType.StationTableBanner;
    fixture.detectChanges();
    const uploadImageButton = fixture.debugElement.nativeElement.querySelector(
      '#upload-image-button'
    );
    expect(uploadImageButton).toBeTruthy();
    uploadImageButton.click();
    const uploadImageInput = fixture.debugElement.nativeElement.querySelector(
      '#upload-image-input'
    );
    expect(uploadImageInput).toBeDefined();
  });

  it('should emit widgetIndex to dashboard', () => {
    const widgetIndex = 1;
    const spySetWidgetIndex = spyOn(
      component,
      'setWidgetIndex'
    ).and.callThrough();
    const spyOnWidgetIndexOpened = spyOn(component.widgetIndexOpened, 'emit');
    component.setWidgetIndex(widgetIndex);
    expect(spySetWidgetIndex).toHaveBeenCalledOnceWith(widgetIndex);
    expect(spyOnWidgetIndexOpened).toHaveBeenCalledOnceWith(widgetIndex);
  });

  it('should remove image selected', () => {
    component.widgetType = WidgetType.StationTableBanner;
    component.imageSelected = new File(new Array<Blob>(), 'image', {
      type: 'image/jpeg',
    });
    fixture.detectChanges();
    const spyOnRemoveSelectedFile = spyOn(
      component,
      'removeSelectedFile'
    ).and.callThrough();
    const spyOnEmitImage = spyOn(component.image, 'emit');
    component.removeSelectedFile();
    expect(spyOnRemoveSelectedFile).toHaveBeenCalledOnceWith();
    expect(component.imageSelected).toBeUndefined();
    expect(component.fileInputFile.nativeElement.value).toBe('');
    expect(spyOnEmitImage).toHaveBeenCalledOnceWith(undefined);
  });
});
