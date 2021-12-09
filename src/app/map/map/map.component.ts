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
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  constructor(private mapService: MapService,
    private errorService: ErrorService) {
    this.mapService.getMapData()
    .pipe(first())
    .subscribe({ error: (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error,
          true
        );
        this.mapService.mapDataReceived$.next(true);
      }
    });
  }
}
