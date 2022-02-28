import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { first, Subject } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { DocumentWidget, QuestionFieldType } from 'src/models';
import { Router } from '@angular/router';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { takeUntil } from 'rxjs/operators';

/**
 * Component for list field the document how widget.
 */
@Component({
  selector: 'app-document-widget[documentRithmId][editMode]',
  templateUrl: './document-widget.component.html',
  styleUrls: ['./document-widget.component.scss'],
})
export class DocumentWidgetComponent implements OnInit, OnDestroy {
  /** Document rithmId. */
  @Input() documentRithmId = '';

  /** Edit mode toggle from dashboard. */
  @Input() editMode = false;

  /** Data document list for widget. */
  dataDocumentWidget!: DocumentWidget;

  /** Loading document widget. */
  isLoading = false;

  /** Show error if get documentWidget fails. */
  failedLoadWidget = false;

  /** The question field type. */
  questionFieldType = QuestionFieldType;

  /** Type of drawer opened. */
  drawerContext!: string;

  /** Open drawer. */
  @Output() toggleDrawer = new EventEmitter<number>();

  private destroyed$ = new Subject<void>();

  constructor(
    private errorService: ErrorService,
    private documentService: DocumentService,
    private router: Router,
    private sidenavDrawerService: SidenavDrawerService
  ) {}

  /**
   * Whether the drawer is open.
   *
   * @returns True if the drawer is open, false otherwise.
   */
  get isDrawerOpen(): boolean {
    return this.sidenavDrawerService.isDrawerOpen;
  }

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.documentRithmId = JSON.parse(this.documentRithmId).documentRithmId;
    this.getDocumentWidget();
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((drawerContext) => {
        this.drawerContext = drawerContext;
      });
  }

  /**
   * Get document widget.
   */
  getDocumentWidget(): void {
    this.isLoading = true;
    this.failedLoadWidget = false;
    this.documentService
      .getDocumentWidget(this.documentRithmId)
      .pipe(first())
      .subscribe({
        next: (documentWidget) => {
          this.dataDocumentWidget = documentWidget;
          this.isLoading = false;
          this.failedLoadWidget = false;
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.failedLoadWidget = true;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Navigate the user to the document page.
   *
   * @param stationId The Id of the station in which to view the document.
   */
  goToDocument(stationId: string): void {
    this.router.navigate(['/', 'document', this.documentRithmId], {
      queryParams: {
        documentId: this.documentRithmId,
        stationId: stationId,
      },
    });
  }

  /** Toggle drawer when click on edit station widget. */
  toggleEditDocument(): void {
    this.toggleDrawer.emit(this.dataDocumentWidget.questions.length);
  }

  /** Clean subscriptions. */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
