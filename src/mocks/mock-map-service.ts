import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { StationMapData } from 'src/models';

/**
 * Mocks methods of the `FlowService`.
 */
export class MockMapService {

  /**
   * Gets all map elements for a given organization.
   *
   * @returns Retrieves all map elements for a given organization.
   */
  getMapElements(): Observable<StationMapData[]> {
    const data: StationMapData[] = [
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
          x: 12,
          y: 15
        },
        incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
        outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989']
      }
    ];
    return of(data).pipe(delay(1000));
  }
}
