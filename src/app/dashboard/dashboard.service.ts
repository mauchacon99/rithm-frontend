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
  ColumnFieldsWidget,
  MemberDashboard,
  MemberAddDashboard,
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
      name: 'Container',
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

  /** Data static to preview templates widgets modal and data description component. */
  dataTemplatePreviewWidgetModal = {
    // station data
    [WidgetType.Station]: {
      title: 'Table',
      description:
        'Build a custom table with specific values from each document in the station.',
      descriptionComponent: {
        title: 'Table Widget',
        type: 'Station Template',
        customizable: 'Table Columns',
        description: `By default. the table has a single column showing each document in your selected station.
        Custom banner images can also be added to the widget`,
      },
    },
    [WidgetType.StationTableBanner]: {
      title: 'Table With Banner Image',
      description:
        'Build a custom table with specific values from each document in the station.',
      descriptionComponent: {
        title: 'Table Widget',
        type: 'Station Template',
        customizable: 'Table Columns & Image',
        description: `By default. the table has a single column showing each document in your selected station.
        Additional columns of data can be added as desired. Custom banner     images can also be added to the widget`,
      },
    },
    [WidgetType.StationMultiline]: {
      title: 'Multiline List',
      description:
        'Select multiple document values to display on each row of the list.',
      descriptionComponent: {
        title: 'List Widget',
        type: 'Station Template',
        customizable: 'Row Information',
        description: `Great for displaying longer text fields in documents. By default, this widget displays the document name,
        late updated date, and the first text field from each document. Each of these three fields can be edited from the dashboard.`,
      },
    },
    [WidgetType.StationMultilineBanner]: {
      title: 'Multiline List With Banner',
      description:
        'Select multiple document values to display on each row of the list along with custom banner image.',
      descriptionComponent: {
        title: 'List Widget',
        type: 'Station Template',
        customizable: 'Row information',
        description: `Great for display longer text fields in documents. By default. this widget displays the document name with custom
        banner images can also be added to the widget. Late update date, and the first text field from each document. Each of these three
        fields can be edited from the dashboard.`,
      },
    },
    // Document data
    ['defaultDocument']: {
      title: 'Default',
      description: 'Maintain the default document styling.',
      descriptionComponent: {
        title: '',
        type: '',
        customizable: '',
        description: ``,
      },
    },
    [WidgetType.DocumentListBanner]: {
      title: 'List with Banner Image',
      description:
        'Display all the values associated with a document along with a custom banner image.',
      descriptionComponent: {
        title: 'List Widget',
        type: 'Document Template',
        customizable: 'List Values & Image',
        description: `Upload an image from the container to display as a banner image.
        List values can also be optionally hidden from on the widget as needed.`,
      },
    },
    [WidgetType.Document]: {
      title: 'List',
      description: 'Display all the values associated with a document.',
      descriptionComponent: {
        title: 'List Widget',
        type: 'Document Template',
        customizable: 'List Values',
        description: `By default, the list widget displays all of the values associated with a document.
        Values can be optionally be hidden from on the widget in needed.`,
      },
    },
    [WidgetType.ContainerProfileBanner]: {
      title: 'Profile With Banner Image',
      description:
        'Display an image uploaded to the container along with a banner image.',
      descriptionComponent: {
        title: 'List Widget',
        type: 'Document Template',
        customizable: 'List values & Image',
        description: `Select an image from the container to display as a profile image, and upload a banner image of your choice.
        List values can also be optionally hidden from on the widget as needed.`,
      },
    },
    // Group
    [WidgetType.StationGroupTraffic]: {
      title: 'Group traffic',
      description: `The user can consult all the values associated with the stations managed in the stations
      stations managed in the stations within a flow. By default, the result is
       a graph representing the movement of the documents within the stations.`,
      descriptionComponent: {
        title: 'Group Traffic Widget',
        type: 'Group Template',
        customizable: 'Group Traffic result values',
        description: `The user can consult all the values associated with the stations managed in the stations
        stations managed in the stations within a flow. By default, the result is
         a graph representing the movement of the documents within the stations.`,
      },
    },
    [WidgetType.StationGroupSearch]: {
      title: 'Search',
      description: `User can query all the values saved on documents within a flow. By default the search results display the document
      name and the field that matches your search.`,
      descriptionComponent: {
        title: 'Search Widget',
        type: 'Group Template',
        customizable: 'Search result values',
        description: `User can query all the values saved on documents within a flow. By default the search results display the document
        name and the field that matches your search.`,
      },
    },
    //Pre built section container.
    [WidgetType.PreBuiltContainer]: {
      title: 'My Containers',
      description:
        'Display all containers assigned to the logged in user, as the station and group those containers belong to.',
      descriptionComponent: {
        title: 'Table Widget',
        type: 'Pre-Built',
        customizable: 'None',
        description: `Display all containers assigned to the logged in user, as the station and group those containers belong to.`,
      },
    },
    [WidgetType.PreBuiltStation]: {
      title: 'My Stations',
      description:
        'Display all stations assigned to the logged in user, as well as the container count for each station.',
      descriptionComponent: {
        title: 'Table Widget',
        type: 'Pre-Built',
        customizable: 'None',
        description: `Display all the containers assigned to whichever user is logged in.`,
      },
    },
  };

  constructor(private http: HttpClient) {}

  /**
   * Group columns of station widget.
   *
   * @param columns Columns to group.
   * @returns Columns grouped.
   */
  groupColumnsStationWidget(
    columns: ColumnFieldsWidget[]
  ): ColumnFieldsWidget[] {
    const columnsGrouped: ColumnFieldsWidget[] = [];
    columns.map((column) => {
      if (
        !columnsGrouped.some((value) => {
          if (column.questionId) {
            return value.questionId === column.questionId;
          }
          return value.name === column.name;
        })
      ) {
        columnsGrouped.push(column);
      }
    });
    return columnsGrouped;
  }

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
   * @param canView The user can view the dashboard.
   * @param isEditable The user can edit the dashboard.
   * @returns Returns a new default dashboard.
   */
  generateNewPersonalDashboard(
    canView: boolean,
    isEditable: boolean
  ): Observable<DashboardData> {
    return this.http.post<DashboardData>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/personal`,
      { name: 'Untitled Dashboard', canView, isEditable }
    );
  }

  /**
   * Generates a new dashboard.
   *
   * @param canView The user can view the dashboard.
   * @param isEditable The user can edit the dashboard.
   * @returns Returns a new default dashboard.
   */
  generateNewOrganizationDashboard(
    canView: boolean,
    isEditable: boolean
  ): Observable<DashboardData> {
    return this.http.post<DashboardData>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/company`,
      { name: 'Untitled Dashboard', canView, isEditable }
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

  /**
   * Add members to dashboard.
   *
   * @param dashboardRithmId String of the rithmId dashboard.
   * @param users Users to add to dashboard.
   * @returns Returns a updated dashboard.
   */
  addDashboardMembers(
    dashboardRithmId: string,
    users: MemberAddDashboard[]
  ): Observable<DashboardData> {
    return this.http.post<DashboardData>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/dashboard-share`,
      {
        dashboardRithmId: dashboardRithmId,
        users: users,
      }
    );
  }

  /**
   * Get users to dashboard personal.
   *
   * @param dashboardRithmId Users to add to dashboard.
   * @returns An Observable of an array of MemberDashboard objects.
   */
  getUsersDashboardPersonal(
    dashboardRithmId: string
  ): Observable<MemberDashboard[]> {
    const params = new HttpParams().set('dashboardRithmId', dashboardRithmId);
    return this.http.get<MemberDashboard[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/shared-users`,
      {
        params,
      }
    );
  }
}
