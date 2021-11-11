import { Component, OnInit, OnDestroy } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { StationService } from 'src/app/core/station.service';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { Subject } from 'rxjs';

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
  destroyed$ = new Subject<void>();

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    private sidenavDrawerService: SidenavDrawerService,
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
    this.stationService.getStatusDocumentEditable(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (documentEditableStatus) => {
          if (documentEditableStatus) {
            this.documentNameEditable = documentEditableStatus;
          }
        }, error: (error: unknown) => {
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
    this.stationService.updateStatusDocumentEditable(this.stationRithmId, newStatus)
      .pipe(first())
      .subscribe({
        next: (documentEditableStatus) => {
          if (documentEditableStatus) {
            this.documentNameEditable = documentEditableStatus;
          }
        }, error: (error: unknown) => {
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

  /** Change status check in documentNameEditable. */
  changeDocumentNameEditable(): void {
    // this.documentNameEditable=!this.documentNameEditable;
    this.updateStatusDocumentEditable(this.documentNameEditable);
  }

}
