import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { first, Subject } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import {
  ColumnFieldsWidget,
  StationWidgetData,
  ColumnsDocumentInfo,
  QuestionFieldType,
  ColumnsLogicWidget,
  WidgetType,
  DocumentImage,
  StationRosterMember,
  Question,
  WidgetDocument,
} from 'src/models';
import { UtcTimeConversion } from 'src/helpers';
import { PopupService } from 'src/app/core/popup.service';
import { DocumentComponent } from 'src/app/document/document/document.component';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { takeUntil } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';

/** Represents data of columns. */
interface DataTableValues {
  /** RithmId of the document. */
  rithmId: string;
  /** Key reference of field column basic or questionRithmId. */
  [key: string]: string | number | StationRosterMember | null;
}

/** Represents data of columns. */
interface ColumnsSpecificOfWidget {
  /** Key reference of field column basic or questionRithmId. */
  keyReference: string;
  /** Header title. */
  headerTitle: string;
  /** Type of value. */
  type: 'basic' | 'question';
  /** Enum of questions types. */
  typeQuestion?: QuestionFieldType;
}

/**
 * Component for Station widget.
 */
@Component({
  selector:
    'app-station-widget[dataWidget][editMode][widgetType][showButtonSetting]',
  templateUrl: './station-widget.component.html',
  styleUrls: ['./station-widget.component.scss'],
  providers: [UtcTimeConversion],
})
export class StationWidgetComponent implements OnInit, OnDestroy {
  /** Reference to sort table. */
  @ViewChild(MatSort) set tableSort(value: MatSort) {
    if (value) {
      this.dataSourceTable.sort = value;
    }
  }

  /** The component for the document info header. */
  @ViewChild(DocumentComponent, { static: false })
  documentComponent!: DocumentComponent;

  /** To load dom by WidgetType. */
  @Input() widgetType: WidgetType = WidgetType.Station;

  /** Show setting button widget. */
  @Input() showButtonSetting = false;

  /** Image to banner. */
  @Input() image!: DocumentImage;

  /** Data widget. */
  private _dataWidget = '';

  /** Set data for station widget. */
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

  /** EditMode the widget. */
  private _editMode = false;

  /** Set edit mode toggle from dashboard. */
  @Input() set editMode(value: boolean) {
    this._editMode = value;
    if (value && this.isDocument) {
      this.viewDocument('');
    }
  }

  /**
   * Get edit mode toggle from dashboard.
   *
   * @returns Boolean to edit mode.
   */
  get editMode(): boolean {
    return this._editMode;
  }

  /** Open drawer. */
  @Output() toggleDrawer = new EventEmitter<number>();

  /** If expand or not the widget. */
  @Output() expandWidget = new EventEmitter<boolean>();

  /**
   * Whether the drawer is open.
   *
   * @returns True if the drawer is open, false otherwise.
   */
  get isDrawerOpen(): boolean {
    return this.sidenavDrawerService.isDrawerOpen;
  }

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Interface for list data in widget. */
  dataSourceTable!: MatTableDataSource<DataTableValues>;

  /** Columns for list the widget. */
  columnsAllField: ColumnFieldsWidget[] = [];

  /** Columns specific of station widget. */
  columnsSpecificOfWidget: ColumnsSpecificOfWidget[] = [];

  /** Enum with types widget station. */
  enumWidgetType = WidgetType;

  /** Data to station widget. */
  dataStationWidget!: StationWidgetData;

  /** The enum question field type. */
  questionFieldType = QuestionFieldType;

  /** The enum document columns info. */
  columnsDocumentInfo = ColumnsDocumentInfo;

  /** Show error loading widget. */
  failedLoadWidget = false;

  /** Loading documents of station. */
  isLoading = false;

  /** To set its expanded the widget. */
  isExpandWidget = false;

  /** Update document list when a new document is created. */
  reloadDocumentList = false;

  /** Variable to show if the error message should be displayed. */
  displayDocumentError = false;

  /** View detail document. */
  isDocument = false;

  /** Type of drawer opened. */
  drawerContext!: string;

  /** Document id selected for view. */
  documentIdSelected = '';

  /** StationRithmId for station widget. */
  stationRithmId = '';

  /** Columns for petition. */
  columnsFieldPetition: string[] = [];

