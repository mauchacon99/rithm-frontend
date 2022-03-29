import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { UtcTimeConversion } from 'src/helpers';
import { ActivatedRoute, Router } from '@angular/router';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { UserService } from 'src/app/core/user.service';
import {
  CenterPanType,
  DocumentGenerationStatus,
  MapItemStatus,
  MapMode,
  StationInfoDrawerData,
  StationInformation,
} from 'src/models';
import { PopupService } from 'src/app/core/popup.service';
import { MapService } from 'src/app/map/map.service';
import { DocumentService } from 'src/app/core/document.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { RosterManagementModalComponent } from 'src/app/shared/roster-management-modal/roster-management-modal.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * Component for info station.
 */
@Component({
  selector: 'app-station-info-drawer',
  templateUrl: './station-info-drawer.component.html',
  styleUrls: ['./station-info-drawer.component.scss'],
  providers: [UtcTimeConversion],
})
export class StationInfoDrawerComponent implements OnInit, OnDestroy {
  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Whether the request to get the station info is currently underway. */
  stationLoading = true;

  /** Whether the worker roster us public or not. */
  isPublic = false;

  /** Whether the station allow to add external users to the roster. */
  allowExternal = false;

  /** Loading in the allow external workers section. */
  allowExternalLoading = false;

  /** Check if there is an error when updating the allow external workers. */
  allowExternalError = false;

  /** Whether the station is allowed for all the organization workers or not. */
  allowAllOrgWorkers = false;

  /** The loading if changed toggle to allow all workers in the organization. */
  allowAllOrgLoading = false;

  /** Loading in last updated section. */
  lastUpdatedLoading = false;

  /** Loading in the document generation section. */
  docGenLoading = false;

  /** Loading in the document generation section. */
  docCreationLoading = false;

  /** Whether the station allow previous button or not. */
  statusAllowPreviousButton = false;

  /** Loading in the toggle to allow previous button or not. */
  statusAllowPreviousLoading = false;

  /** Use to determinate generation of document. */
  showDocumentGenerationError = false;

  /** Is component viewed in station edit mode. */
  editMode = false;

  /** Station information object. */
  stationInformation?: StationInformation;

  /** Station Id passed from parent. */
  stationRithmId = '';

  /** Edit Mode. */
  stationName = '';

  /** Notes for the station. */
  stationNotes?: string;

  /** If component is being viewed on the map, what mode is the map in? */
  mapMode?: MapMode;

  /** If component is being viewed on the map, what status does the station have? */
  stationStatus?: MapItemStatus;

  /** The Last Updated Date. */
  lastUpdatedDate = '';

  /** Status by default the document in station. */
  stationDocumentGenerationStatus: DocumentGenerationStatus =
    DocumentGenerationStatus.None;

  /** Color message LastUpdated. */
  colorMessage = '';

  /** Whether the station drawer is opened from map or not. */
  openedFromMap = false;

  /** Allowing access to all MapMode enums in HTML.*/
  mapModeEnum = MapMode;

  /** The priority for current station once the info is loaded.*/
  stationPriority: number | '--' = '--';

  /** The default message to prompt user to publish local changes.*/
  publishStationMessage = 'Publish map changes to update ';

  /** The drawer context for stationInfo. */
  drawerContext = '';

  /** The drawer context for stationInfo. */
  isChained = false;

  /** Display the ownerRoster length. */
  ownersRosterLength = -1;

  /** The selected tab index/init. */
  selectedTabIndex = 0;

  /** Get flow button name. */
  flowButtonName = '';

  /** Use for catch error in update for permission of all org workers. */
  allowAllOrgError = false;

