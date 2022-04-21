import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { ContainerWidgetPreBuilt } from 'src/models';
import { UtcTimeConversion } from 'src/helpers';

/** Container preview build. */
@Component({
  selector: 'app-container-pre-built-widget[editMode]',
  templateUrl: './container-pre-built-widget.component.html',
  styleUrls: ['./container-pre-built-widget.component.scss'],
  providers: [UtcTimeConversion],
})
export class ContainerPreBuiltWidgetComponent implements OnInit {
  /** Edit mode dashboard. */
  @Input() editMode!: boolean;

  /** Containers widget pre built. */
  containers: ContainerWidgetPreBuilt[] = [];

  /** Interface for list data in widget. */
  dataSourceTable!: MatTableDataSource<ContainerWidgetPreBuilt>;

  displayedColumns = [
    'nameContainer',
    'flowedTimeUTC',

    'stationName',
    'stationOwners',
    'viewDocument',
  ];

  /** Is loading. */
  isLoading = false;

  /** Show message if fail get containers. */
  failedGetContainers = false;

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService,
    private utcTimeConversion: UtcTimeConversion
  ) {}

  /** Init method. */
  ngOnInit(): void {
    this.getContainerWidgetPreBuilt();
  }

  /**
   * Get containers.
   *
   */
  getContainerWidgetPreBuilt(): void {
    this.isLoading = true;
    this.failedGetContainers = false;
    this.documentService
      .getContainerWidgetPreBuilt()
      .pipe(first())
      .subscribe({
        next: (containers) => {
          this.isLoading = false;
          this.failedGetContainers = false;
          this.containers = containers;
          this.dataSourceTable = new MatTableDataSource(containers);
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.failedGetContainers = true;
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
}
