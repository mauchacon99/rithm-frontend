import { Observable, of } from 'rxjs';
import { DashboardHeaderResponse, DashboardStationData } from 'src/models';
import { delay } from 'rxjs/operators';

/**
 * Mocks methods of the `DashboardService`.
 */
export class MockDashboardService {

  /**
   * Gets info needed for dashboard header.
   *
   * @returns Dashboard header data.
   */
  getDashboardHeader(): Observable<DashboardHeaderResponse> {
    const dashboardHeaderData: DashboardHeaderResponse = {
      userRithmId: '1234',
      id: 1,
      startedDocuments: 5,
      rosterStations: 4
    };

    return of(dashboardHeaderData).pipe(delay(1000));
  }

  /**
   * Gets a list of stations where the signed-in user is on the work roster.
   *
   * @returns Dashboard stations observable.
   */
  getDashboardStations(): Observable<Array<DashboardStationData>> {
    const dashboardStationData: Array<DashboardStationData> = [
      {
        numberOfDocuments: 5,
        stationName: 'station-1',
        numberOfWorkers: 3,
        workerInitials: [
          'AA', 'AB'
        ]
      },
      {
        numberOfDocuments: 2,
        stationName: 'station-2',
        numberOfWorkers: 6,
        workerInitials: [
          'XR', 'PD'
        ]
      }
    ];

    return of(dashboardStationData).pipe(delay(1000));
  }

}
