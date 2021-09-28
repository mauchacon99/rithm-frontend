import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MapData } from 'src/models';

/**
 * Mocks methods of the `MapService`.
 */
export class MockMapService {

  /**
   * Gets all map elements for a given organization.
   *
   * @returns Retrieves all map elements for a given organization.
   */
  getMapElements(): Observable<MapData> {
    const data: MapData = {
      stations: [
        {
          id: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
          name: 'Development',
          numberOfDocuments: 5,
          mapPoint: {
            x: 12,
            y: 15
          },
          incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C', 'AAAEBE98-YU01-97ER-A7BB-285PP25B0989'],
          outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989', 'CCCAAA00-IO01-97QW-Z7LK-877MM25Z0989']
        },
        {
          id: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
          name: 'Step 1',
          numberOfDocuments: 5,
          mapPoint: {
            x: 200,
            y: 80
          },
          incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
          outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989']
        },
        {
          id: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
          name: 'Step 2',
          numberOfDocuments: 5,
          mapPoint: {
            x: 500,
            y: 400
          },
          incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
          outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989']
        },
        {
          id: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
          name: 'Step 3',
          numberOfDocuments: 5,
          mapPoint: {
            x: 50,
            y: 240
          },
          incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
          outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989']
        }
      ], flows: []
    };
    return of(data).pipe(delay(1000));
  }

  /**
   * Publishes local map changes to the server.
   *
   * @param mapData Data sending to the API.
   * @returns Observable of Comment.
   */
  publishMap(mapData: MapData): Observable<unknown> {
    if (!mapData) {
      return throwError(new HttpErrorResponse({
        error: {
          error: 'Some error message'
        }
      })).pipe(delay(1000));
    } else {
      return of().pipe(delay(1000));
    }
  }
}
