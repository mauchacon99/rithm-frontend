import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccessToken } from 'src/helpers';
import { DashboardHeaderResponse } from 'src/models';

const MICROSERVICE_PATH = '/dashboardservice';

/**
 * Service for all business logic involving the dashboard.
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private http: HttpClient) { }

  /** The access token to be used to authenticate for every request. */
  accessToken: AccessToken | undefined;


  /**
  *Getting Dashboard header info.
  *
  * @returns Dashboard header observable.
  */
  getDashboardHeader(): Observable<DashboardHeaderResponse> {
    return this.http.get<DashboardHeaderResponse>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/api/Dashboard/Header`);
  }

}
