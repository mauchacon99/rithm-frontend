import { Observable, of } from 'rxjs';
import {
  WorkerDashboardHeader,
  DashboardStationData,
  StationRosterMember,
  DashboardItem,
  WidgetType,
  DashboardData,
} from 'src/models';
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
      rosterStations: 4,
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
            rithmId: '',
            firstName: 'Worker',
            lastName: 'User',
            email: 'workeruser@inpivota.com',
            isWorker: true,
            isOwner: false,
          },
          {
            rithmId: '',
            firstName: 'Harry',
            lastName: 'Potter',
            email: 'harrypotter@inpivota.com',
            isWorker: true,
            isOwner: false,
          },
        ],
      },
      {
        rithmId: '2',
        numberOfDocuments: 2,
        stationName: 'station-2',
        numberOfWorkers: 6,
        worker: [
          {
            rithmId: '',
            firstName: 'Worker',
            lastName: 'User',
            email: 'workeruser@inpivota.com',
            isWorker: true,
            isOwner: false,
          },
          {
            rithmId: '',
            firstName: 'Harry',
            lastName: 'Potter',
            email: 'harrypotter@inpivota.com',
            isWorker: true,
            isOwner: false,
          },
        ],
      },
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
        isOwner: false,
      },
      {
        rithmId: '',
        firstName: 'Tyler',
        lastName: 'Hendrickson',
        email: 'tyler.hendrickson@rithm.software',
        isWorker: true,
        isOwner: false,
      },
    ];
    return of(expectedResponse).pipe(delay(1000));
  }

  /**
   * Gets a list of station owner roster of a station.
   *
   * @param stationId The id of the station for which to get the roster.
   * @returns A list of station owner roster of a station.
   */
  getSupervisorRoster(stationId: string): Observable<StationRosterMember[]> {
    const expectedResponse: Array<StationRosterMember> = [
      {
        rithmId: '',
        firstName: 'Adarsh',
        lastName: 'Achar',
        email: 'adarsh.achar@inpivota.com',
        isWorker: true,
        isOwner: false,
      },
      {
        rithmId: '',
        firstName: 'Tyler',
        lastName: 'Hendrickson',
        email: 'tyler.hendrickson@rithm.software',
        isWorker: true,
        isOwner: false,
      },
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
        isEscalated: false,
      },
    ];
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
        stationRithmId: '',
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
        stationRithmId: '',
      },
    ];
    return of(filterData).pipe(delay(1000));
  }

  /**
   * Gets widgets for dashboard.
   *
   * @returns Returns the list of widgets.
   */
  getDashboardWidgets(): Observable<DashboardItem[]> {
    const widgets: DashboardItem[] = [
      {
        cols: 4,
        rows: 1,
        x: 0,
        y: 0,
        widgetType: WidgetType.Station,
        data: '{"stationRithmId":"247cf568-27a4-4968-9338-046ccfee24f3"}',
        minItemCols: 4,
        minItemRows: 4,
        maxItemCols: 12,
        maxItemRows: 12,
      },
    ];

    return of(widgets).pipe(delay(1000));
  }

  /**
   * Update organization dashboard`s.
   *
   * @returns The updated  data for this dashboard.
   * @param dashboardData Dashboard data for update.
   */
  updateOrganizationDashboard(
    dashboardData: DashboardData
  ): Observable<DashboardData> {
    const newDashboarData: DashboardData = {
      rithmId: dashboardData.rithmId,
      name: 'new name',
      widgets: [
        {
          cols: 1,
          rows: 2,
          x: 0,
          y: 0,
          widgetType: WidgetType.Document,
          data: 'string',
          minItemRows: 1,
          maxItemRows: 2,
          minItemCols: 1,
          maxItemCols: 2,
        },
      ],
    };
    return of(newDashboarData).pipe(delay(1000));
  }

  /**
   * Get all the organization's dashboards.
   *
   * @returns Returns a list of dashboards.
   */
  getOrganizationDashboard(): Observable<DashboardData[]> {
    const OrganizationDashboards: DashboardData[] = [
      {
        rithmId: '123654-789654-7852',
        name: 'Organization 1',
        widgets: [
          {
            cols: 4,
            data: '{"stationRithmId":"9897ba11-9f11-4fcf-ab3f-f74a75b9d5a1"}',
            maxItemCols: 0,
            maxItemRows: 0,
            minItemCols: 0,
            minItemRows: 0,
            rows: 2,
            widgetType: WidgetType.Station,
            x: 0,
            y: 0,
          },
        ],
      },
      {
        rithmId: '123654-789654-7852',
        name: 'Organization 2',
        widgets: [
          {
            cols: 4,
            data: '{"stationRithmId":"9897ba11-9f11-4fcf-ab3f-f74a75b9d5a1-2"}',
            maxItemCols: 0,
            maxItemRows: 0,
            minItemCols: 0,
            minItemRows: 0,
            rows: 2,
            widgetType: WidgetType.Station,
            x: 0,
            y: 0,
          },
        ],
      },
    ];

    return of(OrganizationDashboards).pipe(delay(1000));
  }

  /**
   * Get all dashboards how user.
   *
   * @returns Returns list of dashboards.
   */
  getPersonalDashboard(): Observable<DashboardData[]> {
    const personalDashboards: DashboardData[] = [
      {
        rithmId: '123654-789654-7852-789',
        name: 'Personal 1',
        widgets: [
          {
            cols: 4,
            data: '{"stationRithmId":"9897ba11-9f11-4fcf-ab3f-f74a75b9d5a1-3"}',
            maxItemCols: 0,
            maxItemRows: 0,
            minItemCols: 0,
            minItemRows: 0,
            rows: 2,
            widgetType: WidgetType.Station,
            x: 0,
            y: 0,
          },
        ],
      },
      {
        rithmId: '123654-789654-7852-963',
        name: 'Personal 2',
        widgets: [
          {
            cols: 4,
            data: '{"stationRithmId":"9897ba11-9f11-4fcf-ab3f-f74a75b9d5a1-4"}',
            maxItemCols: 0,
            maxItemRows: 0,
            minItemCols: 0,
            minItemRows: 0,
            rows: 2,
            widgetType: WidgetType.Station,
            x: 0,
            y: 0,
          },
        ],
      },
    ];

    return of(personalDashboards).pipe(delay(1000));
  }
}
