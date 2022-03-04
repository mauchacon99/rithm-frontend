import {
  Component,
  EventEmitter,
  OnDestroy,
  ViewEncapsulation,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { first } from 'rxjs/operators';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import {
  ColumnFieldsWidget,
  DashboardItem,
  EditDataWidget,
  QuestionList,
} from 'src/models';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

/**
 * Component for Station widget drawer.
 */
@Component({
  selector: 'app-document-widget-drawer',
  templateUrl: './document-widget-drawer.component.html',
  styleUrls: ['./document-widget-drawer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentWidgetDrawerComponent implements OnInit, OnDestroy {
  /** Emit widgetIndex to widget-drawer. */
  @Output() setWidgetIndex = new EventEmitter<number>();

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Form to multiselect columns to document. */
  formColumns = new FormControl();

  /** Widget item of opened widget-drawer. */
  widgetItem!: DashboardItem;

  /** Questions the document. */
  questions!: QuestionList[];

  /** Document RithmId. */
  documentRithmId!: string;

  /** Widget index of opened widget-drawer. */
  widgetIndex!: number;

  /** Element list in drawer. */
  quantityElementsWidget = 0;

  /** Loading drawer. */
  isLoading = false;

  /** Columns list to display in select. */
  documentFields: ColumnFieldsWidget[] = [];

  /** Document columns. */
  documentColumns: ColumnFieldsWidget[] = [];

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private documentService: DocumentService,
    private errorService: ErrorService,
    private dashboardService: DashboardService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.subscribeDrawerData$();
  }

  /** Get data the sidenavDrawerService. */
  private subscribeDrawerData$(): void {
    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as EditDataWidget;
        if (dataDrawer) {
          this.widgetItem = dataDrawer.widgetItem;
          this.widgetIndex = dataDrawer.widgetIndex;
          this.quantityElementsWidget = dataDrawer.quantityElementsWidget;
          const dataWidget = JSON.parse(this.widgetItem.data);
          this.documentColumns = dataWidget.columns || [];
          this.documentRithmId = dataWidget.documentRithmId;
          this.setWidgetIndex.emit(this.widgetIndex);
          this.getDocumentWidget();
        }
      });
  }

  /** Get document widget. */
  private getDocumentWidget(): void {
    this.isLoading = true;
    this.documentService
      .getDocumentWidget(this.documentRithmId)
      .pipe(first())
      .subscribe({
        next: (documentWidget) => {
          this.isLoading = false;
          this.questions = documentWidget.questions;
          this.loadColumnsSelect();
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /** Load list of selects. */
  private loadColumnsSelect(): void {
    this.formColumns.reset();
    this.documentFields = [];
    const dataForm: string[] = [];
    this.questions.map((questionList) => {
      questionList.questions.map((question) => {
        this.documentFields.push({
          name: question.prompt,
          questionId: question.rithmId,
        });
        if (!this.documentColumns.length) {
          dataForm.push(question.rithmId);
        }
      });
    });
    if (this.documentColumns.length) {
      this.documentColumns.map((column) => {
        dataForm.push(column.questionId as string);
      });
    }
    this.formColumns.setValue(dataForm);
  }

  /** Update widget. */
  updateWidget(): void {
    this.documentColumns = [];
    this.formColumns.value.map((questionId: string) => {
      this.documentColumns.push({
        name: 'Question Document',
        questionId,
      });
    });
    this.widgetItem.data = JSON.stringify({
      documentRithmId: this.documentRithmId,
      columns: this.documentColumns,
    });
    this.loadColumnsSelect();
    this.dashboardService.updateDashboardWidgets({
      widgetItem: this.widgetItem,
      widgetIndex: this.widgetIndex,
      quantityElementsWidget: this.quantityElementsWidget,
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
