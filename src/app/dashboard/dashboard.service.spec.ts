import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  WorkerDashboardHeader,
  Document,
  WidgetType,
  DashboardData,
  RoleDashboardMenu,
  EditDataWidget,
  ItemListWidgetModal,
  ColumnFieldsWidget,
  User,
} from 'src/models';
import { environment } from 'src/environments/environment';
import { DashboardService } from './dashboard.service';
import { DashboardStationData, StationRosterMember } from 'src/models';
import { RouterTestingModule } from '@angular/router/testing';

const MICROSERVICE_PATH = '/dashboardservice/api/dashboard';
const user: StationRosterMember = {
  rithmId: '123132132',
  firstName: 'Demo',
  lastName: 'User',
  email: 'demo@demo.com',
  isWorker: true,
  isOwner: false,
};

describe('DashboardService', () => {
  let service: DashboardService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(DashboardService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should successfully get dashboard header data', () => {
    const expectedResponse: WorkerDashboardHeader = {
      userRithmId: '1234',
      startedDocuments: 5,
      rosterStations: 4,
    };

    service.getDashboardHeader().subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    // outgoing request
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/header`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should successfully fetch data for dashboard stations', () => {
    const expectedResponse: Array<DashboardStationData> = [
      {
        rithmId: '1',
        numberOfDocuments: 5,
        stationName: 'station-1',
        numberOfWorkers: 3,
        worker: [
          {
            rithmId: '',
            firstName: 'Supervisor',
            lastName: 'User',
            email: 'supervisoruser@inpivota.com',
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
            firstName: 'Supervisor',
            lastName: 'User',
            email: 'supervisoruser@inpivota.com',
            isWorker: true,
            isOwner: false,
          },
        ],
      },
    ];

    service.getDashboardStations().subscribe((response) => {
      expect(response.length).toBeGreaterThanOrEqual(0);
    });

    // outgoing request
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/stations`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should successfully fetch data for dashboard worker roster', () => {
    const rithmId = 'E204F369-386F-4E41-B3CA-2459E674DF52';
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

    service.getWorkerRoster(rithmId).subscribe((response) => {
      expect(response.length).toBeGreaterThanOrEqual(0);
    });

    // outgoing request
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/station-roster?stationRithmId=${rithmId}`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should successfully fetch data for dashboard supervisor roster', () => {
    const rithmId = 'E204F369-386F-4E41-B3CA-2459E674DF52';
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

    service.getSupervisorRoster(rithmId).subscribe((response) => {
      expect(response.length).toBeGreaterThanOrEqual(0);
    });

    // outgoing request
    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/supervisor-roster?stationRithmId=${rithmId}`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return a list of priority queue documents', () => {
    const expectedResponse: Array<Document> = [
      {
        documentRithmId: '200E132A-3B78-433F-9E6C-22E3A0BDBD8B',
        documentName: 'Granola',
        stationRithmId: '9360D633-A1B9-4AC5-93E8-58316C1FDD9F',
        stationName: 'Step 4',
        priority: 18,
        flowedTimeUTC: '2021-06-18T21:17:34.3506612Z',
        updatedTimeUTC: '',
        isEscalated: false,
        userAssigned: user,
      },
    ];

    service.getPriorityQueueDocuments().subscribe((response) => {
      expect(response.length).toBeGreaterThanOrEqual(0);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/priority-documents`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return a list of previously started documents', () => {
    const expectedResponse: Array<Document> = [
      {
        documentRithmId: '200E132A-3B78-433F-9E6C-22E3A0BDBD8B',
        documentName: 'Granola',
        stationRithmId: '9360D633-A1B9-4AC5-93E8-58316C1FDD9F',
        stationName: 'Step 4',
        priority: 18,
        flowedTimeUTC: '2021-06-18T21:17:34.3506612Z',
        updatedTimeUTC: '',
        isEscalated: false,
        userAssigned: user,
      },
    ];

    service.getPreviouslyStartedDocuments().subscribe((response) => {
      expect(response.length).toBeGreaterThanOrEqual(0);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/previously-started-documents`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return a list of widgets for dashboard', () => {
    const expectDashboardData: DashboardData = {
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
    service
      .getDashboardWidgets(expectDashboardData.rithmId)
      .subscribe((response) => {
        expect(response).toEqual(expectDashboardData);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/widgets?dashboardRithmId=${expectDashboardData.rithmId}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('dashboardRithmId')).toEqual(
      expectDashboardData.rithmId
    );
    req.flush(expectDashboardData);
    httpTestingController.verify();
  });

  it('should return updated dashboard', () => {
    const updateDashboard: DashboardData = {
      rithmId: '',
      name: 'Untitled Dashboard',
      type: RoleDashboardMenu.Personal,
      widgets: [
        {
          rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
          cols: 0,
          rows: 0,
          x: 0,
          y: 0,
          widgetType: WidgetType.Station,
          data: 'string',
          minItemRows: 0,
          maxItemRows: 0,
          minItemCols: 0,
          maxItemCols: 0,
        },
      ],
    };
    service.updatePersonalDashboard(updateDashboard).subscribe((response) => {
      expect(response).toEqual(updateDashboard);
    });
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/personal`
    );

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(updateDashboard);
    req.flush(updateDashboard);
    httpTestingController.verify();
  });
  it('should returns organization dashboard', () => {
    const expectedResponse: DashboardData[] = [
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

    service.getOrganizationDashboard().subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/company`
    );

    expect(req.request.method).toEqual('GET');
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should returns user`s customized dashboards', () => {
    const expectedResponse: DashboardData[] = [
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

    service.getPersonalDashboard().subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/personal`
    );

    expect(req.request.method).toEqual('GET');
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return a new dashboard personal', () => {
    const expectedResponse: DashboardData = {
      rithmId: '102030405060708090100',
      name: 'Untitled Dashboard',
      type: RoleDashboardMenu.Personal,
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

    const expectBody = { name: expectedResponse.name };

    service.generateNewPersonalDashboard().subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/personal`
    );

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(expectBody);
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return new data for dashboard when update dashboard', () => {
    const dashboardData: DashboardData = {
      rithmId: '247cf568-27a4-4968-9338-046ccfee24f3',
      name: 'name',
      type: RoleDashboardMenu.Company,
      widgets: [
        {
          rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
          cols: 1,
          rows: 2,
          x: 0,
          y: 0,
          widgetType: WidgetType.Document,
          data: 'string',
          minItemRows: 1,
          maxItemRows: 2,
          minItemCols: 1,
          maxItemCols: 2,
        },
      ],
    };

    service.updateOrganizationDashboard(dashboardData).subscribe((response) => {
      expect(response).toEqual(dashboardData);
    });
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/company`
    );

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(dashboardData);
    req.flush(dashboardData);
    httpTestingController.verify();
  });

  it('should return a new organization dashboard', () => {
    const expectedResponse: DashboardData = {
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

    const expectBody = { name: expectedResponse.name };
    service.generateNewOrganizationDashboard().subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/company`
    );

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(expectBody);
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should be true the emit and subscribe to subject isLoadingDashboard$', () => {
    service.isLoadingDashboard$.subscribe(({ statusLoading, getParams }) => {
      expect(statusLoading).toBeTrue();
      expect(getParams).toBeFalse();
    });

    service.toggleLoadingDashboard(true);
  });

  it('should be false the emit and subscribe to subject isLoadingDashboard$', () => {
    service.isLoadingDashboard$.subscribe(({ statusLoading, getParams }) => {
      expect(statusLoading).toBeFalse();
      expect(getParams).toBeFalse();
    });

    service.toggleLoadingDashboard(false);
  });

  it('should delete a personal dashboard', () => {
    const rithmId = '247cf568-27a4-4968-9338-046ccfee24f3';
    service.deletePersonalDashboard(rithmId).subscribe((response) => {
      expect(response).toBeFalsy();
    });
  });

  it('should delete a organization dashboard', () => {
    const rithmId = 'E204F369-386F-4E41-B3CA-2459E674DF52';
    service.deleteOrganizationDashboard(rithmId).subscribe((response) => {
      expect(response).toBeFalsy();
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/company?rithmId=${rithmId}`
    );
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
    httpTestingController.verify();
  });

  it('should delete a personal dashboard', () => {
    const rithmId = 'E204F369-386F-4E41-B3CA-2459E674DF52';
    service.deletePersonalDashboard(rithmId).subscribe((response) => {
      expect(response).toBeFalsy();
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/personal?rithmId=${rithmId}`
    );
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
    httpTestingController.verify();
  });

  it('should emit updateDataWidget$', () => {
    const expectEditDataWidget: EditDataWidget = {
      widgetIndex: 1,
      widgetItem: {
        rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
        cols: 4,
        rows: 1,
        x: 0,
        y: 0,
        widgetType: WidgetType.Station,
        data: '{"stationRithmId":"247cf568-27a4-4968-9338-046ccfee24f3","columns":[]}',
        minItemCols: 4,
        minItemRows: 4,
        maxItemCols: 12,
        maxItemRows: 12,
      },
      quantityElementsWidget: 2,
    };
    service.updateDataWidget$.subscribe((editDataWidget) => {
      expect(editDataWidget).toEqual(expectEditDataWidget);
    });
    service.updateDashboardWidgets(expectEditDataWidget);
  });

  it('should get list tab documents', () => {
    const nameToSearch = 'document';
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
    service.getDocumentTabList(nameToSearch).subscribe((response) => {
      expect(response).toEqual(itemListWidgetModal);
    });
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/library-documents?name=${nameToSearch}`
    );

    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('name')).toEqual(nameToSearch);
    req.flush(itemListWidgetModal);
    httpTestingController.verify();
  });

  it('should get tab list for stations', () => {
    const nameToSearch = 'station';
    const expectDataResponse: ItemListWidgetModal[] = [
      {
        rithmId: '9360D633-A1B9-4AC5-93E8-58316C1FDD9F',
        name: 'Stationy Name that is namey',
        groupName: 'Groupygroup',
        isChained: false,
        totalDocuments: 2,
      },
    ];
    service.getStationTabList(nameToSearch).subscribe((response) => {
      expect(response).toEqual(expectDataResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/library-stations?name=${nameToSearch}`
    );

    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('name')).toEqual(nameToSearch);
    req.flush(expectDataResponse);
    httpTestingController.verify();
  });

  it('should get list tab groups station', () => {
    const nameToSearch = 'group';
    const expectDataResponse: ItemListWidgetModal[] = [
      {
        rithmId: '9360D633-A1B9-4AC5-93E8-58316C1FDD9F',
        name: 'Group Name',
        isChained: false,
        totalStations: 2,
        totalSubGroups: 9,
      },
    ];
    service.getGroupStationTabList(nameToSearch).subscribe((response) => {
      expect(response).toEqual(expectDataResponse);
    });
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/library-stationgroups?name=${nameToSearch}`
    );

    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('name')).toEqual(nameToSearch);
    req.flush(expectDataResponse);
    httpTestingController.verify();
  });

  it('should clear columns repeat in data columns widget station', () => {
    const columns: ColumnFieldsWidget[] = [
      {
        name: 'name',
      },
      {
        name: 'some name',
        questionId: '123-456-789',
      },
      {
        name: 'some name',
        questionId: '123-456-789',
      },
      {
        name: 'some name 3',
        questionId: '987-654-321',
      },
    ];
    const expectedColumns: ColumnFieldsWidget[] = [
      {
        name: 'name',
      },
      {
        name: 'some name',
        questionId: '123-456-789',
      },
      {
        name: 'some name 3',
        questionId: '987-654-321',
      },
    ];

    expect(service.groupColumnsStationWidget(columns)).toEqual(expectedColumns);
  });

  it('should add user to dashboard', () => {
    const dashboardRithmId = '123-123-123';
    const expectDataResponse: User[] = [
      {
        rithmId: '1234',
        firstName: 'Testy',
        lastName: 'Test',
        email: 'test@test.com',
        isEmailVerified: true,
        notificationSettings: null,
        createdDate: '1/2/34',
        role: null,
        organization: 'kdjfkd-kjdkfjd-jkjdfkdjk',
        defaultDashboardType: RoleDashboardMenu.Company,
        defaultDashboardId: '147cf568-27a4-4968-5628-046ccfee24fd',
      },
      {
        rithmId: '123',
        firstName: 'Testy',
        lastName: 'Test',
        email: 'test@test.com',
        isEmailVerified: true,
        notificationSettings: null,
        createdDate: '1/2/34',
        role: 'admin',
        organization: 'kdjfkd-kjdkfjd-jkjdfkdjk',
        defaultDashboardType: RoleDashboardMenu.Personal,
        defaultDashboardId: '547cf568-27a4-4968-5628-046ccfee24fd',
      },
    ];
    service
      .addDashboardMembers(dashboardRithmId, expectDataResponse)
      .subscribe((response) => {
        expect(response).toEqual(expectDataResponse);
      });
  });
});
