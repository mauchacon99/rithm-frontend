import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { MapService } from '../map.service';

/**
 * Main component for the map.
 */
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  constructor(
    private mapService: MapService,
    private errorService: ErrorService
  ) {
    //Subscribe to getMapData so that we can update the map with the data.
    this.mapService
      .getMapData()
      .pipe(first())
      .subscribe({
        error: (error: unknown) => {
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error,
            true
          );
          //Note that the data from the backend has been received.
          this.mapService.mapDataReceived$.next(true);
        },
      });
  }
}
