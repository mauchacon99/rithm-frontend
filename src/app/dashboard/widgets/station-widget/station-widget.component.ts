import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { first, Subject } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import {
  ColumnFieldsWidget,
  StationWidgetData,
  ColumnsLogicDocument,
  ColumnsDocumentInfo,
  QuestionFieldType,
  Question,
} from 'src/models';
import { UtcTimeConversion } from 'src/helpers';
import { PopupService } from 'src/app/core/popup.service';
import { DocumentComponent } from 'src/app/document/document/document.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { takeUntil } from 'rxjs/operators';
import { DashboardService } from '../../dashboard.service';

/**
 * Component for Station widget.
 */
@Component({
  selector: 'app-station-widget[dataWidget][editMode]',
  templateUrl: './station-widget.component.html',
  styleUrls: ['./station-widget.component.scss'],
  providers: [UtcTimeConversion],
})
export class StationWidgetComponent implements OnInit, OnDestroy, OnChanges {
  /** The component for the document info header. */
  @ViewChild(DocumentComponent, { static: false })
  documentComponent!: DocumentComponent;

  private _dataWidget = '';

  /**
   * Set data for station widget.
   */
  @Input() set dataWidget(value: string) {
    this._dataWidget = value;
    if (this.stationRithmId) {
      this.parseDataColumnsWidget();
      this.getStationWidgetDocuments();
    }
  }

  /**
   * Get data for station widget.
   *
   * @returns Data for station widget.
   */
  get dataWidget(): string {
    return this._dataWidget;
  }

  /** Open drawer. */
  @Output() toggleDrawer = new EventEmitter<void>();

  /** Edit mode toggle from dashboard. */
  @Input() editMode = false;

  /** If expand or not the widget. */
  @Output() expandWidget = new EventEmitter<boolean>();

  /** StationRithmId for station widget. */
  stationRithmId = '';

  /** Columns for list the widget. */
  columnsAllField: ColumnFieldsWidget[] = [];

  /** Columns for petition. */
  columnsFieldPetition: string[] = [];

  /** To set its expanded the widget. */
  isExpandWidget = false;

  /** Key names of the columns to mat-table. */
  columnsToDisplayTable: string[] = [];

  /** Data to station widget. */
  dataStationWidget!: StationWidgetData;

  /** Show error loading widget. */
  failedLoadWidget = false;

  /** Loading documents of station. */
  isLoading = false;

  /** View detail document. */
  isDocument = false;

  /** Document id selected for view. */
  documentIdSelected = '';

  /** Update document list when a new document is created. */
  reloadDocumentList = false;

  /** Variable to show if the error message should be displayed. */
  displayDocumentError = false;

  private destroyed$ = new Subject<void>();

  /** Type of drawer opened. */
  drawerContext!: string;

  /** The enum question field type. */
  questionFieldType = QuestionFieldType;

  /** The enum document columns info. */
  columnsDocumentInfo = ColumnsDocumentInfo;

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService,
    private utcTimeConversion: UtcTimeConversion,
    private popupService: PopupService,
    private sidenavDrawerService: SidenavDrawerService,
    private dashboardService: DashboardService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.stationRithmId = JSON.parse(this.dataWidget).stationRithmId;
    this.parseDataColumnsWidget();
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((drawerContext) => {
        this.drawerContext = drawerContext;
      });

    this.getStationWidgetDocuments();
  }

  /** Parse data of columns widget. */
  parseDataColumnsWidget(): void {
    this.columnsToDisplayTable = [];
    this.columnsAllField = JSON.parse(this.dataWidget)?.columns;
    this.columnsAllField.filter((data: ColumnFieldsWidget) => {
      if (data.questionId) {
        this.columnsFieldPetition.push(data.questionId);
        this.columnsToDisplayTable.push(data.questionId);
      } else {
        this.columnsToDisplayTable.push(data.name);
      }
    });
    if (!this.columnsAllField.length) {
      this.columnsToDisplayTable.push('name');
    }
    this.columnsToDisplayTable.push('viewDocument');
  }

  /**
   * Detect changes of this component.
   *
   * @param changes Object of the properties in this component.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.editMode && this.isDocument) {
      this.viewDocument('', true);
    }
  }

  /**
   * Get document for station widgets.
   */
  getStationWidgetDocuments(): void {
    this.failedLoadWidget = false;
    this.isLoading = true;
    this.documentService
      .getStationWidgetDocuments(this.stationRithmId, this.columnsFieldPetition)
      .pipe(first())
      .subscribe({
        next: (dataStationWidget) => {
          this.isLoading = false;
          this.failedLoadWidget = false;
          this.dataStationWidget = dataStationWidget;
        },
        error: (error: unknown) => {
          this.failedLoadWidget = true;
          this.isLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Uses the helper: UtcTimeConversion.
   * Tells how long a document has been in a station for.
   *
   * @param timeEntered Reflects time a document entered a station.
   * @returns A string reading something like "4 days" or "32 minutes".
   */
  getElapsedTime(timeEntered: string): string {
    let timeInStation = '';
    if (timeEntered && timeEntered !== 'Unknown') {
      timeInStation = this.utcTimeConversion.getElapsedTimeText(
        this.utcTimeConversion.getMillisecondsElapsed(timeEntered)
      );
      if (timeInStation === '1 day') {
        timeInStation = ' Yesterday';
      } else {
        timeInStation += ' ago';
      }
    } else {
      timeInStation = 'None';
    }
    return timeInStation;
  }

  /**
   * View detail document.
   *
   * @param documentRithmId String of document rithmId.
   * @param reloadDocuments Boolean when is true, reload the documents.
   */
  viewDocument(documentRithmId: string, reloadDocuments = false): void {
    this.documentIdSelected = documentRithmId;
    this.isDocument = !this.isDocument;
    if (this.reloadDocumentList || reloadDocuments) {
      this.getStationWidgetDocuments();
      this.reloadDocumentList = false;
      if (this.isExpandWidget) {
        this.toggleExpandWidget();
      }
    }
  }

  /**
   * Create a new document.
   */
  createNewDocument(): void {
    this.isLoading = true;
    this.displayDocumentError = false;
    this.documentService
      .createNewDocument('', 0, this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (documentRithmId) => {
          this.viewDocument(documentRithmId);
          this.reloadDocumentList = true;
          this.isLoading = false;
          this.displayDocumentError = false;
          this.popupService.notify(
            'The document has been created successfully.'
          );
        },
        error: (error: unknown) => {
          this.displayDocumentError = true;
          this.isLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /** Toggle drawer when click on edit station widget. */
  toggleEditStation(): void {
    this.toggleDrawer.emit();
  }

  /** Expand widget. */
  toggleExpandWidget(): void {
    this.isExpandWidget = !this.isExpandWidget;
    this.expandWidget.emit(this.isExpandWidget);
  }

  /**
   * Whether the drawer is open.
   *
   * @returns True if the drawer is open, false otherwise.
   */
  get isDrawerOpen(): boolean {
    return this.sidenavDrawerService.isDrawerOpen;
  }

  /**
   * Get specific name of column document when is not have questionId.
   *
   * @param name String, name of the column to search specific value.
   * @returns String to show name of the document in dom.
   */
  getColumnBasicName(name: string): string {
    const nameDom = this.dashboardService.columnsDocumentInfo.find(
      (column) => column.key === name
    ) as ColumnsLogicDocument;
    return nameDom.name;
  }

  /** Clean subscriptions. */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
