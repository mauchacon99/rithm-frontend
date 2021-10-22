import { Observable, of } from 'rxjs';
import { WorkerDashboardHeader, DashboardStationData, StationRosterMember } from 'src/models';
import { delay } from 'rxjs/operators';
import { Document } from 'src/models';
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Mocks methods of the `DashboardService`.
 */
export class MockDashboardService {

  /**
   * Gets info needed for dashboard header.
   *
   * @returns Dashboard header data.
   */
  getDashboardHeader(): Observable<WorkerDashboardHeader> {
    const dashboardHeaderData: WorkerDashboardHeader = {
      userRithmId: '1234',
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
  getDashboardStations(): Observable<DashboardStationData[]> {
    const dashboardStationData: DashboardStationData[] = [
      {
        rithmId: '1',
        numberOfDocuments: 5,
        stationName: 'station-1',
        numberOfWorkers: 3,
        worker: [
          {
            rithmId: '', firstName: 'Worker', lastName: 'User', isAssigned: false, email: 'workeruser@inpivota.com',
            isWorker: true,
            isOwner: false
          },
          {
            rithmId: '', firstName: 'Harry', lastName: 'Potter', isAssigned: false, email: 'harrypotter@inpivota.com',
            isWorker: true,
            isOwner: false
          }
        ]
      },
      {
        rithmId: '2',
        numberOfDocuments: 2,
        stationName: 'station-2',
        numberOfWorkers: 6,
        worker: [
          {
            rithmId: '', firstName: 'Worker', lastName: 'User', isAssigned: false, email: 'workeruser@inpivota.com',
            isWorker: true,
            isOwner: false
          },
          {
            rithmId: '', firstName: 'Harry', lastName: 'Potter', isAssigned: false, email: 'harrypotter@inpivota.com',
            isWorker: true,
            isOwner: false
          }
        ]
      }
    ];

    return of(dashboardStationData).pipe(delay(1000));
  }

  /**
   * Gets a list of worker roster of a station.
   *
   * @param stationId The id of the station for which to get the roster.
   * @returns A list of worker roster of a station.
   */
  getWorkerRoster(stationId: string): Observable<StationRosterMember[]> {
    const expectedResponse: StationRosterMember[] = [
      {
        rithmId: '',
        firstName: 'Adarsh',
        lastName: 'Achar',
        email: 'adarsh.achar@inpivota.com',
        isWorker: true,
        isOwner: false
      },
      {
        rithmId: '',
        firstName: 'Tyler',
        lastName: 'Hendrickson',
        email: 'tyler.hendrickson@rithm.software',
        isWorker: true,
        isOwner: false
      }
    ];
    return of(expectedResponse).pipe(delay(1000));
  }

  /**
   * Gets a list of supervisor roster of a station.
   *
   * @param stationId The id of the station for which to get the roster.
   * @returns A list of supervisor roster of a station.
   */
  getSupervisorRoster(stationId: string): Observable<StationRosterMember[]> {
    const expectedResponse: Array<StationRosterMember> = [
      {
        rithmId: '',
        firstName: 'Adarsh',
        lastName: 'Achar',
        email: 'adarsh.achar@inpivota.com',
        isWorker: true,
        isOwner: false
      }
      ,
      {
        rithmId: '',
        firstName: 'Tyler',
        lastName: 'Hendrickson',
        email: 'tyler.hendrickson@rithm.software',
        isWorker: true,
        isOwner: false
      }
    ];
    return of(expectedResponse).pipe(delay(1000));
  }

  /**
   * Gets a list of priority queue documents.
   *
   * @returns A list of top priority queue documents.
   */
  getPriorityQueueDocuments(): Observable<Document[]> {
    const expectedResponse: Array<Document> = [
      {
        documentRithmId: '200E132A-3B78-433F-9E6C-22E3A0BDBD8B',
        documentName: 'Granola',
        stationRithmId: '9360D633-A1B9-4AC5-93E8-58316C1FDD9F',
        stationName: 'Step 4',
        priority: 18,
        flowedTimeUTC: '0001-01-01T00:00:00',
        userAssigned: '',
        updatedTimeUTC: '2021-06-18T21:17:34.3506612Z',
        isEscalated: false
      }];
    return of(expectedResponse).pipe(delay(1000));
  }

  /**
   * Gets a list of previously started documents.
   *
   * @returns A list of previously started documents.
   */
  getPreviouslyStartedDocuments(): Observable<Document[]> {
    const filterData: Document[] = [
      {
        documentName: 'Really long document name',
        stationName: 'really long Station name',
        priority: 1,
        userAssigned: '',
        isEscalated: false,
        updatedTimeUTC: '2021-06-16T17:26:47.3506612Z',
        documentRithmId: '',
        flowedTimeUTC: '',
        stationRithmId: ''
      },
      {
        documentName: 'New Doc 2',
        stationName: 'Station name',
        priority: 2,
        userAssigned: '',
        isEscalated: false,
        updatedTimeUTC: '2021-06-16T17:26:47.3506612Z',
        documentRithmId: '',
        flowedTimeUTC: '',
        stationRithmId: ''
      }
    ];
    return of(filterData).pipe(delay(1000));
  }

}
