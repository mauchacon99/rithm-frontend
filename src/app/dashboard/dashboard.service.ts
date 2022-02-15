import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  WorkerDashboardHeader,
  DashboardStationData,
  StationRosterMember,
  Document,
  DashboardData,
  DocumentWidget,
  QuestionFieldType,
} from 'src/models';

const MICROSERVICE_PATH = '/dashboardservice/api/dashboard';

/**
 * Service for all business logic involving the dashboard.
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  /** Loading dashboard when generating new dashboard. */
  isLoadingDashboard$ = new Subject<boolean>();

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
   * Toggle emit to loading dashboard.
   *
   * @param status Boolean true to loading and false not loading.
   */
  toggleLoadingDashboard(status: boolean): void {
    this.isLoadingDashboard$.next(status);
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
   * @param dashboardRithmId String of the rithmId dashboard.
   * @returns Returns the list of widgets.
   */
  getDashboardWidgets(dashboardRithmId: string): Observable<DashboardData> {
    const params = new HttpParams().set('dashboardRithmId', dashboardRithmId);
    return this.http.get<DashboardData>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/widgets`,
      { params }
    );
  }

  /**
   * Update personal dashboard.
   *
   * @param dashboardData Dashboard update.
   * @returns Personal dashboard data observable.
   */
  updatePersonalDashboard(
    dashboardData: DashboardData
  ): Observable<DashboardData> {
    return this.http.put<DashboardData>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/personal`,
      dashboardData
    );
  }

  /**
   * Get all  the organization's dashboards.
   *
   * @returns Returns a list of dashboards.
   */
  getOrganizationDashboard(): Observable<DashboardData[]> {
    return this.http.get<DashboardData[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/company`
    );
  }

  /**
   * Get all dashboards how user.
   *
   * @returns Returns list of dashboards.
   */
  getPersonalDashboard(): Observable<DashboardData[]> {
    return this.http.get<DashboardData[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/personal`
    );
  }

  /**
   * Generates a new dashboard personal.
   *
   * @returns Returns a new default dashboard.
   */
  generateNewPersonalDashboard(): Observable<DashboardData> {
    return this.http.post<DashboardData>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/personal`,
      { name: 'Untitled Dashboard' }
    );
  }

  /**
   * Generates a new dashboard.
   *
   * @returns Returns a new default dashboard.
   */
  generateNewOrganizationDashboard(): Observable<DashboardData> {
    return this.http.post<DashboardData>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/company`,
      { name: 'Untitled Dashboard' }
    );
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
    return this.http.put<DashboardData>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/company`,
      dashboardData
    );
  }

  /**
   * Delete organization dashboards.
   *
   * @param rithmId The specific dashboard rithmId to delete.
   * @returns The rithmId deleted dashboard.
   */
  deleteOrganizationDashboard(rithmId: string): Observable<DashboardData> {
    return this.http.delete<DashboardData>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/company?rithmId=${rithmId}`
    );
  }

  /**
   * Delete personal dashboards.
   *
   * @param rithmId The specific dashboard rithmId to delete.
   * @returns The rithmId of the deleted dashboard.
   */
  deletePersonalDashboard(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rithmId: string
  ): Observable<unknown> {
    return of().pipe(delay(1000));
  }

  /**
   * Get document widget.
   *
   * @param documentRithmId Rithm of document.
   * @returns Returns DocumentWidget.
   */
  getDocumentWidget(documentRithmId: string): Observable<DocumentWidget> {
    const response = {
      documentName: 'Untitled Dashboard',
      documentRithmId: documentRithmId,
      questions: [
        {
          rithmId: '',
          prompt: 'Instructions',
          questionType: QuestionFieldType.Instructions,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
          answer: {
            questionRithmId: '',
            referAttribute: '',
            value: '',
          },
        },
        {
          rithmId: '',
          prompt: 'Name your field',
          questionType: QuestionFieldType.ShortText,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
          value: '',
        },
      ],
    };
    return of(response).pipe(delay(1000));
  }
}
