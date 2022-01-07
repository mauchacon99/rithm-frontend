import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { DocumentService } from 'src/app/core/document.service';
import { StationDocumentsModalComponent } from './station-documents-modal.component';
import { MockDocumentService } from 'src/mocks';
import { MockPopupService } from 'src/mocks';
import { PopupService } from 'src/app/core/popup.service';
import { StationDocumentsModalData, UserType } from 'src/models';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { MockComponent } from 'ng-mocks';

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
        NoopAnimationsModule,
        MatTooltipModule,
        MatDialogModule,
      ],
      providers: [
        { provide: PopupService, useClass: MockPopupService },
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: PopupService, useClass: MockPopupService },
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
});
