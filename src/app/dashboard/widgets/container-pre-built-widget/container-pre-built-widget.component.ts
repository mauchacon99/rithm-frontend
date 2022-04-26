import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { ContainerWidgetPreBuilt } from 'src/models';
import { UtcTimeConversion } from 'src/helpers';
import { MatSort } from '@angular/material/sort';
import { DocumentComponent } from 'src/app/document/document/document.component';

/** Container preview build. */
@Component({
  selector: 'app-container-pre-built-widget[editMode]',
  templateUrl: './container-pre-built-widget.component.html',
  styleUrls: ['./container-pre-built-widget.component.scss'],
  providers: [UtcTimeConversion],
})
export class ContainerPreBuiltWidgetComponent implements OnInit {
  /** Reference to sort table. */
  @ViewChild(MatSort) set tableSort(value: MatSort) {
    if (value) {
      this.dataSourceTable.sort = value;
    }
  }

  /** The component for the document info header. */
  @ViewChild(DocumentComponent, { static: false })
  documentComponent!: DocumentComponent;

  /** EditMode the widget. */
  private _editMode = false;

  /** Set edit mode toggle from dashboard. */
  @Input() set editMode(value: boolean) {
    this._editMode = value;
    if (value && this.isDocument) {
      this.viewDocument(null);
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

  /** If expand or not the widget. */
  @Output() expandWidget = new EventEmitter<boolean>();

  /** Containers widget pre built. */
  containers: ContainerWidgetPreBuilt[] = [];

  /** Interface for list data in widget. */
  dataSourceTable!: MatTableDataSource<ContainerWidgetPreBuilt>;

  /** Columns staticts to show on table. */
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

  /** Update document list when a new document is created. */
  reloadDocumentList = false;

  /** To set its expanded the widget. */
  isExpandWidget = false;

  /** Variable to show if the error message should be displayed. */
  displayDocumentError = false;

  /** View detail document. */
  isDocument = false;

  /** Document id selected for view. */
  documentSelected: ContainerWidgetPreBuilt | null = null;

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

  /**
   * View detail document.
   *
   * @param documentSelected Document selected.
   * @param reloadDocuments Boolean when is true, reload the documents.
   */
  viewDocument(
    documentSelected: ContainerWidgetPreBuilt | null,
    reloadDocuments = false
  ): void {
    this.documentSelected = documentSelected;
    this.isDocument = !this.isDocument;
    if (this.reloadDocumentList || reloadDocuments) {
      this.getContainerWidgetPreBuilt();
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
      this.viewDocument(null, isReturnListDocuments);
    }
  }

  /** Expand widget. */
  toggleExpandWidget(): void {
    this.isExpandWidget = !this.isExpandWidget;
    this.expandWidget.emit(this.isExpandWidget);
  }
}
