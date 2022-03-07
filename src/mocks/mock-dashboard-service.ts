import { Observable, of, Subject } from 'rxjs';
import {
  WorkerDashboardHeader,
  DashboardStationData,
  StationRosterMember,
  WidgetType,
  DashboardData,
  RoleDashboardMenu,
  EditDataWidget,
  ColumnsDocumentInfo,
  ItemListWidgetModal,
} from 'src/models';
import { delay } from 'rxjs/operators';
import { Document } from 'src/models';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Mocks methods of the `DashboardService`.
 */
export class MockDashboardService {
  /** Loading dashboard when generating new dashboard. */
  isLoadingDashboard$ = new Subject<{
    /** To toggle loading dashboard. */
    statusLoading: boolean;
    /** True to load getParams in dashboard. */
    getParams: boolean;
  }>();

  /** Update specific widget and data. */
  updateDataWidget$ = new Subject<EditDataWidget>();

  columnsDocumentInfo: {
    /** Name to show in dom. */
    name: string;
    /** Key property to get value of the document. */
    key: string;
  }[] = [
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

  /**
   * Update data of the widget since drawer station.
   *
   * @param editDataWidget Data to edit widget.
   */
  updateDashboardWidgets(editDataWidget: EditDataWidget): void {
    this.updateDataWidget$.next(editDataWidget);
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
   * @param dashboardRithmId String of the rithmId dashboard.
   * @returns Returns the list of widgets.
   */
  getDashboardWidgets(dashboardRithmId: string): Observable<DashboardData> {
    const widgets: DashboardData = {
      rithmId: dashboardRithmId,
      name: 'Organization 1',
      type: RoleDashboardMenu.Company,
      widgets: [
        {
          rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
          cols: 4,
          data: '{"stationRithmId":"9897ba11-9f11-4fcf-ab3f-f74a75b9d5a1"}',
          maxItemCols: 0,
          maxItemRows: 0,
          minItemCols: 0,
          minItemRows: 0,
          rows: 2,
          widgetType: WidgetType.StationTable,
          x: 0,
          y: 0,
        },
      ],
    };

    return of(widgets).pipe(delay(1000));
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
    return of(dashboardData).pipe(delay(1000));
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
        type: RoleDashboardMenu.Company,
        widgets: [
          {
            rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
            cols: 4,
            data: '{"stationRithmId":"9897ba11-9f11-4fcf-ab3f-f74a75b9d5a1"}',
            maxItemCols: 0,
            maxItemRows: 0,
            minItemCols: 0,
            minItemRows: 0,
            rows: 2,
            widgetType: WidgetType.StationTable,
            x: 0,
            y: 0,
          },
        ],
      },
      {
        rithmId: '123654-789654-7852',
        name: 'Organization 2',
        type: RoleDashboardMenu.Company,
        widgets: [
          {
            rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
            cols: 4,
            data: '{"stationRithmId":"9897ba11-9f11-4fcf-ab3f-f74a75b9d5a1-2"}',
            maxItemCols: 0,
            maxItemRows: 0,
            minItemCols: 0,
            minItemRows: 0,
            rows: 2,
            widgetType: WidgetType.StationTable,
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
        type: RoleDashboardMenu.Personal,
        widgets: [
          {
            rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
            cols: 4,
            data: '{"stationRithmId":"9897ba11-9f11-4fcf-ab3f-f74a75b9d5a1-3"}',
            maxItemCols: 0,
            maxItemRows: 0,
            minItemCols: 0,
            minItemRows: 0,
            rows: 2,
            widgetType: WidgetType.StationTable,
            x: 0,
            y: 0,
          },
        ],
      },
      {
        rithmId: '123654-789654-7852-963',
        name: 'Personal 2',
        type: RoleDashboardMenu.Personal,
        widgets: [
          {
            rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
            cols: 4,
            data: '{"stationRithmId":"9897ba11-9f11-4fcf-ab3f-f74a75b9d5a1-4"}',
            maxItemCols: 0,
            maxItemRows: 0,
            minItemCols: 0,
            minItemRows: 0,
            rows: 2,
            widgetType: WidgetType.StationTable,
            x: 0,
            y: 0,
          },
        ],
      },
    ];

    return of(personalDashboards).pipe(delay(1000));
  }

  /**
   * Generates a new dashboard personal.
   *
   * @returns Returns a new default dashboard.
   */
  generateNewPersonalDashboard(): Observable<DashboardData> {
    const newDashboard: DashboardData = {
      rithmId: '102030405060708090100',
      type: RoleDashboardMenu.Personal,
      name: 'Untitled Dashboard',
      widgets: [
        {
          rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
          cols: 4,
          rows: 1,
          x: 0,
          y: 0,
          widgetType: WidgetType.StationTable,
          data: '{"stationRithmId":"247cf568-27a4-4968-9338-046ccfee24f3"}',
          minItemCols: 4,
          minItemRows: 4,
          maxItemCols: 12,
          maxItemRows: 12,
        },
      ],
    };

    return of(newDashboard).pipe(delay(1000));
  }

  /**
   * Generates a new dashboard.
   *
   * @returns Returns a new default dashboard.
   */
  generateNewOrganizationDashboard(): Observable<DashboardData> {
    const newDashboard: DashboardData = {
      rithmId: '102030405060708090100',
      name: 'Untitled Dashboard',
      type: RoleDashboardMenu.Company,
      widgets: [
        {
          rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
          cols: 4,
          rows: 1,
          x: 0,
          y: 0,
          widgetType: WidgetType.StationTable,
          data: '{"stationRithmId":"247cf568-27a4-4968-9338-046ccfee24f3"}',
          minItemCols: 4,
          minItemRows: 4,
          maxItemCols: 12,
          maxItemRows: 12,
        },
      ],
    };

    return of(newDashboard).pipe(delay(1000));
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
    return of(dashboardData).pipe(delay(1000));
  }

  /**
   * Delete organization dashboards.
   *
   * @param rithmId The specific dashboard rithmId to delete.
   * @returns The dashboard rithmId deleted.
   */
  deleteOrganizationDashboard(rithmId: string): Observable<unknown> {
    return of().pipe(delay(1000));
  }

  /**
   * Delete personal dashboards.
   *
   * @param rithmId The specific dashboard rithmId to delete.
   * @returns The dashboard rithmId deleted.
   */
  deletePersonalDashboard(rithmId: string): Observable<unknown> {
    return of().pipe(delay(1000));
  }

  /**
   * Get list tab documents.
   *
   * @param dashboardRithmId The specific dashboard rithmId to get item list widget.
   * @returns The item list widget modal.
   */
  getDocumentTabList(
    dashboardRithmId: string
  ): Observable<ItemListWidgetModal[]> {
    const itemListWidgetModal: ItemListWidgetModal[] = [
      {
        rithmId: '200E132A-3B78-433F-9E6C-22E3A0BDBD8B',
        name: 'Document Name',
        stationName: 'Stationy Name that is namey',
        stationGroupName: 'Groupygroup',
        isChained: false,
      },
      {
        rithmId: '200E132A-3B78-433F-9E6C-22E3A0BDBD8B',
        name: 'Document Name',
        stationName: 'Stationy Name that is namey',
        stationGroupName: 'Groupygroup',
        isChained: true,
      },
      {
        rithmId: '200E132A-3B78-433F-9E6C-22E3A0BDBD8B',
        name: 'Document Name',
        stationName: 'Stationy Name that is namey',
        stationGroupName: 'Groupygroup',
        isChained: false,
      },
    ];
    return of(itemListWidgetModal).pipe(delay(1000));
  }

  /**
   * Get the list for the station tabs.
   *
   * @returns The list.
   */
  getStationTabList(): Observable<ItemListWidgetModal[]> {
    const itemListWidgetModal: ItemListWidgetModal[] = [
      {
        rithmId: '9360D633-A1B9-4AC5-93E8-58316C1FDD9F',
        name: 'Stationy Name that is namey',
        groupName: 'Groupygroup',
        isChained: false,
        totalDocuments: 2,
      },
    ];

    return of(itemListWidgetModal).pipe(delay(1000));
  }
}
