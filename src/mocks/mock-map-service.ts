import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MapData, MapMode, StationMapData } from 'src/models';

/**
 * Mocks methods of the `MapService`.
 */
export class MockMapService {
  /** The rendering context for the canvas element for the map. */
  canvasContext?: CanvasRenderingContext2D;

  /** The current mode of interaction on the map. */
  mapMode$ = new BehaviorSubject(MapMode.build);

  /**
   * Registers the canvas rendering context from the component for use elsewhere.
   *
   * @param canvasContext The rendering context for the canvas element.
   */
   registerCanvasContext(canvasContext: CanvasRenderingContext2D): void {
    this.canvasContext = canvasContext;
  }

  /**
   * Gets all map elements for a given organization.
   *
   * @returns Retrieves all map elements for a given organization.
   */
  getMapElements(): Observable<StationMapData[]> {
    const data: StationMapData[] = [
        {
          rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
          name: 'Development',
          noOfDocuments: 5,
          mapPoint: {
            x: 12,
            y: 15
          },
          incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C', 'AAAEBE98-YU01-97ER-A7BB-285PP25B0989'],
          outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989', 'CCCAAA00-IO01-97QW-Z7LK-877MM25Z0989']
        },
        {
          rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
          name: 'Step 1',
          noOfDocuments: 5,
          mapPoint: {
            x: 200,
            y: 80
          },
          incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
          outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989']
        },
        {
          rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
          name: 'Step 2',
          noOfDocuments: 5,
          mapPoint: {
            x: 500,
            y: 400
          },
          incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
          outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989']
        },
        {
          rithmId: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
          name: 'Step 3',
          noOfDocuments: 5,
          mapPoint: {
            x: 50,
            y: 240
          },
          incomingStationIds: ['ED6148C9-ABB7-408E-A210-9242B2735B1C'],
          outgoingStationIds: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989']
        }
      ];
    return of(data).pipe(delay(1000));
  }
}
