import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { StationColumnWidget, WidgetDrawerStationData } from 'src/models';
import { ColumnsDocumentInfo } from 'src/models/enums/columns-document-info';

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

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Enum of columns statics. */
  columnsDocumentInfo = ColumnsDocumentInfo;

  /** Static columns. */
  staticColumnsInfo: StationColumnWidget[] = [];

  constructor(private sidenavDrawerService: SidenavDrawerService) {}

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
        }
      });
    this.setColumnsInfo();
  }

  /** Set enum values of ColumnsDocumentInfo to staticColumnsInfo. */
  setColumnsInfo(): void {
    Object.keys(this.columnsDocumentInfo).map((column) => {
      this.staticColumnsInfo.push({ name: column });
    });
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
   * @param questionId Id of question of the column.
   */
  addNewColumn(name = '', questionId = ''): void {
    const refColumns = this.formColumns.get('columns') as FormArray;
    refColumns.push(
      new FormGroup({
        name: new FormControl(name),
        questionId: new FormControl(questionId),
      })
    );
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
