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
  DashboardItem,
  DocumentWidget,
  Question,
  QuestionFieldType,
  reloadStationFlow,
  WidgetType,
} from 'src/models';
import { Router } from '@angular/router';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { takeUntil } from 'rxjs/operators';

/** Local interface to display question and html value. */
export interface QuestionValuesColumn {
  /**Value html */
  value: string | null;
  /**All question information */
  detail: Question;
}

/**
 * Component for list field the document how widget.
 */
@Component({
  selector:
    'app-document-widget[dataWidget][editMode][showButtonSetting][widgetItem]',
  templateUrl: './document-widget.component.html',
  styleUrls: ['./document-widget.component.scss'],
})
export class DocumentWidgetComponent implements OnInit, OnDestroy {
  /** All data of widget. */
  @Input() widgetItem!: DashboardItem;

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

  /** A setter for the stationFlow property to reload document when its flowed. */
  @Input() set stationFlow(value: reloadStationFlow) {
    if (this.documentRithmId) {
      if (value && this.documentRithmId === value.documentFlow) {
        this.getDocumentWidget();
      }
    }
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
  enumWidgetType = WidgetType;

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
          this.errorService.logError(error);
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

  /**
   * Get questions values by document columns.
   *
   * @returns An array with question values.
   */
  get getValueQuestions(): QuestionValuesColumn[] {
    const questions: QuestionValuesColumn[] = [];
    this.documentColumns.forEach((column) => {
      this.dataDocumentWidget.questions.forEach((questionList) => {
        const question = questionList.questions.find(
          (q) => q.rithmId === column.questionId
        );
        if (question) {
          questions.push({
            detail: question,
            value: this.getHTMLQuestionValue(question),
          });
        }
      });
    });
    return questions;
  }

  /**
   * Get value to show by each question.
   *
   * @param question Question to validate.
   * @returns String value to show on HTML.
   */
  private getHTMLQuestionValue(question: Question): string | null {
    if (question.questionType === this.questionFieldType.Select) {
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

    if (
      question.questionType === this.questionFieldType.CheckList ||
      question.questionType === this.questionFieldType.MultiSelect
    ) {
      if (question?.answer?.asArray?.length) {
        const values: string[] = [];
        question?.answer?.asArray?.map((answer) => {
          values.push(
            `<i class="fas ${
              answer.isChecked
                ? 'fa-check-square text-accent-500'
                : 'fa-square text-secondary-500'
            }"></i> ${answer.value}`
          );
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

  /** Clean subscriptions. */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
