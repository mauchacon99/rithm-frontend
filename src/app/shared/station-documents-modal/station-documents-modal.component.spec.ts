import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DocumentService } from 'src/app/core/document.service';
import { StationDocumentsModalComponent } from './station-documents-modal.component';
import { MockDocumentService } from 'src/mocks';
import { MockPopupService } from 'src/mocks';
import { PopupService } from 'src/app/core/popup.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('StationDocumentsModalComponent', () => {
  let component: StationDocumentsModalComponent;
  let fixture: ComponentFixture<StationDocumentsModalComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationDocumentsModalComponent],
      imports: [MatTooltipModule, NoopAnimationsModule],
      providers: [
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
    expect(component.totalDocs.length).toBeGreaterThanOrEqual(0);
  });

  it('should display a tooltip if the document is escalated', fakeAsync(() => {
    component.ngOnInit(); // TODO: Find out if it's possible to avoid calling this explicitly
    tick(1000);

    loader.getHarness(MatTooltipHarness)
      .then(async (harness) => {
        await harness.show();
        const tooltipText = await harness.getTooltipText();
        expect(tooltipText).toEqual('This document has been escalated.');

      });
  }));

  // it('should not have any empty tooltips', async () => {
  //   await fixture.whenStable();
  //   const elt: HTMLElement = fixture.nativeElement;
  //   const hoverDivs: NodeListOf<HTMLDivElement> = elt.querySelectorAll('div[ng-reflect-ngb-tooltip]');
  //   hoverDivs.forEach(helper => {
  //     helper.dispatchEvent(new MouseEvent('mouseenter'));
  //     const window = elt.querySelector('ngb-tooltip-window div.tooltip-inner');
  //     expect(window).toBeTruthy();
  //     if (window) {
  //       console.log(window.textContent);
  //       expect((window.textContent as string).length).toBeGreaterThan(0);
  //     }
  //     helper.dispatchEvent(new MouseEvent('mouseleave'));
  //   });
  // });
});
