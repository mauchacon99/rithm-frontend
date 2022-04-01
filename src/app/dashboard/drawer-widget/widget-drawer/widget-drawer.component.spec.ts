import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDrawerComponent } from './widget-drawer.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { MockComponent } from 'ng-mocks';
import { StationWidgetDrawerComponent } from '../station-widget-drawer/station-widget-drawer.component';
import { DocumentWidgetDrawerComponent } from 'src/app/dashboard/drawer-widget/document-widget-drawer/document-widget-drawer.component';
import { PopupService } from 'src/app/core/popup.service';
import {
  MockDocumentService,
  MockErrorService,
  MockPopupService,
  MockSplitService,
  MockUserService,
} from 'src/mocks';
import { WidgetType } from 'src/models';
import { ErrorService } from 'src/app/core/error.service';
import { SplitService } from 'src/app/core/split.service';
import { UserService } from 'src/app/core/user.service';
import { DocumentService } from 'src/app/core/document.service';
import { throwError } from 'rxjs';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';

describe('WidgetDrawerComponent', () => {
  let component: WidgetDrawerComponent;
  let fixture: ComponentFixture<WidgetDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WidgetDrawerComponent,
        MockComponent(StationWidgetDrawerComponent),
        MockComponent(DocumentWidgetDrawerComponent),
        MockComponent(LoadingIndicatorComponent),
      ],
      providers: [
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: UserService, useClass: MockUserService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: SplitService, useClass: MockSplitService },
        { provide: DocumentService, useClass: MockDocumentService },
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
    component.showProfileImageBanner = true;
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

  it('should remove image selected', () => {
    component.showProfileImageBanner = true;
    component.widgetType = WidgetType.StationTableBanner;
    component.imageUploaded = {
      imageId: '24782-52555-4524-542-4555',
      imageName: 'Name image',
    };
    fixture.detectChanges();
    component.removeSelectedFile();
    expect(component.imageUploaded).toEqual({
      imageId: null,
      imageName: null,
    });
    expect(component.fileInputFile.nativeElement.value).toBe('');
  });

  it('should call uploadImage', () => {
    const spyService = spyOn(
      TestBed.inject(DocumentService),
      'uploadImage'
    ).and.callThrough();
    const spyServiceDrawer = spyOn(
      TestBed.inject(SidenavDrawerService),
      'setDisableCloseDrawerOutside'
    ).and.callThrough();
    const mockFile = new File([''], 'name', { type: 'text/png' });
    const mockEvt = { target: { files: [mockFile] } };
    component.uploadImage(mockEvt as unknown as Event);
    expect(spyService).toHaveBeenCalledOnceWith(mockFile);
    expect(spyServiceDrawer).toHaveBeenCalled();
  });

  it('should show alert delete and remove image in widget', async () => {
    component.showProfileImageBanner = true;
    component.widgetType = WidgetType.StationTableBanner;
    component.imageUploaded = {
      imageId: '24782-52555-4524-542-4555',
      imageName: 'Name image',
    };
    fixture.detectChanges();

    const dataExpect = {
      title: 'Remove Image?',
      message: 'This cannot be undone.',
      important: true,
      okButtonText: 'Yes',
      cancelButtonText: 'No',
    };

    const popUpConfirmSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();

    const spyConfirmImageDelete = spyOn(
      component,
      'confirmImageDelete'
    ).and.callThrough();

    const spyRemoveSelectedFile = spyOn(
      component,
      'removeSelectedFile'
    ).and.callThrough();

    const btnDelete = fixture.nativeElement.querySelector(
      '#remove-selected-image'
    );

    await component.confirmImageDelete();
    expect(btnDelete).toBeTruthy();
    expect(spyConfirmImageDelete).toHaveBeenCalled();
    expect(popUpConfirmSpy).toHaveBeenCalledOnceWith(dataExpect);
    expect(spyRemoveSelectedFile).toHaveBeenCalled();
    expect(component.imageUploaded).toEqual({
      imageId: null,
      imageName: null,
    });
  });

  describe('Testing split.io', () => {
    let splitService: SplitService;
    beforeEach(() => {
      splitService = TestBed.inject(SplitService);
    });

    it('should get split for image banner.', () => {
      const dataOrganization = TestBed.inject(UserService).user.organization;
      const splitInitMethod = spyOn(
        TestBed.inject(SplitService),
        'initSdk'
      ).and.callThrough();

      const method = spyOn(
        TestBed.inject(SplitService),
        'getStationUploadBannerTreatment'
      ).and.callThrough();

      const sectionImageBanner = fixture.nativeElement.querySelector(
        '#section-image-banner'
      );
      expect(sectionImageBanner).toBeNull();

      splitService.sdkReady$.next();
      component.ngOnInit();
      expect(sectionImageBanner).toBeDefined();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(method).toHaveBeenCalled();
      expect(component.showProfileImageBanner).toBeTrue();
    });

    it('should show error if get split fail.', () => {
      component.ngOnInit();
      const splitInitMethod = spyOn(
        TestBed.inject(SplitService),
        'initSdk'
      ).and.callThrough();

      const errorService = spyOn(
        TestBed.inject(ErrorService),
        'logError'
      ).and.callThrough();

      splitService.sdkReady$.error('error');

      component.ngOnInit();
      expect(splitInitMethod).toHaveBeenCalled();
      expect(errorService).toHaveBeenCalled();
    });
  });

  it('should return error when upload image', () => {
    const mockFile = new File([''], 'name', { type: 'text/png' });
    const mockEvt = { target: { files: [mockFile] } };
    spyOn(TestBed.inject(DocumentService), 'uploadImage').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyServiceDrawer = spyOn(
      TestBed.inject(SidenavDrawerService),
      'setDisableCloseDrawerOutside'
    ).and.callThrough();
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();

    component.uploadImage(mockEvt as unknown as Event);

    expect(spyError).toHaveBeenCalled();
    expect(spyServiceDrawer).toHaveBeenCalled();
  });

  it('should show loading indicator when upload an image', () => {
    component.showProfileImageBanner = true;
    component.widgetType = WidgetType.DocumentListBanner;
    component.isUploading = true;
    fixture.detectChanges();

    const loadingIndicator = fixture.debugElement.nativeElement.querySelector(
      '#loading-indicator-upload-image'
    );
    expect(loadingIndicator).toBeTruthy();
  });

  it('should set widgetType and imageUploaded', () => {
    const expectedImage = {
      imageId: '123-456-789',
      imageName: 'Image name',
    };
    const widgetItem = {
      rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
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
      imageId: expectedImage.imageId,
      imageName: expectedImage.imageName,
    };
    component.setWidgetItem(widgetItem);

    expect(component.widgetType).toEqual(WidgetType.Station);
    expect(component.imageUploaded).toEqual(expectedImage);
  });
});
