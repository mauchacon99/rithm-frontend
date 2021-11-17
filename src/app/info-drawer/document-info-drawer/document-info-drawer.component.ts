import { Component, OnInit, OnDestroy } from '@angular/core';
import { first, map, startWith, takeUntil } from 'rxjs/operators';
import { StationService } from 'src/app/core/station.service';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentNameField } from 'src/models/document-name-field';

/**
 * Component for document drawer.
 */
@Component({
  selector: 'app-document-info-drawer',
  templateUrl: './document-info-drawer.component.html',
  styleUrls: ['./document-info-drawer.component.scss']
})
export class DocumentInfoDrawerComponent implements OnInit, OnDestroy {

  /** Organization name form. */
  appendFieldForm: FormGroup;

  /**Fields Options. */
  private options: DocumentNameField[] = [
    {
      rithmId: '1234-1234-1234',
      prompt: 'SKU'
    },
    {
      rithmId: '1234-1234-1235',
      prompt: 'Color'
    },
    {
      rithmId: '1234-1234-1236',
      prompt: 'Other'
    }
  ];

  /**Filtered Form Fields */
  filteredOptions$: Observable<DocumentNameField[]> | undefined;

  /** Is the document name editable. */
  documentNameEditable = false;

  /** The station rithmId. */
  stationRithmId = '';

  /** Whether the request to get the document info drawer is currently underway. */
  documentInfoDrawerLoading = false;

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Loading in the document name section. */
  documentNameLoading = false;

  constructor(
    private fb: FormBuilder,
    private stationService: StationService,
    private errorService: ErrorService,
    private sidenavDrawerService: SidenavDrawerService,
  ) {
    this.appendFieldForm = this.fb.group({
      appendField: ''
    });

    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as {
          /** RithmId station. */
          rithmId: string;
        };
        if (dataDrawer) {
          this.stationRithmId = dataDrawer.rithmId;
        }
      });
  }

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getStatusDocumentEditable();

    this.filteredOptions$ = this.appendFieldForm.controls['appendField'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  /**
   * Filtered Values.
   *
   * @param value Current String in Field Forms.
   * @returns Filtered value.
   */
   private _filter(value: string): DocumentNameField[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.prompt.toLowerCase().includes(filterValue));
  }

  /**
   * Get status document is editable or not.
   *
   */
  getStatusDocumentEditable(): void {
    this.documentNameLoading = true;
    this.stationService.getStatusDocumentEditable(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (documentEditableStatus) => {
          this.documentNameLoading = false;
          if (documentEditableStatus) {
            this.documentNameEditable = documentEditableStatus;
          }
        }, error: (error: unknown) => {
          this.documentNameLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Update status document is editable or not.
   *
   * @param newStatus The new status is editable in the change for document.
   */
  updateStatusDocumentEditable(newStatus: boolean): void {
    this.documentNameLoading = true;
    this.stationService.updateStatusDocumentEditable(this.stationRithmId, newStatus)
      .pipe(first())
      .subscribe({
        next: (documentEditableStatus) => {
          this.documentNameEditable = documentEditableStatus;
          this.documentNameLoading = false;
        }, error: (error: unknown) => {
          this.documentNameLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
