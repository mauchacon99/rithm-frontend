import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentService } from 'src/app/core/document.service';
import { StationDocumentsModalComponent } from './station-documents-modal.component';
import { MockDocumentService } from 'src/mocks';
import { MockPopupService } from 'src/mocks';
import { PopupService } from 'src/app/core/popup.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader, TestElement } from '@angular/cdk/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('StationDocumentsModalComponent', () => {
  let component: StationDocumentsModalComponent;
  let fixture: ComponentFixture<StationDocumentsModalComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationDocumentsModalComponent],
      imports: [MatTooltipModule],
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

  it('should display a tooltip if the Document.blocked property is set to true', async () => {

    // eslint-disable-next-line max-len
    component.totalDocs = [{ docName: 'Natasha', stationName: 'Hydrogen', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: true, lastUpdated: '' }];
    component.isLoading = false;
    // const divTest = fixture.debugElement.query(By.css('#tooltip-aria0'));

    const tooltipHarness = await loader.getHarness(MatTooltipHarness);
    await tooltipHarness.show();

    expect((await tooltipHarness.getTooltipText())).toEqual('This document has been escalated.');
  });

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
