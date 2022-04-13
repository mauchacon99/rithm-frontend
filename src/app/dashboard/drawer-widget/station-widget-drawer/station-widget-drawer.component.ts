import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DashboardItem,
  Question,
  ColumnFieldsWidget,
  EditDataWidget,
  OptionsSelectWidgetDrawer,
  DocumentImage,
  WidgetType,
  ColumnsDocumentInfo,
  QuestionFieldType,
} from 'src/models';
import { StationService } from 'src/app/core/station.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';

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

  /** Image to banner. */
  @Input() set image(value: DocumentImage) {
    if (
      this.dataDrawerStation?.widgetItem &&
      this.dataDrawerStation.widgetItem.imageId !== value.imageId
    ) {
      this.dataDrawerStation.widgetItem.imageId = value.imageId;
      this.dataDrawerStation.widgetItem.imageName = value.imageName;
      this.updateWidget();
    }
  }

  /** Emit widgetIndex to widget-drawer. */
  @Output() getWidgetIndex = new EventEmitter<number>();

  /** WidgetType of item. */
  @Output() getWidgetItem = new EventEmitter<DashboardItem>();

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
   * Get array form.
   *
   * @returns FormArray to ngFor.
   */
  get getFormColumns(): FormArray {
    return this.formColumns.get('columns') as FormArray;
  }

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Station columns. */
  stationColumns!: ColumnFieldsWidget[];

  /** Questions the station. */
  questions!: Question[];

  /** Data drawer station. */
  dataDrawerStation!: EditDataWidget;

  /** Static columns. */
  documentInfo: OptionsSelectWidgetDrawer[] = [];

  /** Document fields. */
  documentFields: OptionsSelectWidgetDrawer[] = [];

  /** Document fields for third select, only station multiline. */
  documentFieldsThirdSelect: OptionsSelectWidgetDrawer[] = [];

  /** Station RithmId. */
  stationRithmId!: string;

  /** Loading drawer. */
  isLoading = false;

  /** Loading error. */
  failedLoadDrawer = false;

  /** Enum widgetType. */
  enumWidgetType = WidgetType;

  /** Enum questions type. */
  enumQuestionFieldType = QuestionFieldType;

  /** Enum ColumnsDocumentInfo. */
  enumColumnsDocumentInfo = ColumnsDocumentInfo;

  /**
   * Check if station is multiline.
   *
   * @returns Boolean true if station is multiline.
   */
  get isStationMultiline(): boolean {
    return (
      this.dataDrawerStation.widgetItem.widgetType ===
        this.enumWidgetType.StationMultiline ||
      this.dataDrawerStation.widgetItem.widgetType ===
        this.enumWidgetType.StationMultilineBanner
    );
  }

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
    this.subscribeDrawerData$();
  }

  /** Get data the sidenavDrawerService. */
  private subscribeDrawerData$(): void {
    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as EditDataWidget;
        if (dataDrawer) {
          this.dataDrawerStation = dataDrawer;
          const dataWidget = JSON.parse(this.dataDrawerStation.widgetItem.data);
          this.stationColumns = dataWidget.columns || [];
          this.stationRithmId = dataWidget.stationRithmId;
          this.getWidgetIndex.emit(this.dataDrawerStation.widgetIndex);
          this.getWidgetItem.emit(this.dataDrawerStation.widgetItem);
          this.getDocumentFields();
        }
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
    this.questions?.map((question) => {
      if (question.questionType !== this.enumQuestionFieldType.File) {
        let isDisabledQuestionOrStation =
          this.checkTypeQuestionAndStation(question);
        this.documentFields.push({
          name: question.prompt,
          value: question.rithmId,
          disabled: isDisabledQuestionOrStation
            ? isDisabledQuestionOrStation
            : this.checkExistColumn(question.rithmId, 'questionId'),
          questionId: question.rithmId,
        });
        if (this.isStationMultiline) {
          isDisabledQuestionOrStation = this.checkTypeQuestionAndStation(
            question,
            true
          );
          this.documentFieldsThirdSelect.push({
            name: question.prompt,
            value: question.rithmId,
            disabled: isDisabledQuestionOrStation
              ? isDisabledQuestionOrStation
              : this.checkExistColumn(question.rithmId, 'questionId'),
            questionId: question.rithmId,
          });
        }
      }
    });
  }

  /**
   * Check type of question and type of station.
   *
   * @param question Question to check.
   * @param isThirdSelect Boolean true if its third select.
   * @returns A boolean, true if station is Multiline and check is invalid question type.
   */
  private checkTypeQuestionAndStation(
    question: Question,
    isThirdSelect = false
  ): boolean {
    if (this.isStationMultiline) {
      if (!isThirdSelect) {
        return (
          question.questionType === this.enumQuestionFieldType.Select ||
          question.questionType === this.enumQuestionFieldType.MultiSelect ||
          question.questionType === this.enumQuestionFieldType.CheckList ||
          question.questionType === this.enumQuestionFieldType.Checkbox ||
          question.questionType === this.enumQuestionFieldType.LongText ||
          question.questionType === this.enumQuestionFieldType.AddressLine ||
          question.questionType === this.enumQuestionFieldType.URL ||
          question.questionType === this.enumQuestionFieldType.DataLink
        );
      } else {
        return (
          question.questionType === this.enumQuestionFieldType.Select ||
          question.questionType === this.enumQuestionFieldType.MultiSelect ||
          question.questionType === this.enumQuestionFieldType.CheckList ||
          question.questionType === this.enumQuestionFieldType.Checkbox ||
          question.questionType === this.enumQuestionFieldType.URL ||
          question.questionType === this.enumQuestionFieldType.DataLink
        );
      }
    }
    return false;
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
        this.questions?.map((question) => {
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
    this.failedLoadDrawer = false;
    this.stationService
      .getStationQuestions(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (questions) => {
          this.questions = questions;
          if (this.isStationMultiline) {
            this.setDefaultColumnsStationMultiline();
          }
          this.checkStationColumns();
          this.loadColumnsSelect();
          this.isLoading = false;
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.failedLoadDrawer = true;
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
    this.dataDrawerStation.widgetItem.data = JSON.stringify({
      stationRithmId: this.stationRithmId,
      columns: this.stationColumns,
    });
    this.dashboardService.updateDashboardWidgets({
      widgetItem: this.dataDrawerStation.widgetItem,
      widgetIndex: this.dataDrawerStation.widgetIndex,
      quantityElementsWidget: this.dataDrawerStation.quantityElementsWidget,
    });
  }

  /** Set default columns if station columns are empty and station is type multiline. */
  private setDefaultColumnsStationMultiline(): void {
    if (this.stationColumns.length < 3) {
      this.stationColumns = [
        { name: this.enumColumnsDocumentInfo.Name },
        { name: this.enumColumnsDocumentInfo.LastUpdated },
        { name: this.enumColumnsDocumentInfo.AssignedUser },
      ];
    }
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
