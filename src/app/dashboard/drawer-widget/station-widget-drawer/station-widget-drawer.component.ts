import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DashboardItem,
  Question,
  ColumnFieldsWidget,
  EditDataWidget,
  OptionsSelectWidgetDrawer,
} from 'src/models';
import { StationService } from 'src/app/core/station.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { ErrorService } from 'src/app/core/error.service';

/**
 * Component for Station widget drawer.
 */
@Component({
  selector: 'app-station-widget-drawer',
  templateUrl: './station-widget-drawer.component.html',
  styleUrls: ['./station-widget-drawer.component.scss'],
})
export class StationWidgetDrawerComponent implements OnInit, OnDestroy {
  /** Form for fields the select. */
  formColumns: FormGroup = new FormGroup({
    columns: new FormArray([]),
  });

  /** All data of the widget. */
  widgetItem!: DashboardItem;

  /** Station RithmId. */
  stationRithmId!: string;

  /** Station columns. */
  stationColumns!: ColumnFieldsWidget[];

  /** Position of the widget. */
  widgetIndex!: number;

  /** Questions the station. */
  questions!: Question[];

  /** Loading document. */
  isLoading = false;

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Static columns. */
  documentInfo: OptionsSelectWidgetDrawer[] = [];

  /** Document fields. */
  documentFields: OptionsSelectWidgetDrawer[] = [];

  /** Loading error. */
  loadingError = false;

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
        const dataDrawer = data as EditDataWidget;
        if (dataDrawer) {
          this.widgetItem = dataDrawer.widgetItem;
          const dataWidget = JSON.parse(this.widgetItem.data);
          this.stationColumns = dataWidget.columns || [];
          this.stationRithmId = dataWidget.stationRithmId;
          this.widgetIndex = dataDrawer.widgetIndex;
          this.getDocumentFields();
        }
      });

    this.dashboardService.isLoadingDashboard$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(({ statusLoading }) => {
        this.isLoading = statusLoading;
      });
  }

  /** Set document info static. */
  private setDocumentInfo(): void {
    this.documentInfo = [];
    this.dashboardService.columnsDocumentInfo.map((column) => {
      this.documentInfo.push({
        name: column.name,
        disabled: this.checkExistColumn(column.key, 'name'),
        value: column.key,
      });
    });
  }

  /** Set document fields dynamic. */
  private setDocumentFields(): void {
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
  private checkExistColumn(
    column: string,
    type: 'name' | 'questionId'
  ): boolean {
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
        name: new FormControl(value, Validators.required),
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
  private loadColumnsSelect(): void {
    this.setDocumentInfo();
    this.setDocumentFields();
    this.getFormColumns.clear();
    this.stationColumns.map((column) => {
      this.addNewColumn(column.name, column.questionId);
    });
    if (!this.stationColumns.length) {
      this.addNewColumn();
    }
  }

  /** Check if questionId exists in question.rithmId. */
  private checkStationColumns(): void {
    const newStationColumn: ColumnFieldsWidget[] = [];
    this.stationColumns.map((column) => {
      if (column.questionId) {
        this.questions.map((question) => {
          if (column.questionId === question.rithmId) {
            newStationColumn.push(column);
          }
        });
      } else {
        newStationColumn.push(column);
      }
    });
    this.stationColumns = newStationColumn;
  }

  /** Get station questions. */
  private getDocumentFields(): void {
    this.isLoading = true;
    this.loadingError = false;
    this.stationService
      .getStationQuestions(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (questions) => {
          this.questions = questions;
          this.checkStationColumns();
          this.loadColumnsSelect();
          this.isLoading = false;
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.loadingError = true;
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
  optionSelected(value: OptionsSelectWidgetDrawer, indexColumn: number): void {
    if (!value.disabled) {
      const dataColumn: ColumnFieldsWidget = value.questionId
        ? {
            name: value.name,
            questionId: value.questionId,
          }
        : {
            name: value.value,
          };
      this.stationColumns[indexColumn]
        ? (this.stationColumns[indexColumn] = dataColumn)
        : this.stationColumns.push(dataColumn);

      this.updateWidget();
    }
  }

  /** Update widget. */
  private updateWidget(): void {
    this.loadColumnsSelect();
    this.widgetItem.data = JSON.stringify({
      stationRithmId: this.stationRithmId,
      columns: this.stationColumns,
    });
    this.dashboardService.updateDashboardWidgets({
      widgetItem: this.widgetItem,
      widgetIndex: this.widgetIndex,
      isCloseDrawer: false,
    });
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
    return isDisabled || isAllInputs || this.getFormColumns.invalid;
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