  /** Key names of the columns to mat-table. */
  columnsToDisplayTable: string[] = [];

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService,
    private utcTimeConversion: UtcTimeConversion,
    private popupService: PopupService,
    private sidenavDrawerService: SidenavDrawerService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.stationRithmId = JSON.parse(this.dataWidget).stationRithmId;
    this.subscribeDrawerContext$();
    this.parseDataColumnsWidget();
    this.getStationWidgetDocuments();
  }

  /** Get context drawer. */
  private subscribeDrawerContext$(): void {
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((drawerContext) => {
        this.drawerContext = drawerContext;
      });
  }

  /** Parse data of columns widget. */
  parseDataColumnsWidget(): void {
    this.columnsToDisplayTable = [];
    this.columnsFieldPetition = [];
    this.columnsAllField = [];
    const columns = JSON.parse(this.dataWidget)
      ?.columns as ColumnFieldsWidget[];

    // Group columns
    this.columnsAllField =
      this.dashboardService.groupColumnsStationWidget(columns);

    this.columnsAllField.map((data: ColumnFieldsWidget) => {
      if (data.questionId) {
        this.columnsFieldPetition.push(data.questionId);
      }
    });
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
          this.generateDataTable();
        },
        error: (error: unknown) => {
          this.failedLoadWidget = true;
          this.isLoading = false;
          this.errorService.logError(error);
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
    let timeInStation: string;
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
    }
    if (this.isExpandWidget) {
      this.toggleExpandWidget();
    }
  }

  /**
   * Reload list of documents.
   *
   * @param isReturnListDocuments To return to list of documents, true to reload list.
   * @param isReloadListDocuments Reload list of documents when click to see list.
   */
  widgetReloadListDocuments(
    isReturnListDocuments: boolean,
    isReloadListDocuments: boolean
  ): void {
    if (isReloadListDocuments) {
      this.reloadDocumentList = isReloadListDocuments;
    } else {
      this.viewDocument('', isReturnListDocuments);
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
          this.popupService.notify(
            'The document has been created successfully.'
          );
          if (
            this.widgetType === this.enumWidgetType.Station ||
            this.widgetType === this.enumWidgetType.StationTableBanner
          ) {
            this.viewDocument(documentRithmId);
            this.reloadDocumentList = true;
          } else {
            this.getStationWidgetDocuments();
          }
          this.isLoading = false;
          this.displayDocumentError = false;
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
    this.toggleDrawer.emit(+this.dataStationWidget.documents.length);
  }

  /** Expand widget. */
  toggleExpandWidget(): void {
    this.isExpandWidget = !this.isExpandWidget;
    this.expandWidget.emit(this.isExpandWidget);
  }

  /**
   * Get specific name of column document when is not have questionId.
   *
   * @param name String, name of the column to search specific value.
   * @returns String to show name of the document in dom.
   */
  private getColumnBasicName(name: string): string {
    const nameDom = this.dashboardService.columnsDocumentInfo.find(
      (column) => column.key === name
    ) as ColumnsLogicWidget;
    return nameDom.name;
  }

  /** Parse documents to generate unique data specific. */
  private generateDataTable(): void {
    // Clear data
    this.columnsToDisplayTable = [];
    this.columnsSpecificOfWidget = [];
    const dataTemp: DataTableValues[] = [];

    // set data default if columns widget are empty
    if (!this.columnsAllField.length) {
      this.columnsAllField.push({
        name: this.columnsDocumentInfo.Name,
      });
      if (
        this.widgetType === this.enumWidgetType.StationMultilineBanner ||
        this.widgetType === this.enumWidgetType.StationMultiline
      ) {
        this.columnsAllField.push({
          name: this.columnsDocumentInfo.LastUpdated,
        });
        this.columnsAllField.push({
          name: this.columnsDocumentInfo.AssignedUser,
        });
      }
    }

    // Set data table
    this.columnsAllField.map((column) => {
      // set data type question
      if (column?.questionId) {
        const question = this.getColumnQuestion(column.questionId);
        const key = question?.rithmId || (column.questionId as string);
        this.columnsToDisplayTable.push(key);
        this.columnsSpecificOfWidget.push({
          headerTitle: question?.prompt || column.name,
          keyReference: key,
          type: 'question',
          typeQuestion: question?.questionType,
        });
        this.dataStationWidget.documents.map((document, index) => {
          dataTemp[index] = {
            ...dataTemp[index],
            rithmId: document.rithmId,
            [key]: this.getValueQuestion(key, document),
          };
        });
      } else {
        // set data type column basic
        const nameColumn = column.name as ColumnsDocumentInfo;
        this.columnsToDisplayTable.push(nameColumn);
        this.columnsSpecificOfWidget.push({
          headerTitle: this.getColumnBasicName(nameColumn),
          keyReference: nameColumn,
          type: 'basic',
        });
        this.dataStationWidget.documents.map((document, index) => {
          dataTemp[index] = {
            ...dataTemp[index],
            rithmId: document.rithmId,
            [nameColumn]: document[nameColumn],
          };
        });
      }
    });

    // push data to dataSourceTable
    this.columnsToDisplayTable.push('viewDocument');
    this.dataSourceTable = new MatTableDataSource(dataTemp);
  }

  /**
   * Get question value by type.
   *
   * @param questionRithmId Question rithmId.
   * @param document Document to search question.
   * @returns A string with value or a QuestionAnswer with multiple values.
   */
  private getValueQuestion(
    questionRithmId: string,
    document: WidgetDocument
  ): string | null {
    const question = document.questions[0]?.questions?.find(
      (questionDocument) => questionDocument.rithmId === questionRithmId
    );
    if (question) {
      if (
        question.questionType === this.questionFieldType.CheckList ||
        question.questionType === this.questionFieldType.MultiSelect ||
        question.questionType === this.questionFieldType.Select
      ) {
        if (question?.answer?.asArray?.length) {
          if (!question?.answer?.asArray?.some((check) => check.isChecked)) {
            return '---';
          }
          const values: string[] = [];
          question?.answer?.asArray?.map((answer) => {
            if (answer.isChecked) {
              values.push(answer.value);
            }
          });
          return values.join('<br>') || null;
        }
        return null;
      }
      if (question.questionType === this.questionFieldType.Instructions) {
        return question.prompt || null;
      }
      return question?.answer?.value || null;
    }
    return null;
  }

  /**
   * Get specific name of column document when have questionId.
   *
   * @param questionRithmId Data for column questionRithmId.
   * @returns Found question or null fin not exist.
   */
  private getColumnQuestion(questionRithmId: string): Question | null {
    for (let i = 0; i < this.dataStationWidget.documents.length; i++) {
      const questionData = this.dataStationWidget.documents[
        i
      ].questions[0]?.questions?.find(
        (question) => question.rithmId === questionRithmId
      );
      if (questionData) {
        return questionData;
      }
    }
    return null;
  }

  /**
   * Navigate the user to the document page.
   *
   * @param documentId The Id of the document to view.
   */
  goToDocument(documentId: string): void {
    this.router.navigate(['/', 'document', documentId], {
      queryParams: {
        documentId,
        stationId: this.stationRithmId,
      },
    });
  }

  /** Clean subscriptions. */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
