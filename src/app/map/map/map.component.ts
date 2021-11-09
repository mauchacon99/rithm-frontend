import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
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
  constructor(private mapService: MapService) {
    this.mapService.getMapElements()
    .pipe(first())
    .subscribe({ next: () => null, error: (error: unknown) => {
        throw new Error(`Unable to get map data: ${error}`);
      }
    });
  }
}
