import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboardHeaderResponse, DashboardStationData, WorkerRoasterResponse } from 'src/models';

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
  getDashboardHeader(): Observable<DashboardHeaderResponse> {
    return this.http.get<DashboardHeaderResponse>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/header`);
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
  getWorkerRoster(stationId: string): Observable<WorkerRoasterResponse[]> {
    // eslint-disable-next-line max-len
    return this.http.get<WorkerRoasterResponse[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/StationRoster?stationRithmId=${stationId}`);
  }

}
