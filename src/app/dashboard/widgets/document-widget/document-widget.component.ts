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
import {
  ColumnFieldsWidget,
  DocumentImage,
  DocumentWidget,
  QuestionFieldType,
  WidgetType,
} from 'src/models';
import { Router } from '@angular/router';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { takeUntil } from 'rxjs/operators';

/**
 * Component for list field the document how widget.
 */
@Component({
  selector:
    'app-document-widget[dataWidget][editMode][showButtonSetting][widgetType]',
  templateUrl: './document-widget.component.html',
  styleUrls: ['./document-widget.component.scss'],
})
export class DocumentWidgetComponent implements OnInit, OnDestroy {
  /** To load dom by WidgetType. */
  @Input() widgetType: WidgetType = WidgetType.Document;

  /** Image to banner. */
  @Input() image!: DocumentImage;

  /** Edit mode toggle from dashboard. */
  @Input() editMode = false;

  /** Show setting button widget. */
  @Input() showButtonSetting = false;

  /** Data widget. */
  private _dataWidget = '';

  /** Set data for document widget. */
  @Input() set dataWidget(value: string) {
    this._dataWidget = value;
    if (this.documentRithmId) {
      this.parseDataColumnsWidget();
    }
  }

  /**
   * Get data for document widget.
   *
   * @returns Data for document widget.
   */
  get dataWidget(): string {
    return this._dataWidget;
  }

  /** Open drawer. */
  @Output() toggleDrawer = new EventEmitter<number>();

  /**
   * Whether the drawer is open.
   *
   * @returns True if the drawer is open, false otherwise.
   */
  get isDrawerOpen(): boolean {
    return this.sidenavDrawerService.isDrawerOpen;
  }

  private destroyed$ = new Subject<void>();

  /** Data document list for widget. */
  dataDocumentWidget!: DocumentWidget;

  /** Enum with types widget station. */
  typesWidget = WidgetType;

  /** Type of drawer opened. */
  drawerContext!: string;

  /** Document rithmId. */
  documentRithmId!: string;

  /** Loading document widget. */
  isLoading = false;

  /** Show error if get documentWidget fails. */
  failedLoadWidget = false;

  /** Columns for list the widget. */
  documentColumns: ColumnFieldsWidget[] = [];

  /** The question field type. */
  questionFieldType = QuestionFieldType;

  constructor(
    private errorService: ErrorService,
    private documentService: DocumentService,
    private router: Router,
    private sidenavDrawerService: SidenavDrawerService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.parseDataColumnsWidget();
    this.getDrawerContext();
    this.getDocumentWidget();
  }

  /** Parse data of columns widget. */
  private parseDataColumnsWidget(): void {
    const dataWidget = JSON.parse(this.dataWidget);
    this.documentRithmId = dataWidget.documentRithmId;
    this.documentColumns = dataWidget.columns || [];
  }

  /** Get context drawer. */
  private getDrawerContext(): void {
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
    this.toggleDrawer.emit(+this.dataDocumentWidget.questions.length);
  }

  /** Clean subscriptions. */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
