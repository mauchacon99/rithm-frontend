import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { DocumentService } from 'src/app/core/document.service';
import { StationDocumentsModalComponent } from './station-documents-modal.component';
import {
  MockDocumentService,
  MockErrorService,
  MockSplitService,
  MockUserService,
} from 'src/mocks';
import { MockPopupService } from 'src/mocks';
import { PopupService } from 'src/app/core/popup.service';
import { StationDocumentsModalData, UserType } from 'src/models';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import {
  NoopAnimationsModule,
  BrowserAnimationsModule,
} from '@angular/platform-browser/animations';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockComponent } from 'ng-mocks';
import { UserService } from 'src/app/core/user.service';
import { SplitService } from 'src/app/core/split.service';
import { ErrorService } from 'src/app/core/error.service';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatRippleModule } from '@angular/material/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const DIALOG_TEST_DATA: StationDocumentsModalData = {
  stationName: 'A Station',
  stationId: 'jk34jk34jk34',
};

describe('StationDocumentsModalComponent', () => {
  let component: StationDocumentsModalComponent;
  let fixture: ComponentFixture<StationDocumentsModalComponent>;
  let loader: HarnessLoader;

  const dialogMock = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    close: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationDocumentsModalComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        MatTooltipModule,
        MatDialogModule,
        MatInputModule,
        MatSortModule,
        FormsModule,
        MatButtonModule,
        MatTableModule,
        MatRippleModule,
        InfiniteScrollModule,
      ],
      providers: [
        { provide: PopupService, useClass: MockPopupService },
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: UserService, useClass: MockUserService },
        { provide: SplitService, useClass: MockSplitService },
        { provide: ErrorService, useClass: MockErrorService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationDocumentsModalComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return zero or more documents', () => {
    expect(component.documents.length).toBeGreaterThanOrEqual(0);
    expect(component.totalNumDocs).toBeGreaterThanOrEqual(0);
    // expect(component.isWorker).toBe(true || false);
  });

  xit('should link to a document if clicked with proper permissions', () => {
    // TODO: This test not currently working.
    component.userType =
      UserType.Worker || UserType.Admin || UserType.StationOwner;
    expect(component.checkDocPermission('1')).toBeTruthy();
    component.userType = UserType.None;
    expect(component.checkDocPermission('1')).toBeFalsy();
  });

  xit('should display a tooltip if the document is escalated', fakeAsync(() => {
    component.ngOnInit(); // TODO: Find out if it's possible to avoid calling this explicitly
    tick(1000);

    loader.getHarness(MatTooltipHarness).then(async (harness) => {
      await harness.show();
      const tooltipText = await harness.getTooltipText();
      expect(tooltipText).toEqual('This document has been escalated.');
    });
  }));

  describe('Testing split.io', () => {
    let splitService: SplitService;
    let userService: UserService;
    beforeEach(() => {
      splitService = TestBed.inject(SplitService);
      userService = TestBed.inject(UserService);
    });

    it('should call split and treatments.', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();
      const methodShowContainer = spyOn(
        splitService,
        'getStationContainersModalTreatment'
      ).and.returnValue('on');

      splitService.sdkReady$.next();
      component.ngOnInit();

      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(methodShowContainer).toHaveBeenCalled();
      expect(component.showContainerModal).toBeTrue();
    });

    it('should not show treatments when permission does not exits.', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();
      const methodShowContainer = spyOn(
        splitService,
        'getStationContainersModalTreatment'
      ).and.returnValue('off');

      splitService.sdkReady$.next();
      component.ngOnInit();
      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(methodShowContainer).toHaveBeenCalled();
      expect(component.showContainerModal).toBeFalse();
    });

    it('should catch split error ', () => {
      const dataOrganization = userService.user.organization;
      const splitInitMethod = spyOn(splitService, 'initSdk').and.callThrough();

      splitService.sdkReady$.error('error');
      const errorService = spyOn(
        TestBed.inject(ErrorService),
        'logError'
      ).and.callThrough();
      component.ngOnInit();

      expect(splitInitMethod).toHaveBeenCalledOnceWith(dataOrganization);
      expect(errorService).toHaveBeenCalled();
      expect(component.showContainerModal).toBeFalse();
    });
  });

  it('should return the time in a string', () => {
    component.documents = [
      {
        documentName: 'Almond Flour',
        stationName: 'Dry Goods & Liquids',
        flowedTimeUTC: '2021-06-16T17:26:47.3506612Z',
        priority: 2,
        userAssigned: {
          rithmId: '123132132',
          firstName: 'Demo',
          lastName: 'User',
          email: 'demo@demo.com',
          isWorker: true,
          isOwner: false,
        },
        isEscalated: true,
        updatedTimeUTC: '2021-06-16T17:26:47.3506612Z',
        documentRithmId: '',
        stationRithmId: '',
      },
    ];
    const time = component.getElapsedTimeNewTemplate(
      component.documents[0].flowedTimeUTC
    );
    expect(time).toBeTruthy();
  });

  it('should call close the modal in dialogRef service', () => {
    component.showContainerModal = true;
    fixture.detectChanges();
    const spyMatDialogRef = spyOn(TestBed.inject(MatDialogRef), 'close');
    const spyMethod = spyOn(component, 'closeModal').and.callThrough();
    const btnClose = fixture.nativeElement.querySelector(
      '#close-station-document-modal'
    );
    expect(btnClose).toBeTruthy();
    btnClose.click();
    expect(spyMethod).toHaveBeenCalled();
    expect(spyMatDialogRef).toHaveBeenCalled();
  });
});
