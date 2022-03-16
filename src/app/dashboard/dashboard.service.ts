import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  WorkerDashboardHeader,
  DashboardStationData,
  StationRosterMember,
  Document,
  DashboardData,
  EditDataWidget,
  ColumnsDocumentInfo,
  ColumnsLogicWidget,
  ItemListWidgetModal,
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
  /** Loading dashboard when generating new dashboard. */
  isLoadingDashboard$ = new Subject<{
    /** To toggle loading dashboard. */
    statusLoading: boolean;
    /** True to load getParams in dashboard. */
    getParams: boolean;
  }>();

  /** Update specific widget and data. */
  updateDataWidget$ = new Subject<EditDataWidget>();

  /** Data static of info about document. */
  columnsDocumentInfo: ColumnsLogicWidget[] = [
    {
      name: 'Document',
      key: ColumnsDocumentInfo.Name,
    },
    {
      name: 'Assigned',
      key: ColumnsDocumentInfo.AssignedUser,
    },
    {
      name: 'Priority',
      key: ColumnsDocumentInfo.Priority,
    },
    {
      name: 'Time in station',
      key: ColumnsDocumentInfo.TimeInStation,
    },
    {
      name: 'Last updated',
      key: ColumnsDocumentInfo.LastUpdated,
    },
  ];

  /** Data static to preview templates widgets modal. */
  dataTemplatePreviewWidgetModal = {
    // station data
    [WidgetType.Station]: {
      title: 'Table',
      description:
        'Build a custom table with specific values from each document in the station.',
    },
    [WidgetType.StationTableBanner]: {
      title: 'Table With Banner Image',
      description:
        'Build a custom table with specific values from each document in the station.',
    },
    // groups data
    [WidgetType.StationGroup]: {
      title: '',
      description: '',
    },
    // Document data
    ['defaultDocument']: {
      title: 'Default',
      description: 'Maintain the default document styling.',
    },
    [WidgetType.DocumentListBanner]: {
      title: 'List with Banner Image',
      description:
        'Display all the values associated with a document along with a custom banner image.',
    },
    [WidgetType.Document]: {
      title: 'List',
      description: 'Display all the values associated with a document.',
    },
  };

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
   * @param statusLoading To toggle loading dashboard.
   * @param getParams True to load getParams in dashboard.
   */
  toggleLoadingDashboard(statusLoading: boolean, getParams = false): void {
    this.isLoadingDashboard$.next({ statusLoading, getParams });
  }

  /**
   * Update data of the widget since drawer station.
   *
   * @param editDataWidget Data to edit widget.
   */
  updateDashboardWidgets(editDataWidget: EditDataWidget): void {
    this.updateDataWidget$.next(editDataWidget);
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
    const params = new HttpParams().set('stationRithmId', stationId);
    return this.http.get<StationRosterMember[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/station-roster`,
      {
        params,
      }
    );
  }

  /**
   * Gets a list of station owner roster of a station.
   *
   * @param stationId The id of the station for which to get the roster.
   * @returns A list of station owner roster of a station.
   */
  getSupervisorRoster(stationId: string): Observable<StationRosterMember[]> {
    const params = new HttpParams().set('stationRithmId', stationId);
    return this.http.get<StationRosterMember[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/supervisor-roster`,
      {
        params,
      }
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
   * Generates a new personal dashboard.
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
  deleteOrganizationDashboard(rithmId: string): Observable<unknown> {
    return this.http.delete<void>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/company?rithmId=${rithmId}`
    );
  }

  /**
   * Delete personal dashboards.
   *
   * @param rithmId The specific dashboard rithmId to delete.
   * @returns The rithmId of the deleted dashboard.
   */
  deletePersonalDashboard(rithmId: string): Observable<unknown> {
    return this.http.delete<void>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/personal?rithmId=${rithmId}`
    );
  }

  /**
   * Get list tab documents.
   *
   * @param name Name to get match documents.
   * @returns The item list widget modal.
   */
  getDocumentTabList(name: string): Observable<ItemListWidgetModal[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<ItemListWidgetModal[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/library-documents`,
      {
        params,
      }
    );
  }

  /**
   * Get the list for the station tabs.
   *
   * @param name Name to get match stations.
   * @returns The list.
   */
  getStationTabList(name: string): Observable<ItemListWidgetModal[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<ItemListWidgetModal[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/library-stations`,
      {
        params,
      }
    );
  }

  /**
   * Get the list for the groups the stations tabs.
   *
   * @param name Name to get match group stations.
   * @returns The list the groups.
   */
  getGroupStationTabList(name: string): Observable<ItemListWidgetModal[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<ItemListWidgetModal[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/library-stationgroups`,
      {
        params,
      }
    );
  }
}
