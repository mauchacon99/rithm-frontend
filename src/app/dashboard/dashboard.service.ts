import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WorkerDashboardHeaderData, DashboardStationData, WorkerRosterResponse, Document } from 'src/models';

const MICROSERVICE_PATH = '/dashboardservice/api/dashboard';

/**
 * Service for all business logic involving the dashboard.
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private http: HttpClient
  ) { }

  /**
   * Gets info needed for dashboard header.
   *
   * @returns Dashboard header data.
   */
  getDashboardHeader(): Observable<WorkerDashboardHeaderData> {
    return this.http.get<WorkerDashboardHeaderData>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/header`);
  }

  /**
   * Gets a list of stations where the signed-in user is on the work roster.
   *
   * @returns Dashboard stations observable.
   */
  getDashboardStations(): Observable<DashboardStationData[]> {
    return this.http.get<DashboardStationData[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/stations`);
  }

  /**
   * Gets a list of worker roster of a station.
   *
   * @param stationId The id of the station for which to get the roster.
   * @returns A list of worker roster of a station.
   */
  getWorkerRoster(stationId: string): Observable<WorkerRosterResponse[]> {
    // eslint-disable-next-line max-len
    return this.http.get<WorkerRosterResponse[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/stationroster?stationRithmId=${stationId}`);
  }

  /**
   * Gets a list of supervisor roster of a station.
   *
   * @param stationId The id of the station for which to get the roster.
   * @returns A list of supervisor roster of a station.
   */
  getSupervisorRoster(stationId: string): Observable<WorkerRosterResponse[]> {
    // eslint-disable-next-line max-len
    return this.http.get<WorkerRosterResponse[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/SupervisorRoster?stationRithmId=${stationId}`);
  }

  /**
   * Gets a list of priority queue documents.
   *
   * @returns A list of top priority queue documents.
   */
  getPriorityQueueDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/getprioritydocuments`);
  }

  /**
   * Gets a list of previously started documents.
   *
   * @returns A list of previously started documents.
   */
  getPreviouslyStartedDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/previouslystarteddocuments`);
  }

}
