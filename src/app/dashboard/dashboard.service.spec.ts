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
} from 'src/models';
import { environment } from 'src/environments/environment';
import { DashboardService } from './dashboard.service';
import { DashboardStationData, StationRosterMember } from 'src/models';
import { RouterTestingModule } from '@angular/router/testing';

const MICROSERVICE_PATH = '/dashboardservice/api/dashboard';

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
        userAssigned: '',
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
        userAssigned: '',
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
    service.isLoadingDashboard$.subscribe((status) => {
      expect(status).toBeTrue();
    });

    service.toggleLoadingDashboard(true);
  });

  it('should be false the emit and subscribe to subject isLoadingDashboard$', () => {
    service.isLoadingDashboard$.subscribe((status) => {
      expect(status).toBeFalse();
    });

    service.toggleLoadingDashboard(false);
  });

  it('should delete a personal dashboard', () => {
    const rithmId = '247cf568-27a4-4968-9338-046ccfee24f3';
    service.deletePersonalDashboard(rithmId).subscribe((response) => {
      expect(response).toBeFalsy();
    });
  });
});
