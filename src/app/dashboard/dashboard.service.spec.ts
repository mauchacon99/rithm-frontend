import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WorkerDashboardHeader, Document } from 'src/models';
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
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
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
      rosterStations: 4
    };

    service.getDashboardHeader()
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    // outgoing request
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/header`);
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
          {userRithmId: '', firstName: 'Supervisor', lastName : 'User', isAssigned: false, email: 'supervisoruser@inpivota.com'},
          {userRithmId: '', firstName: 'Harry', lastName : 'Potter', isAssigned: false, email: 'harrypotter@inpivota.com'}
        ]
      },
      {
        rithmId: '2',
        numberOfDocuments: 2,
        stationName: 'station-2',
        numberOfWorkers: 6,
        worker: [
          {userRithmId: '', firstName: 'Worker', lastName : 'User', isAssigned: false, email: 'workeruser@inpivota.com'},
          {userRithmId: '', firstName: 'Supervisor', lastName : 'User', isAssigned: false, email: 'supervisoruser@inpivota.com'}
        ]
      }
    ];

    service.getDashboardStations()
      .subscribe((response) => {
        expect(response.length).toBeGreaterThanOrEqual(0);
      });

    // outgoing request
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/stations`);
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should successfully fetch data for dashboard worker roster', () => {
    const rithmId = 'E204F369-386F-4E41-B3CA-2459E674DF52';
    const expectedResponse: Array<StationRosterMember> = [
      {
        userRithmId: '',
        firstName: 'Adarsh',
        lastName: 'Achar',
        email: 'adarsh.achar@inpivota.com'
      },
      {
        userRithmId: '',
        firstName: 'Tyler',
        lastName: 'Hendrickson',
        email: 'tyler.hendrickson@rithm.software'
      }
    ];

    service.getWorkerRoster(rithmId)
      .subscribe((response) => {
        expect(response.length).toBeGreaterThanOrEqual(0);
      });

    // outgoing request
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/station-roster?stationRithmId=${rithmId}`);
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should successfully fetch data for dashboard supervisor roster', () => {
    const rithmId = 'E204F369-386F-4E41-B3CA-2459E674DF52';
    const expectedResponse: Array<StationRosterMember> = [
      {
        userRithmId: '',
        firstName: 'Adarsh',
        lastName: 'Achar',
        email: 'adarsh.achar@inpivota.com'
      },
      {
        userRithmId: '',
        firstName: 'Tyler',
        lastName: 'Hendrickson',
        email: 'tyler.hendrickson@rithm.software'
      }
    ];

    service.getSupervisorRoster(rithmId)
      .subscribe((response) => {
        expect(response.length).toBeGreaterThanOrEqual(0);
      });

    // outgoing request
    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/supervisor-roster?stationRithmId=${rithmId}`);
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
        userAssigned: ''
      }];

    service.getPriorityQueueDocuments()
      .subscribe((response) => {
        expect(response.length).toBeGreaterThanOrEqual(0);
      });

    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/priority-documents`);
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
        userAssigned: ''
      }];

    service.getPreviouslyStartedDocuments()
      .subscribe((response) => {
        expect(response.length).toBeGreaterThanOrEqual(0);
      });

    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/previously-started-documents`);
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

});
