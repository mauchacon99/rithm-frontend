import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { UtcTimeConversion } from 'src/helpers';

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
/** Whether the request to get the station info is currently underway. */
stationLoading = false;

  /** Observable for when the component is destroyed. */
  destroyed$ = new Subject();

  /** The information about the station. */
  stationInformation = '';

  /** The Last Updated Date. */
  lastUpdatedDate = '';

  constructor(
    private stationService: StationService,
    private utcTimeConversion: UtcTimeConversion,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  /**
   * Gets info about the document as well as forward and previous stations for a specific document.
   */
   ngOnInit(): void {
    this.getParams();
  }

  /**
   * Attempts to retrieve the document info from the query params in the URL and make the requests.
   */
   private getParams(): void {
    this.route.params
      .pipe(first())
      .subscribe((params) => {
        if (!params.stationId) {
          this.handleInvalidParams();
        } else {
          this.getStationInfo(params.stationId);
        }
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }

  /**
   * Get data about the document and station the document is in.
   *
   * @param stationId The id of the station that the document is in.
   */
   private getStationInfo(stationId: string): void {
    this.stationLoading = true;
    this.stationService.getLastUpdated(stationId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((updatedData) => {
        if (updatedData) {
          this.stationInformation = updatedData;
        }
        this.stationLoading = false;
      }, (error: unknown) => {
        this.navigateBack();
        this.stationLoading = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }

  /**
   * Get the last updated date for a specific station.
   *
   * @param stationId The id of the station that the document is in.
   */
     getLastUpdated(stationId: string): void {
      this.stationLoading = true;
      this.stationService.getLastUpdated(stationId)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((updatedDate) => {
          if (updatedDate) {
            this.lastUpdatedDate = this.utcTimeConversion.getElapsedTimeText(
              this.utcTimeConversion.getMillisecondsElapsed(updatedDate));
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
   * Navigates the user back to dashboard and displays a message about the invalid params.
   */
   private handleInvalidParams(): void {
    this.navigateBack();
    this.errorService.displayError(
      'The link you followed is invalid. Please double check the URL and try again.',
      new Error('Invalid params for document')
    );
  }

  /**
   * Navigates the user back to the dashboard page.
   */
   private navigateBack(): void {
    // TODO: [RIT-691] Check which page user came from. If exists and within Rithm, navigate there
    // const previousPage = this.location.getState();
    // If no previous page, go to dashboard
    this.router.navigateByUrl('dashboard');
  }

  /**
   * Completes all subscriptions.
   */
       ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
      }
}
