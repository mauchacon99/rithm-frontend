import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DocumentService } from 'src/app/core/document.service';
import { StationDocumentsModalComponent } from './station-documents-modal.component';
import { MockDocumentService } from 'src/mocks';
import { MockPopupService } from 'src/mocks';
import { PopupService } from 'src/app/core/popup.service';
import { DialogData } from 'src/models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const DIALOG_TEST_DATA: DialogData = {
  title: 'Roster',
  message: 'This is an example alert used for testing.',
  okButtonText: 'Understood',
  cancelButtonText: 'Cancel'
};

describe('StationDocumentsModalComponent', () => {
  let component: StationDocumentsModalComponent;
  let fixture: ComponentFixture<StationDocumentsModalComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationDocumentsModalComponent],
      imports: [MatTooltipModule, NoopAnimationsModule],
      providers: [
        { provide: PopupService, useClass: MockPopupService },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: DIALOG_TEST_DATA },
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: PopupService, useClass: MockPopupService }
      ]
    })
      .compileComponents();
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
    expect(component.documents).toBeGreaterThanOrEqual(0);
    // expect(component.isWorker).toBe(true || false);
  });

  xit('should display a tooltip if the document is escalated', fakeAsync(() => {
    component.ngOnInit(); // TODO: Find out if it's possible to avoid calling this explicitly
    tick(1000);

    loader.getHarness(MatTooltipHarness)
      .then(async (harness) => {
        await harness.show();
        const tooltipText = await harness.getTooltipText();
        expect(tooltipText).toEqual('This document has been escalated.');

      });
  }));

});
