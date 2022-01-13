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
    const widgets: DashboardItem[] = [
      {
        cols: 4,
        rows: 1,
        x: 0,
        y: 0,
        widgetType: WidgetType.Station,
        data: '{"rithmId":"247cf568-27a4-4968-9338-046ccfee24f3"}',
        minItemCols: 4,
        minItemRows: 4,
        maxItemCols: 12,
        maxItemRows: 12,
      },
    ];

    return of(widgets).pipe(delay(1000));
  }
}
