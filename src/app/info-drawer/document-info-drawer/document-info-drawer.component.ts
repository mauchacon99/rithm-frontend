import { Component, OnInit, OnDestroy } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { StationService } from 'src/app/core/station.service';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { Subject } from 'rxjs';
import { FieldNameSeparator } from 'src/models/enums/field-name-separator.enum';

/**
 * Component for document drawer.
 */
@Component({
  selector: 'app-document-info-drawer',
  templateUrl: './document-info-drawer.component.html',
  styleUrls: ['./document-info-drawer.component.scss']
})
export class DocumentInfoDrawerComponent implements OnInit, OnDestroy {

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

  /** Select to store the separator value. */
  separatorValueSelect = '';

  /** The different options for the separator value. */
  fieldNameSeparatorOptions = FieldNameSeparator;

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    private sidenavDrawerService: SidenavDrawerService
  ) {
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
