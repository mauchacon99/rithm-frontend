import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  WorkerDashboardHeader,
  DashboardStationData,
  StationRosterMember,
  Document,
  DashboardItem,
  WidgetType,
  DashboardData,
} from 'src/models';

const MICROSERVICE_PATH = '/dashboardservice/api/dashboard';

/**
 * Service for all business logic involving the dashboard.
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  /**
   * Gets info needed for dashboard header.
   *
   * @returns Dashboard header data.
   */
  getDashboardHeader(): Observable<WorkerDashboardHeader> {
    return this.http.get<WorkerDashboardHeader>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/header`
    );
  }

  /**
   * Gets a list of stations where the signed-in user is on the work roster.
   *
   * @returns Dashboard stations observable.
   */
  getDashboardStations(): Observable<DashboardStationData[]> {
    return this.http.get<DashboardStationData[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/stations`
    );
  }

  /**
   * Gets a list of worker roster of a station.
   *
   * @param stationId The id of the station for which to get the roster.
   * @returns A list of worker roster of a station.
   */
  getWorkerRoster(stationId: string): Observable<StationRosterMember[]> {
    // eslint-disable-next-line max-len
    return this.http.get<StationRosterMember[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/station-roster?stationRithmId=${stationId}`
    );
  }

  /**
   * Gets a list of station owner roster of a station.
   *
   * @param stationId The id of the station for which to get the roster.
   * @returns A list of station owner roster of a station.
   */
  getSupervisorRoster(stationId: string): Observable<StationRosterMember[]> {
    // eslint-disable-next-line max-len
    return this.http.get<StationRosterMember[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/supervisor-roster?stationRithmId=${stationId}`
    );
  }

  /**
   * Gets a list of priority queue documents.
   *
   * @returns A list of top priority queue documents.
   */
  getPriorityQueueDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/priority-documents`
    );
  }

  /**
   * Gets a list of previously started documents.
   *
   * @returns A list of previously started documents.
   */
  getPreviouslyStartedDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/previously-started-documents`
    );
  }

  /**
   * Gets widgets for dashboard.
   *
   * @returns Returns the list of widgets.
   */
  getDashboardWidgets(): Observable<DashboardItem[]> {
    return this.http.get<DashboardItem[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/widgets`
    );
  }

  /**
   * Get all dashboards for organization.
   *
   * @returns Returns the list of dashboards.
   */
  getDashboardOrganization(): Observable<DashboardData[]> {
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
   * @returns Returns the list of dashboards.
   */
  getDashboardPersonal(): Observable<DashboardData[]> {
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
