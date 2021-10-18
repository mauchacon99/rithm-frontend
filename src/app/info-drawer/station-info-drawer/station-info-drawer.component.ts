import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { UtcTimeConversion } from 'src/helpers';
import { ActivatedRoute } from '@angular/router';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { UserService } from 'src/app/core/user.service';
import { StationInfoDrawerData, StationInformation } from 'src/models';
import { PopupService } from '../../core/popup.service';

/**
 * Component for info station.
 */
@Component({
  selector: 'app-station-info-drawer',
  templateUrl: './station-info-drawer.component.html',
  styleUrls: ['./station-info-drawer.component.scss'],
  providers: [UtcTimeConversion]
})

export class StationInfoDrawerComponent implements OnInit, OnDestroy {
  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject();

  /** Whether the request to get the station info is currently underway. */
  stationLoading = false;

  /** Type of user looking at a document. */
  type: 'admin' | 'super' | 'worker';

  /** Is component viewed in station edit mode. */
  editMode = false;

  /** Station information object passed from parent. */
  stationInformation!: StationInformation;

  /** Edit Mode. */
  stationName = '';

  /** Worker. */
  isWorker = true;

  /** Station name form. */
  stationNameForm: FormGroup;

  /** The Last Updated Date. */
  lastUpdatedDate = '';

  /** Color message LastUpdated. */
  colorMessage  = '';

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private userService: UserService,
    private fb: FormBuilder,
    private stationService: StationService,
    private utcTimeConversion: UtcTimeConversion,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    private popupService: PopupService
  ) {
    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as StationInfoDrawerData;
        if (dataDrawer) {
          this.editMode = dataDrawer.editMode;
          this.stationInformation = dataDrawer.stationInformation as StationInformation;
          this.stationName = dataDrawer.stationName;
          this.isWorker = dataDrawer.isWorker;
        }
      });
    this.type = this.userService.user.role === 'admin' ? this.userService.user.role : 'worker';
    this.stationNameForm = this.fb.group({
      name: [this.stationName]
    });
  }

  /**
   * Gets info about the station as well as forward and previous stations for a specific station.
   */
  ngOnInit(): void {
    this.getParams();
  }

  /**
   * Attempts to retrieve the station info from the query params in the URL and make the requests.
   */
  private getParams(): void {
    this.route.params
      .pipe(first())
      .subscribe((params) => {
        if (!params.stationId) {
          this.handleInvalidParams();
        } else {
          this.getLastUpdated(params.stationId);
        }
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }

  /**
   * Toggles the open state of the drawer for station info.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'stationInfo'): void {
    this.sidenavDrawerService.toggleDrawer(drawerItem);
  }

  /**
   * Get the last updated date for a specific station.
   *
   * @param stationId The id of the station that the document is in.
   */
     getLastUpdated(stationId: string): void {
      this.stationLoading = true;
      this.stationService.getLastUpdated(stationId)
        .pipe(first())
        .subscribe((updatedDate) => {
          if (updatedDate) {
            this.lastUpdatedDate = this.utcTimeConversion.getElapsedTimeText(
              this.utcTimeConversion.getMillisecondsElapsed(updatedDate));
            this.colorMessage='text-accent-500';
            if (this.lastUpdatedDate === '1 day') {
                this.lastUpdatedDate = ' Yesterday';
            } else {
              this.lastUpdatedDate += ' ago';
            }
          }
          this.stationLoading = false;
        }, (error: unknown) => {
          this.stationLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        });
    }

  /**
   * Delete a station by ID.
   *
   * @param stationId The id of the station to be deleted.
   */
     deleteStation(stationId: string): void {
      this.stationService.deleteStation(stationId)
        .pipe(first())
        .subscribe(() => {
          this.popupService.notify('The station has been deleted.');
        }, (error: unknown) => {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        });
    }

  /**
   * Navigates the user back to dashboard and displays a message about the invalid params.
   */
  private handleInvalidParams(): void {
    this.errorService.displayError(
      'Unable to retrieve the last updated time.',
      new Error('Invalid params for document')
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
