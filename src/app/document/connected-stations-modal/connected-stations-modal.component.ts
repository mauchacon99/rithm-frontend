import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ConnectedModalData,
  ConnectedStationInfo,
  MoveDocument,
  Station,
} from 'src/models';
import { DocumentService } from 'src/app/core/document.service';
import { first, Observable } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { Router } from '@angular/router';
import { StationService } from 'src/app/core/station.service';
import { UserService } from 'src/app/core/user.service';
import { FormControl, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

/**
 * Component for connected stations.
 */
@Component({
  selector: 'app-connected-stations-modal',
  templateUrl: './connected-stations-modal.component.html',
  styleUrls: ['./connected-stations-modal.component.scss'],
})
export class ConnectedStationsModalComponent implements OnInit {
  /**
   * Disable button to move document.
   *
   * @returns True when it's not an object.
   */
  get checkTypeof(): boolean {
    return typeof this.formMoveDocument.value !== 'object';
  }

  /** Data filtered to show autocomplete. */
  filteredOptionsAutocomplete$!: Observable<ConnectedStationInfo[] | Station[]>;

  /** The selected Station for move document. */
  formMoveDocument = new FormControl('', Validators.required);

  /** The list of previous and following stations or the list of all stations. */
  stations: ConnectedStationInfo[] | Station[] = [];

  /** The Document rithmId. */
  documentRithmId = '';

  /** The Station rithmId. */
  stationRithmId = '';

  /** Load if exists error in the stations. */
  connectedError = false;

  /** Loading in modal the list of connected stations or the list of all stations. */
  connectedStationLoading = false;

  /** Enable error message if move document request fails. */
  moveDocumentError = false;

  /** The title Modal. */
  title = 'Where would you like to move this document?';

  /** The Label Select of modal. */
  label = 'Select Station';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ConnectedModalData,
    private documentService: DocumentService,
    private errorService: ErrorService,
    private popupService: PopupService,
    private matDialogRef: MatDialogRef<void>,
    private router: Router,
    public dialogRef: MatDialogRef<ConnectedStationsModalComponent>,
    private stationService: StationService,
    private userService: UserService
  ) {
    this.documentRithmId = data.documentRithmId;
    this.stationRithmId = data.stationRithmId;
  }

  /**
   * Gets info about the document as well as forward and previous stations for a specific document.
   */
  ngOnInit(): void {
    this.isAdmin ? this.getAllStations() : this.getConnectedStations();
    this.listenAutocomplete$();
  }

  /** Listen changes in autocomplete. */
  private listenAutocomplete$(): void {
    this.filteredOptionsAutocomplete$ = this.formMoveDocument.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((value) => this.filterAutocomplete(value))
    );
  }

  /**
   * Filter data on autocomplete input.
   *
   * @param value String to filter.
   * @returns Data filtered.
   */
  private filterAutocomplete(
    value: string
  ): ConnectedStationInfo[] | Station[] {
    const filterValue = value.toLowerCase();
    const dataFiltered = [] as ConnectedStationInfo[];
    this.stations.map((station) => {
      if (station.name.toLowerCase().includes(filterValue)) {
        dataFiltered.push(station);
      }
    });
    return dataFiltered;
  }

  /**
   * Display the name of station in input autocomplete.
   *
   * @param station Object of station.
   * @returns String to show.
   */
  displayFn(station: ConnectedStationInfo | Station): string {
    return station && station.name ? station.name : '';
  }

  /**
   * Gets check if user is Admin.
   *
   * @returns User is admin or not.
   */
  get isAdmin(): boolean {
    return this.userService.isAdmin;
  }

  /**
   * Retrieves a list of the connected stations for the given document.
   */
  private getConnectedStations(): void {
    this.connectedStationLoading = true;
    this.documentService
      .getConnectedStationInfo(this.documentRithmId, this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (connectedStations) => {
          this.connectedStationLoading = false;
          this.stations = connectedStations.nextStations.concat(
            connectedStations.previousStations
          );
        },
        error: (error: unknown) => {
          this.connectedError = true;
          this.connectedStationLoading = false;
          this.errorService.displayError(
            'Failed to get connected stations for this document.',
            error,
            false
          );
        },
      });
  }

  /**
   * Get the list of all stations.
   */
  private getAllStations(): void {
    this.connectedStationLoading = true;
    this.stationService
      .getAllStations()
      .pipe(first())
      .subscribe({
        next: (stations) => {
          this.stations = stations;
          this.connectedStationLoading = false;
        },
        error: (error: unknown) => {
          this.connectedStationLoading = false;
          this.errorService.displayError(
            'Failed to get all stations for this document.',
            error,
            false
          );
        },
      });
  }

  /**
   * Move the document from a station to another.
   */
  moveDocument(): void {
    this.moveDocumentError = false;
    this.connectedStationLoading = true;
    const moveDocument: MoveDocument = {
      fromStationRithmId: this.stationRithmId,
      toStationRithmIds: [this.formMoveDocument.value?.rithmId],
      documentRithmId: this.documentRithmId,
    };
    this.documentService
      .moveDocument(moveDocument)
      .pipe(first())
      .subscribe({
        next: () => {
          this.popupService.notify('The document has been moved successfully');
          this.moveDocumentError = false;
          this.connectedStationLoading = false;
          this.matDialogRef.close();
          this.router.navigateByUrl('dashboard');
        },
        error: (error: unknown) => {
          this.moveDocumentError = true;
          this.connectedStationLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /** Close add widgets modal. */
  closeModal(): void {
    this.dialogRef.close();
  }
}
