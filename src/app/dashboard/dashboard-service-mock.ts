import { Observable, of } from 'rxjs';
import { Station, User, DashboardHeaderResponse, DashboardStationData } from 'src/models';
import { delay } from 'rxjs/operators';

/**
 * Mocks methods of the `DashboardService`.
 */
export class MockDashboardService {

  /**
   * Gets a list of stations where the signed-in user is on the work roster.
   *
   * @returns A list of stations.
   */
  getWorkerStations(): Observable<Station[]> {
    const mockUser: User = {
      rithmId: '1234',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      objectPermissions: [],
      groups: [],
      createdDate: new Date().toISOString()
    };

    const mockStations: Station[] = [
      {
        name: 'Station 1',
        instructions: 'Some instructions',
        documents: 5,
        supervisors: [
          mockUser
        ],
        rosterUsers: [
          mockUser
        ]
      }
    ];
    return of(mockStations);
  }

  /**
   * Gets a dashboard header data of a user.
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

    return of(dashboardHeaderData);
  }

  /**
   * Gets a dashboard stations data of a user.
   *
   * @returns Dashboard stations data.
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
