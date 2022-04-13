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

  /** Data static of info about document. */
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
    [WidgetType.StationGroup]: {
      title: '',
      description: '',
      descriptionComponent: {
        title: '',
        type: '',
        customizable: '',
        description: ``,
      },
    },
  };

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
          widgetType: WidgetType.Station,
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
            widgetType: WidgetType.Station,
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
            widgetType: WidgetType.Station,
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
            widgetType: WidgetType.Station,
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
          widgetType: WidgetType.Station,
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
          widgetType: WidgetType.Station,
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
   * @param name Name to get match documents.
   * @returns The item list widget modal.
   */
  getDocumentTabList(name: string): Observable<ItemListWidgetModal[]> {
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
   * @param name Name to get match stations.
   * @returns The list.
   */
  getStationTabList(name: string): Observable<ItemListWidgetModal[]> {
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

  /**
   * Get the list for the groups the stations tabs.
   *
   * @param name Name to get match group stations.
   * @returns The list the groups.
   */
  getGroupStationTabList(name: string): Observable<ItemListWidgetModal[]> {
    const itemListWidgetModal: ItemListWidgetModal[] = [
      {
        rithmId: '7',
        name: 'Groupygroup',
        isChained: false,
        totalStations: 2,
        totalSubGroups: 5,
      },
      {
        rithmId: '7',
        name: 'Groupygroup',
        isChained: true,
        totalStations: 2,
        totalSubGroups: 3,
      },
      {
        rithmId: '7',
        name: 'Groupygroup',
        isChained: false,
        totalStations: 2,
        totalSubGroups: 9,
      },
    ];

    return of(itemListWidgetModal).pipe(delay(1000));
  }
}
