import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  Question,
  StationColumnWidget,
  WidgetDrawerStationData,
} from 'src/models';
import { ColumnsDocumentInfo } from 'src/models/enums/columns-document-info';
import { StationService } from 'src/app/core/station.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { ErrorService } from 'src/app/core/error.service';

interface OptionsSelect {
  /** If disabled option in select. */
  disabled: boolean;
  /** Name option. */
  name: string;
  /** Value option. */
  value: string;
  /** QuestionId option. */
  questionId?: string;
}

/**
 * Component for Station widget drawer.
 */
@Component({
  selector: 'app-station-widget-drawer',
  templateUrl: './station-widget-drawer.component.html',
  styleUrls: ['./station-widget-drawer.component.scss'],
})
export class StationWidgetDrawerComponent implements OnInit, OnDestroy {
  /** Form. */
  formColumns: FormGroup = new FormGroup({
    columns: new FormArray([]),
  });

  /** Station RithmId. */
  stationRithmId!: string;

  /** Station columns. */
  stationColumns!: StationColumnWidget[];

  /** Position of the widget. */
  widgetIndex!: number;

  questions!: Question[];

  /** Loading document. */
  isLoading = false;

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Enum of columns statics. */
  columnsDocumentInfo = ColumnsDocumentInfo;

  /** Static columns. */
  documentInfo: OptionsSelect[] = [];

  /** Document fields. */
  documentFields: OptionsSelect[] = [];

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private stationService: StationService,
    private dashboardService: DashboardService,
    private errorService: ErrorService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as {
          /** Station data. */
          stationData: string;
          /** Position of the widget. */
          widgetIndex: number;
        };
        if (dataDrawer) {
          const stationData = JSON.parse(
            dataDrawer.stationData
          ) as WidgetDrawerStationData;
          this.stationRithmId = stationData.stationRithmId;
          this.stationColumns = stationData.columns;
          this.widgetIndex = dataDrawer.widgetIndex;
          this.getDocumentFields();
        }
      });

    this.dashboardService.isLoadingDashboard$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((status) => {
        this.isLoading = status;
      });
  }

  /** Set document info static. */
  setDocumentInfo(): void {
    this.documentInfo = [];
    Object.values(this.columnsDocumentInfo).map((column) => {
      this.documentInfo.push({
        name: column,
        disabled: this.checkExistColumn(column, 'name'),
        value: column,
      });
    });
  }

  /** Set document fields dynamic. */
  setDocumentFields(): void {
    this.documentFields = [];
    this.questions.map((question) => {
      this.documentFields.push({
        name: question.prompt,
        value: question.rithmId,
        disabled: this.checkExistColumn(question.rithmId, 'questionId'),
        questionId: question.rithmId,
      });
    });
  }

  /**
   * Check if exist column in stationColumns.
   *
   * @param column Column to check.
   * @param type Column to check.
   * @returns Boolean If its true disabled option.
   */
  checkExistColumn(column: string, type: 'name' | 'questionId'): boolean {
    let check;
    if (type === 'name') {
      check = !!this.stationColumns.find(
        (stationColumn) =>
          stationColumn[type] === column && !stationColumn.questionId
      );
    } else {
      check = !!this.stationColumns.find(
        (stationColumn) => stationColumn[type] === column
      );
    }
    return check;
  }

  /**
   * Get array form.
   *
   * @returns FormArray to ngFor.
   */
  get getFormColumns(): FormArray {
    return this.formColumns.get('columns') as FormArray;
  }

  /**
   * Add new column.
   *
   * @param name Name of the column.
   * @param questionId QuestionId of the column.
   */
  addNewColumn(name = '', questionId = ''): void {
    const value = questionId ? questionId : name;
    this.getFormColumns.push(
      new FormGroup({
        name: new FormControl(value),
      })
    );
  }

  /**
   * Delete column select of the form and columns widget.
   *
   * @param indexColumn Number of the column to delete.
   */
  deleteColumn(indexColumn: number): void {
    this.stationColumns.splice(indexColumn, 1);
    this.getFormColumns.removeAt(indexColumn);
    this.updateWidget();
  }

  /** Load list of selects. */
  loadColumnsSelect(): void {
    this.setDocumentInfo();
    this.setDocumentFields();
    this.getFormColumns.clear();
    this.stationColumns.map((column) => {
      this.addNewColumn(column.name, column.questionId);
    });
  }

  /** Get station questions. */
  getDocumentFields(): void {
    this.isLoading = true;
    this.stationService
      .getStationQuestions(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (questions) => {
          this.questions = questions;
          this.loadColumnsSelect();
          this.isLoading = false;
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

  /**
   * When click in select, save the column.
   *
   * @param value Data selected.
   * @param indexColumn Number of the column to delete.
   */
  optionSelected(value: OptionsSelect, indexColumn: number): void {
    if (!value.disabled) {
      const dataColumn: StationColumnWidget = value.questionId
        ? {
            name: value.name,
            questionId: value.questionId,
          }
        : {
            name: value.value,
          };
      if (this.stationColumns[indexColumn]) {
        this.stationColumns[indexColumn] = dataColumn;
      } else {
        this.stationColumns.push(dataColumn);
      }
      this.updateWidget();
    }
  }

  /** Update widget. */
  updateWidget(): void {
    this.loadColumnsSelect();
    const dataWidget = JSON.stringify({
      stationRithmId: this.stationRithmId,
      columns: this.stationColumns,
    });
    this.dashboardService.updateDashboardWidgets(this.widgetIndex, dataWidget);
  }

  /**
   * Disable button new column.
   *
   * @returns True if all options is selected.
   */
  get disabledNewColumn(): boolean {
    const allSelects = [...this.documentInfo, ...this.documentFields];
    const isDisabled = !allSelects.find((option) => !option.disabled);
    const isAllInputs =
      allSelects.length === this.getFormColumns.controls.length;
    return isDisabled || isAllInputs;
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