  /**
   * Whether the station is selected and it's in center of the map.
   *
   * @returns True if the selected station in center of the map, false otherwise.
   */
  get stationCenter(): boolean {
    const drawer = document.getElementsByTagName('mat-drawer');
    //Call method to selected station is in center of the map.
    return this.mapService.checkCenter(
      CenterPanType.Station,
      drawer[0] ? drawer[0].clientWidth : 0
    );
  }

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private userService: UserService,
    private fb: FormBuilder,
    private stationService: StationService,
    private utcTimeConversion: UtcTimeConversion,
    private errorService: ErrorService,
    private popupService: PopupService,
    private router: Router,
    private mapService: MapService,
    private documentService: DocumentService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.drawerContext = data;
      });

    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((data: any) => {
        const dataDrawer = data as StationInfoDrawerData;
        if (this.drawerContext === 'stationInfo') {
          if (dataDrawer) {
            if (this.mapService.stationElements.some((e) => e.drawerOpened)) {
              const openedStations = this.mapService.stationElements.filter(
                (e) => e.drawerOpened
              );
              openedStations.forEach((station) => {
                station.drawerOpened = false;
              });
            }
            this.editMode = dataDrawer.editMode;
            this.stationRithmId = dataDrawer.stationRithmId;
            this.stationName = dataDrawer.stationName;
            this.mapMode = dataDrawer.mapMode;
            this.stationStatus = dataDrawer.stationStatus;
            this.openedFromMap = dataDrawer.openedFromMap;
            this.stationNotes = dataDrawer.notes;
            if (this.openedFromMap) {
              this.mapService.handleDrawerClose();

              const currentStationIndex =
                this.mapService.stationElements.findIndex(
                  (e) => e.rithmId === this.stationRithmId
                );
              if (this.mapService.stationElements[currentStationIndex]) {
                this.mapService.stationElements[
                  currentStationIndex
                ].drawerOpened = true;
              }
              this.mapService.mapDataReceived$.next(true);
            }
            if (
              this.openedFromMap &&
              this.stationStatus !== MapItemStatus.Created
            ) {
              this.getStationDocumentGenerationStatus();
            }
          } else {
            throw new Error('There was no station info drawer data');
          }
          this.getStationInfo();
        }
      });
  }

  /**
   * Gets info about the station as well as forward and previous stations for a specific station.
   */
  ngOnInit(): void {
    if (this.stationStatus !== MapItemStatus.Created) {
      this.getLastUpdated();
      this.getStationDocumentGenerationStatus();
      this.stationService.stationName$
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (data) => {
            this.stationName = data.length > 0 ? data : 'Untitled Station';
          },
          error: (error: unknown) => {
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error
            );
          },
        });
    }
  }

  /**
   * Whether the drawer is opened or not.
   *
   * @returns True if any drawer is opened, false otherwise.
   */
  get drawerOpened(): boolean {
    return this.sidenavDrawerService.isDrawerOpen;
  }

  /**
   * Whether the station is locally created on the map.
   *
   * @returns True if locally created, false otherwise.
   */
  get locallyCreated(): boolean {
    return this.stationStatus === MapItemStatus.Created;
  }

  /**
   * Is the current user an owner or an admin for this station.
   *
   * @returns Validate if user is owner or admin of current station.
   */
  get isUserAdminOrOwner(): boolean {
    if (!this.stationInformation) {
      throw new Error(
        `The stationInformation is undefined when checking if user is admin or owner.`
      );
    }
    return (
      this.userService.isStationOwner(this.stationInformation) ||
      this.userService.isAdmin
    );
  }

  /**
   * Whether to show the create document button or not.
   *
   * @returns True/show False/hide.
   */
  get displayCreateDocumentButton(): boolean {
    return (
      this.stationDocumentGenerationStatus ===
        DocumentGenerationStatus.Manual &&
      (this.mapMode === MapMode.View ||
        this.mapMode === MapMode.Build ||
        this.mapMode === undefined) &&
      !this.locallyCreated &&
      (this.isUserAdminOrOwner || this.isWorker)
    );
  }

  /**
   * Whether to show the deleteStation button or not.
   *
   * @returns True/show False/hide.
   */
  get displayDeleteStationButton(): boolean {
    return (
      this.locallyCreated ||
      (this.openedFromMap && this.editMode && this.isUserAdminOrOwner) ||
      (!this.openedFromMap && this.editMode) ||
      (!this.openedFromMap && this.isUserAdminOrOwner)
    );
  }

  /**
   * Update status the station.
   *
   * @param status New status the station update.
   * @param statusNew New status the station update.
   */
  updateGenerationStatus(
    status: string,
    statusNew: MatSlideToggleChange
  ): void {
    const value =
      status === 'None' && statusNew.checked
        ? DocumentGenerationStatus.None
        : status === 'None' && !statusNew.checked
        ? DocumentGenerationStatus.Manual
        : status === 'Manual' && statusNew.checked
        ? DocumentGenerationStatus.Manual
        : DocumentGenerationStatus.None;

    this.updateStationDocumentGenerationStatus(this.stationRithmId, value);
  }

  /**
   * Is the current user a worker on the station.
   *
   * @returns A boolean if user is worker on current station.
   */
  get isWorker(): boolean {
    if (!this.stationInformation) {
      throw new Error(
        `The stationInformation is undefined when checking if user is a worker.`
      );
    }
    return this.userService.isWorker(this.stationInformation);
  }

  /**
   * Get data about the station the document is in.
   *
   */
  getStationInfo(): void {
    this.stationLoading = true;
    if (this.stationStatus !== MapItemStatus.Created) {
      this.stationService
        .getStationInfo(this.stationRithmId)
        .pipe(first())
        .subscribe({
          next: (stationInfo) => {
            if (stationInfo) {
              this.stationInformation = stationInfo;
              this.stationPriority = stationInfo.priority;
              this.statusAllowPreviousButton = stationInfo.allowPreviousButton;
              this.allowExternal = stationInfo.allowExternalWorkers;
              this.allowAllOrgWorkers = stationInfo.allowAllOrgWorkers;
              this.stationInformation.flowButton =
                stationInfo.flowButton || 'Flow';
              this.flowButtonName = this.stationInformation.flowButton;
              this.isChained = stationInfo.isChained || false;
            }
            this.stationLoading = false;
            this.lastUpdatedLoading = false;
          },
          // eslint-disable-next-line
          error: (error: any) => {
            if (error?.status === 400) {
              this.sidenavDrawerService.closeDrawer();
            } else {
              this.stationLoading = false;
            }
            this.allowAllOrgError = true;
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error
            );
          },
        });
    } else {
      this.stationLoading = false;
      //Fill with blank station info if the station is newly created.
      this.stationInformation = {
        rithmId: this.stationRithmId,
        name: this.stationName,
        instructions: '',
        nextStations: [],
        previousStations: [],
        stationOwners: [],
        workers: [],
        createdByRithmId: '',
        createdDate: '',
        updatedByRithmId: '',
        updatedDate: '',
        questions: [],
        priority: 0,
        allowPreviousButton: false,
        allowAllOrgWorkers: false,
        allowExternalWorkers: true,
        flowButton: 'Flow',
        isChained: false,
      };
    }
  }

  /**
   * Get the last updated date for a specific station.
   */
  getLastUpdated(): void {
    this.stationLoading = true;
    this.lastUpdatedLoading = true;
    this.stationService
      .getLastUpdated(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (updatedDate) => {
          if (updatedDate && updatedDate !== 'Unknown') {
            this.lastUpdatedDate = this.utcTimeConversion.getElapsedTimeText(
              this.utcTimeConversion.getMillisecondsElapsed(updatedDate)
            );
            this.colorMessage = 'text-accent-500';
            if (this.lastUpdatedDate === '1 day') {
              this.lastUpdatedDate = ' Yesterday';
            } else {
              this.lastUpdatedDate += ' ago';
            }
          } else {
            this.colorMessage = 'text-error-500';
            this.lastUpdatedDate = 'Unable to retrieve time';
          }
          this.lastUpdatedLoading = false;
        },
        error: (error: unknown) => {
          this.colorMessage = 'text-error-500';
          this.lastUpdatedLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
          this.lastUpdatedDate = 'Unable to retrieve time';
          this.colorMessage = 'text-error-500';
        },
      });
  }

  /**
   * Get station document generation status.
   */
  getStationDocumentGenerationStatus(): void {
    this.docGenLoading = true;
    this.stationService
      .getStationDocumentGenerationStatus(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (status: DocumentGenerationStatus) => {
          this.docGenLoading = false;
          if (status) {
            this.stationDocumentGenerationStatus = status;
          }
        },
        // eslint-disable-next-line
        error: (error: any) => {
          this.docGenLoading = false;
          this.showDocumentGenerationError = true;
          if (error?.status === 400) {
            this.sidenavDrawerService.closeDrawer();
          } else {
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error
            );
          }
        },
      });
  }

  /**
   * Open a modal to create a new document.
   */
  async createNewDocument(): Promise<void> {
    const confirm = await this.popupService.confirm({
      title: 'Are you sure?',
      message:
        'After the document is created you will be redirected to the document page.',
      okButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    });
    if (confirm) {
      this.docCreationLoading = true;
      this.documentService
        .createNewDocument('', 0, this.stationRithmId)
        .pipe(first())
        .subscribe({
          next: (documentId) => {
            this.popupService.notify(
              'The document has been created successfully.'
            );
            this.router.navigateByUrl(
              `/document/${documentId}?documentId=${documentId}&stationId=${this.stationRithmId}`
            );
          },
          error: (error: unknown) => {
            this.docCreationLoading = false;
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error
            );
          },
        });
    }
  }

  /**
   * Assign an user to a document.
   *
   * @param userRithmId The Specific id of user assign.
   * @param documentRithmId The Specific id of document.
   */
  assignUserToDocument(userRithmId: string, documentRithmId: string): void {
    this.documentService
      .assignUserToDocument(userRithmId, this.stationRithmId, documentRithmId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate([`/document/${documentRithmId}`], {
            queryParams: {
              documentId: documentRithmId,
              stationId: this.stationRithmId,
            },
          });
          this.docCreationLoading = false;
        },
        error: (error: unknown) => {
          this.docCreationLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Handle required information for a locally created station.
   */
  newStationInit(): void {
    this.stationDocumentGenerationStatus = DocumentGenerationStatus.None;
    this.lastUpdatedDate = 'Publish Map changes to see last updated.';
  }

  /**
   * Update station document generation status.
   *
   * @param stationId The id of the station return status document.
   * @param statusNew The new status set in station document.
   */
  updateStationDocumentGenerationStatus(
    stationId: string,
    statusNew: DocumentGenerationStatus
  ): void {
    this.docGenLoading = true;
    this.stationService
      .updateStationDocumentGenerationStatus(stationId, statusNew)
      .pipe(first())
      .subscribe({
        next: (status) => {
          this.docGenLoading = false;
          if (status) {
            this.stationDocumentGenerationStatus = status;
          }
        },
        // eslint-disable-next-line
        error: (error: any) => {
          this.docGenLoading = false;
          if (error?.status === 400) {
            this.sidenavDrawerService.closeDrawer();
            // return;
          } else {
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error
            );
          }
        },
      });
  }

  /**
   * Navigate to station edit page upon confirmation in Map build mode and without any confirmation in Map view mode.
   *
   */
  async goToStation(): Promise<void> {
    let confirmNavigation = false;
    if (this.editMode) {
      const confirm = await this.popupService.confirm({
        title: 'Local Changes Not Saved',
        message: `Leave without publishing any changes made to the map?`,
        okButtonText: 'Proceed',
      });
      confirmNavigation = confirm;
    }
    if (confirmNavigation || !this.editMode) {
      this.router.navigate([`/station/${this.stationRithmId}`]);
    }
  }

  /**
   * Reporting if the name or notes on a station changed.
   */
  reportNewStationMapChange(): void {
    if (this.mapMode === MapMode.Build && this.stationNotes === undefined) {
      throw new Error('Station notes not found');
    }
    const openStation = this.mapService.stationElements.find(
      (station) => this.stationRithmId === station.rithmId
    );
    if (openStation === undefined) {
      throw new Error('Station was not found.');
    }
    openStation.stationName = this.stationName;
    openStation.notes = this.stationNotes ? this.stationNotes : '';
    openStation.markAsUpdated();
    this.mapService.stationElementsChanged$.next(true);
  }

  /**
   * Opens a modal with roster management.
   *
   * @param isOwner Whether the modal is for owners or workes.
   */
  openManagementRosterModal(isOwner: boolean): void {
    const dialog = this.dialog.open(RosterManagementModalComponent, {
      panelClass: ['w-5/6', 'sm:w-4/5'],
      maxWidth: '1024px',
      disableClose: true,
      data: {
        stationId: this.stationRithmId,
        type: isOwner ? 'owners' : 'workers',
      },
    });
    dialog
      .afterClosed()
      .pipe(first())
      .subscribe(() => {
        this.ownersRosterLength = -1;
        this.refreshInfoDrawer(true);
        this.selectedTabIndex = 2;
      });
  }

  /**
   * Refresh the Info drawer after modal is close.
   *
   * @param event Result from closing roster management modal.
   */
  refreshInfoDrawer(event: boolean): void {
    if (event === true) {
      this.getStationInfo();
    }
  }

  /**
   * This will delete the current station.
   */
  async deleteStation(): Promise<void> {
    const response = await this.popupService.confirm({
      title: 'Are you sure?',
      message:
        'The station will be deleted for everyone and any documents not moved to another station beforehand will be deleted.',
      okButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      important: true,
    });
    if (response) {
      if (this.openedFromMap) {
        this.mapService.removeAllStationConnections(this.stationRithmId);
        this.mapService.deleteStation(this.stationRithmId);
        this.sidenavDrawerService.closeDrawer();
      } else {
        this.stationService
          .deleteStation(this.stationRithmId)
          .pipe(first())
          .subscribe({
            next: () => {
              this.popupService.notify('The station has been deleted.');
              this.router.navigateByUrl('dashboard');
            },
            error: (error: unknown) => {
              this.errorService.displayError(
                "Something went wrong on our end and we're looking into it. Please try again in a little while.",
                error
              );
            },
          });
      }
    }
  }

  /**
   * Update flow button name.
   */
  updateFlowButtonName(): void {
    this.stationService.updatedFlowButtonText(this.flowButtonName);
  }

  /**
   * Update the AllowAllOrgWorkers status.
   */
  updateAllOrgWorkersStation(): void {
    this.allowAllOrgLoading = true;
    this.stationService
      .updateAllowAllOrgWorkers(this.stationRithmId, this.allowAllOrgWorkers)
      .pipe(first())
      .subscribe({
        next: (allowAllOrgWorkers) => {
          this.allowAllOrgWorkers = allowAllOrgWorkers;
          this.allowAllOrgLoading = false;
        },
        error: (error: unknown) => {
          this.allowAllOrgLoading = false;
          this.allowAllOrgError = true;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Update the allow external workers for the station roster.
   */
  updateAllowExternalWorkers(): void {
    this.allowExternalLoading = true;
    this.allowExternalError = false;
    this.stationService
      .updateAllowExternalWorkers(this.stationRithmId, this.allowExternal)
      .pipe(first())
      .subscribe({
        next: (allowExternal) => {
          this.allowExternal = allowExternal;
          this.allowExternalLoading = false;
        },
        error: (error: unknown) => {
          this.allowExternal = !this.allowExternal;
          this.allowExternalLoading = false;
          this.allowExternalError = true;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Update StationInfoDrawer in the station name.
   */
  updateStationInfoDrawerName(): void {
    this.stationName =
      this.stationName.length > 0 ? this.stationName : 'Untitled Station';
    this.stationService.updatedStationNameText(this.stationName);
    if (
      this.openedFromMap &&
      (this.mapMode === this.mapModeEnum.Build ||
        this.mapMode === this.mapModeEnum.StationAdd)
    ) {
      this.reportNewStationMapChange();
    }
  }

  /**
   * Update status allow previous button in the station.
   */
  updateAllowPreviousButton(): void {
    this.statusAllowPreviousLoading = true;
    this.stationService
      .updateAllowPreviousButton(
        this.stationRithmId,
        this.statusAllowPreviousButton
      )
      .pipe(first())
      .subscribe({
        next: (allowPreviousButton) => {
          this.statusAllowPreviousButton = allowPreviousButton;
          this.statusAllowPreviousLoading = false;
        },
        error: (error: unknown) => {
          this.statusAllowPreviousButton = !this.statusAllowPreviousButton;
          this.statusAllowPreviousLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Navigate the user to the station on the map.
   */
  goToStationOnMap(): void {
    this.mapService.centerStationRithmId$.next(this.stationRithmId);
    this.mapService.viewStationButtonClick$.next(true);
    this.router.navigate([`/map`]);
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Save Buttons Settings.
   */
  saveButtonSettings(): void {
    this.stationService
      .updateFlowButtonText(this.stationRithmId, this.flowButtonName)
      .pipe(first())
      .subscribe({
        error: (error: unknown) => {
          this.errorService.displayError(
            'Something went wrong on our end when updating the flow button text and we are looking into it. \
                Please try again in a little while',
            error
          );
        },
      });
  }

  /**
   * While station is selected & drawer opened, Method called for selected station to centering in the map.
   */
  centerStation(): void {
    this.mapService.isDrawerOpened$.next(true);
    //Close any open station option menus.
    this.mapService.matMenuStatus$.next(true);
    //Note that centering is beginning, this is necessary to allow recursive calls to the centerStation() method.
    this.mapService.centerActive$.next(true);
    //Get the map drawer element.
    const drawer = document.getElementsByTagName('mat-drawer');
    //Increment centerCount to show that more centering of station needs to be done.
    this.mapService.centerCount$.next(1);
    //Call method to run logic for centering of the station.
    this.mapService.center(
      CenterPanType.Station,
      drawer[0] ? drawer[0].clientWidth : 0
    );
  }
}
