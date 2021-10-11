import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
export class StationInfoDrawerComponent {
/** Whether the request to get the station info is currently underway. */
stationLoading = false;

/** Observable for when the component is destroyed. */
destroyed$ = new Subject();

  /** The Last Updated Date. */
  lastUpdatedDate = '';

  constructor(
    private stationService: StationService,
    private utcTimeConversion: UtcTimeConversion,
    private errorService: ErrorService
  ){}

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

}
