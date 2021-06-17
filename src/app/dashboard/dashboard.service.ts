import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboardHeaderResponse, DashboardStationData, User } from 'src/models';
import { UserService } from '../core/user.service';

const MICROSERVICE_PATH = '/dashboardservice/api/dashboard';

/**
 * Service for all business logic involving the dashboard.
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private http: HttpClient,
    private userService: UserService,
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

}
