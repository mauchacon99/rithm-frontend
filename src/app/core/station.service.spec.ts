import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import {
  DocumentGenerationStatus,
  StationRosterMember,
  Question,
  QuestionFieldType,
  Station,
  StationInformation,
  StationPotentialRostersUsers,
  ForwardPreviousStationsDocument,
  StandardStringJSON,
  DocumentNameField,
  StandardBooleanJSON,
  StationGroupData,
  StationFrameWidget,
  FrameType,
  StandardNumberJSON,
  DocumentEvent,
  GroupTrafficData,
  StationWidgetPreBuilt,
  RoleDashboardMenu,
} from 'src/models';
import { StationOptimized } from 'src/models/station-optimized';
import { StationService } from './station.service';

const MICROSERVICE_PATH = '/stationservice/api/station';
const MICROSERVICE_PATH_STATION_GROUP = '/stationservice/api/stationGroup';

describe('StationService', () => {
  let service: StationService;
  let httpTestingController: HttpTestingController;
  const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
  const stationGroupRithmId = 'ED6148C9-ABB7-408E-A210-8556S88D5SDS2';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(StationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return station information', () => {
    const expectedResponse = {
      rithmId: stationId,
      name: 'Dry Goods & Liquids',
      instructions: 'General instructions',
      dueDate: '2021-08-22T17:26:47.3506612Z',
      nextStations: [
        {
          stationName: 'Development',
          totalDocuments: 5,
          isGenerator: true,
        },
      ],
      previousStations: [
        {
          stationName: 'Station-1',
          totalDocuments: 2,
          isGenerator: true,
        },
      ],
      stationOwners: [
        {
          rithmId: '',
          firstName: 'Marry',
          lastName: 'Poppins',
          email: 'marrypoppins@inpivota.com',
          isOwner: false,
          isWorker: true,
        },
      ],
      workers: [
        {
          rithmId: '',
          firstName: 'Harry',
          lastName: 'Potter',
          email: 'harrypotter@inpivota.com',
          isOwner: false,
          isWorker: true,
        },
      ],
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: [],
    };

    service.getStationInfo(stationId).subscribe((response) => {
      expect(response).toBeDefined();
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/station-info?stationRithmId=${stationId}`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return a list of all stations', () => {
    const expectedResponse: Station = {
      name: 'Example Station',
      rithmId: '3j4k-3h2j-hj4j',
      instructions: 'Do as I instruct',
    };

    service.getAllStations().subscribe((response) => {
      expect(response).toBeDefined();
    });

    // outgoing request
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return station information with updated data', () => {
    const station: StationInformation = {
      rithmId: 'E204F369-386F-4E41',
      name: 'Station Name',
      instructions: 'General instructions',
      nextStations: [
        {
          name: 'Development',
          rithmId: '123-321-654',
        },
      ],
      previousStations: [
        {
          name: 'Station-1',
          rithmId: '159-357-761',
        },
      ],
      stationOwners: [
        {
          rithmId: '',
          firstName: 'Marry',
          lastName: 'Poppins',
          email: 'marrypoppins@inpivota.com',
          isWorker: true,
          isOwner: false,
        },
      ],
      workers: [
        {
          rithmId: '',
          firstName: 'Harry',
          lastName: 'Potter',
          email: 'harrypotter@inpivota.com',
          isWorker: true,
          isOwner: false,
        },
      ],
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: [],
      priority: 1,
      allowPreviousButton: false,
      allowAllOrgWorkers: false,
      allowExternalWorkers: true,
      flowButton: 'Flow',
      isChained: false,
    };

    const expectedResponse: StationInformation = {
      rithmId: station.rithmId,
      name: station.name,
      instructions: 'General instructions',
      nextStations: [
        {
          name: 'Development',
          rithmId: '123-869-742',
        },
      ],
      previousStations: [
        {
          name: 'Station-1',
          rithmId: '258-635-412',
        },
      ],
      stationOwners: [
        {
          rithmId: '',
          firstName: 'Marry',
          lastName: 'Poppins',
          email: 'marrypoppins@inpivota.com',
          isWorker: true,
          isOwner: false,
        },
      ],
      workers: [
        {
          rithmId: '',
          firstName: 'Harry',
          lastName: 'Potter',
          email: 'harrypotter@inpivota.com',
          isWorker: true,
          isOwner: false,
        },
      ],
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: [],
      priority: 1,
      allowPreviousButton: false,
      allowAllOrgWorkers: false,
      allowExternalWorkers: true,
      flowButton: 'Flow',
      isChained: false,
    };

    service.updateStation(station).subscribe((response) => {
      expect(response).toBe(expectedResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/${station.rithmId}`
    );
    expect(req.request.method).toEqual('PUT');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return updated date from a specific station', () => {
    const expectedResponse = '2021-07-18T17:26:47.3506612Z';

    service.getLastUpdated(stationId).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/last-updated?rithmId=${stationId}`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return the status of the specific document', () => {
    const expectedResponse = DocumentGenerationStatus.None;

    service
      .getStationDocumentGenerationStatus(stationId)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/generator-status?rithmId=${stationId}`
    );
    expect(req.request.method).toEqual('GET');

    req.flush({ data: expectedResponse });
    httpTestingController.verify();
  });

  it('should return the status of the specific document once the status is updated', () => {
    const status = DocumentGenerationStatus.Manual;
    service
      .updateStationDocumentGenerationStatus(stationId, status)
      .subscribe((response) => {
        expect(response).toEqual(status);
      });
    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/generator-status?stationRithmId=${stationId}`
    );
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual({ data: status });

    req.flush({ data: status });
    httpTestingController.verify();
  });

  it('should return a list of stations private/all questions', () => {
    const isPrivate = true;
    const expectedResponse: Question[] = [
      {
        prompt: 'Fake question 1',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
      {
        prompt: 'Fake question 2',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
    ];

    service
      .getStationPreviousQuestions(stationId, isPrivate)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/previous-questions?stationRithmId=${stationId}&getPrivate=${isPrivate}`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should update the station questions list', () => {
    const expectedResponse: Question[] = [
      {
        prompt: 'Example question#1',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
      {
        prompt: 'Example question#2',
        rithmId: '3j5k-3h2j-hj5j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
    ];
    service
      .updateStationQuestions(stationId, expectedResponse)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/questions?stationRithmId=${stationId}`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(expectedResponse);
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should add a new member to the worker roster', () => {
    const usersIds: string[] = [
      '495FC055-4472-45FE-A68E-B7A0D060E1C8',
      '49B1A2B4-7B2A-466E-93F9-78F14A672052',
    ];
    const expectedResponse: StationRosterMember[] = [
      {
        rithmId: '',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
      {
        rithmId: '',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
    ];

    service
      .addUsersToWorkerRoster(stationId, usersIds)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-roster-user?stationRithmId=${stationId}`
    );
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(usersIds);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return the potential roster members of the station', () => {
    const pageNum = 1;
    const pageSize = 20;
    const expectedResponse: StationPotentialRostersUsers = {
      users: [
        {
          rithmId: '12dasd1-asd12asdasd-asdas',
          firstName: 'Cesar',
          lastName: 'Quijada',
          email: 'strut@gmail.com',
          isOwner: true,
          isWorker: true,
        },
        {
          rithmId: '12dasd1-asd12asdasd-ffff1',
          firstName: 'Maria',
          lastName: 'Quintero',
          email: 'Maquin@gmail.com',
          isOwner: true,
          isWorker: true,
        },
        {
          rithmId: '12dasd1-asd12asdasd-a231',
          firstName: 'Pedro',
          lastName: 'Perez',
          email: 'pperez@gmail.com',
          isOwner: true,
          isWorker: true,
        },
      ],
      totalUsers: 3,
    };

    service
      .getPotentialStationRosterMembers(stationId, pageNum)
      .subscribe((users) => {
        expect(users).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(
      // eslint-disable-next-line max-len
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/potential-roster-users?stationRithmId=${stationId}&pageNum=${pageNum}&pageSize=${pageSize}`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should delete a station', () => {
    service.deleteStation(stationId).subscribe((response) => {
      expect(response).toBeFalsy();
    });
  });

  it('should remove a member from worker roster', () => {
    const userIdList: Array<string> = ['495FC055-4472-45FE-A68E-B7A0D060E1C8'];
    const expectedResponse: StationRosterMember[] = [
      {
        rithmId: '12dasd1-asd12asdasd-asdas',
        firstName: 'Cesar',
        lastName: 'Quijada',
        email: 'strut@gmail.com',
        isOwner: true,
        isWorker: true,
      },
      {
        rithmId: '12dasd1-asd12asdasd-ffff1',
        firstName: 'Maria',
        lastName: 'Quintero',
        email: 'Maquin@gmail.com',
        isOwner: true,
        isWorker: true,
      },
      {
        rithmId: '12dasd1-asd12asdasd-a231',
        firstName: 'Pedro',
        lastName: 'Perez',
        email: 'pperez@gmail.com',
        isOwner: true,
        isWorker: true,
      },
    ];

    service
      .removeUsersFromWorkerRoster(stationId, userIdList)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-roster-user?stationRithmId=${stationId}`
    );
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.body).toEqual(userIdList);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should returns a worker roster for a given station', () => {
    const expectedResponse: StationRosterMember[] = [
      {
        rithmId: '495FC055-4472-45FE-A68E-B7A0D060E1C8',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isOwner: true,
        isWorker: true,
      },
      {
        rithmId: '49B1A2B4-7B2A-466E-93F9-78F14A672052',
        firstName: 'Rithm',
        lastName: 'User',
        email: 'rithmuser@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
    ];

    service.getStationWorkerRoster(stationId).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-roster?rithmId=${stationId}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('rithmId')).toBe(stationId);
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should returns the owner roster for a given station', () => {
    const expectedResponse: StationRosterMember[] = [
      {
        rithmId: '495FC055-4472-45FE-A68E-B7A0D060E1C8',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isOwner: true,
        isWorker: false,
      },
      {
        rithmId: '49B1A2B4-7B2A-466E-93F9-78F14A672052',
        firstName: 'Rithm',
        lastName: 'User',
        email: 'rithmuser@inpivota.com',
        isOwner: true,
        isWorker: false,
      },
    ];

    service.getStationOwnerRoster(stationId).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/owner-users?stationRithmId=${stationId}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('stationRithmId')).toBe(stationId);
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should add a new member to the owner roster', () => {
    const userIdList: Array<string> = ['495FC055-4472-45FE-A68E-B7A0D060E1C8'];
    const expectedResponse: StationRosterMember[] = [
      {
        rithmId: 'C5C1480C-461E-4267-BBB1-BB79E489F991',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isOwner: true,
        isWorker: false,
      },
      {
        rithmId: 'C5C1480C-461E-4267-BBB1-BB79E489F992',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isOwner: true,
        isWorker: false,
      },
    ];

    service
      .addUsersToOwnersRoster(stationId, userIdList)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/owner-user?stationRithmId=${stationId}`
    );
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(userIdList);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should remove a member the owner from the roster', () => {
    const usersIds: Array<string> = ['495FC055-4472-45FE-A68E-B7A0D060E1C8'];
    const expectedResponse: StationRosterMember[] = [
      {
        rithmId: '12dasd1-asd12asdasd-asdas',
        firstName: 'Cesar',
        lastName: 'Quijada',
        email: 'strut@gmail.com',
        isOwner: true,
        isWorker: false,
      },
      {
        rithmId: '12dasd1-asd12asdasd-ffff1',
        firstName: 'Maria',
        lastName: 'Quintero',
        email: 'Maquin@gmail.com',
        isOwner: true,
        isWorker: true,
      },
      {
        rithmId: '12dasd1-asd12asdasd-a231',
        firstName: 'Pedro',
        lastName: 'Perez',
        email: 'pperez@gmail.com',
        isOwner: true,
        isWorker: false,
      },
    ];

    service
      .removeUsersFromOwnerRoster(stationId, usersIds)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/owner-user?stationRithmId=${stationId}`
    );
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.body).toEqual(usersIds);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should update the editable status of the document in the station', () => {
    const stationRithmId = '247cf568-27a4-4968-9338-046ccfee24f3';
    const newStatus = true;
    service
      .updateStatusDocumentEditable(stationRithmId, newStatus)
      .subscribe((response) => {
        expect(response).toEqual(newStatus);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-rename-document?stationRithmId=${stationRithmId}&canRename=${newStatus}`
    );
    expect(req.request.method).toEqual('PUT');

    req.flush(newStatus);
    httpTestingController.verify();
  });

  it('should get the current editable status of the document', () => {
    const stationRithmId = '247cf568-27a4-4968-9338-046ccfee24f3';
    const expectedResponse = true;

    service.getStatusDocumentEditable(stationRithmId).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-rename-document?stationRithmId=${stationRithmId}`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return the station owners roster', () => {
    const expectedResponse: StationRosterMember[] = [
      {
        rithmId: '49B1A2B4-7B2A-466E-93F9-78F14A672052',
        firstName: 'Rithm',
        lastName: 'User',
        email: 'rithmuser@inpivota.com',
        isWorker: false,
        isOwner: true,
      },
    ];
    service.getStationOwnerRoster(stationId).subscribe((orgInfo) => {
      expect(orgInfo).toEqual(expectedResponse);
    });
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/owner-users?stationRithmId=${stationId}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return the previous and following stations', () => {
    const stationRithmId = '4eca65f1-89ef-4970-8aa5-8a26a5e45628';
    const expectedResponse: ForwardPreviousStationsDocument = {
      rithmId: stationRithmId,
      previousStations: [
        {
          rithmId: '789-654-321',
          name: 'Previous station 1',
          totalDocuments: 5,
        },
        {
          rithmId: '789-654-753',
          name: 'Previous station 2',
          totalDocuments: 2,
        },
      ],
      nextStations: [
        {
          rithmId: '852-963-741',
          name: 'Follow station 1',
          totalDocuments: 2,
        },
        {
          rithmId: '852-963-418',
          name: 'Follow station 2',
          totalDocuments: 1,
        },
      ],
    };
    service
      .getPreviousAndNextStations(stationRithmId)
      .subscribe((prevAndNextStations) => {
        expect(prevAndNextStations).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/prev-next-stations?stationRithmId=${stationRithmId}`
    );
    expect(req.request.params.get('stationRithmId')).toBe(
      '4eca65f1-89ef-4970-8aa5-8a26a5e45628'
    );
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should update the station name', () => {
    const newName = 'Edited Station Name';
    const station: StationInformation = {
      rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      name: 'New Station Name',
      instructions: '',
      nextStations: [
        {
          rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1X',
          name: 'Development',
          totalDocuments: 5,
          isGenerator: true,
        },
      ],
      previousStations: [
        {
          rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1Y',
          name: 'Station-1',
          totalDocuments: 2,
          isGenerator: true,
        },
        {
          rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1Z',
          name: 'Station-2',
          totalDocuments: 0,
          isGenerator: false,
        },
      ],
      stationOwners: [
        {
          rithmId: '',
          firstName: 'Marry',
          lastName: 'Poppins',
          email: 'marrypoppins@inpivota.com',
          isWorker: false,
          isOwner: true,
        },
        {
          rithmId: '',
          firstName: 'Worker',
          lastName: 'User',
          email: 'workeruser@inpivota.com',
          isWorker: false,
          isOwner: true,
        },
      ],
      workers: [
        {
          rithmId: '',
          firstName: 'Harry',
          lastName: 'Potter',
          email: 'harrypotter@inpivota.com',
          isWorker: false,
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
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: [],
      priority: 2,
      allowPreviousButton: false,
      allowAllOrgWorkers: false,
      allowExternalWorkers: true,
      flowButton: 'Flow',
      isChained: false,
    };

    service.updateStationName(newName, station.rithmId);
    const stationRithmId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
    service.updateStationName(newName, stationRithmId).subscribe((response) => {
      expect(response).toBe(newName);
    });
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/name?rithmId=${stationRithmId}`
    );
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual({ data: newName });
    req.flush({ data: newName });
    httpTestingController.verify();
  });

  it('should test connection to get the station Document name template', () => {
    const expectData: DocumentNameField[] = [
      {
        prompt: 'Address',
        questionRithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a',
      },
      {
        prompt: '/',
        questionRithmId: '',
      },
      {
        prompt: 'Which is best?',
        questionRithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a',
      },
    ];

    service.getDocumentNameTemplate(stationId).subscribe((response) => {
      expect(response).toEqual(expectData);
    });
    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/document-naming-template?stationRithmId=${stationId}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toEqual(null);

    req.flush(expectData);
    httpTestingController.verify();
  });

  it('should test connection to service to update station document name template', () => {
    const appendedFields: DocumentNameField[] = [
      {
        prompt: 'Address',
        questionRithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a',
      },
      {
        prompt: '/',
        questionRithmId: '',
      },
      {
        prompt: 'Which is best?',
        questionRithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a',
      },
    ];

    service
      .updateDocumentNameTemplate(stationId, appendedFields)
      .subscribe((response) => {
        expect(response).toEqual(appendedFields);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/document-naming-template?stationRithmId=${stationId}`
    );
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(appendedFields);
    req.flush(appendedFields);
    httpTestingController.verify();
  });

  it('should return the station with updated general instructions', () => {
    const instructions = 'New Instructions for current Station';
    const expectedResponse: StandardStringJSON = {
      data: 'New Instructions for current Station',
    };
    service
      .updateStationGeneralInstructions(stationId, instructions)
      .subscribe((stationInfo) => {
        expect(stationInfo).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/instructions?rithmId=${stationId}`
    );
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual({ data: instructions });
    req.flush({ data: instructions });
    httpTestingController.verify();
  });

  it('should return a list of current and previous questions for stations', () => {
    const includePreviousQuestions = false;
    const expectedResponse: Question[] = [
      {
        prompt: 'Fake question 1',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
      {
        prompt: 'Fake question 2',
        rithmId: '3j4k-3h2j-hj5j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
    ];

    service
      .getStationQuestions(stationId, includePreviousQuestions)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });
  });

  it('should get the questions for station', () => {
    const includePreviousQuestions = false;
    const expectedResponse: Question[] = [
      {
        prompt: 'Fake question 1',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
      {
        prompt: 'Fake question 2',
        rithmId: '3j4k-3h2j-hj5j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
    ];

    service
      .getStationQuestions(stationId, includePreviousQuestions)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(
      // eslint-disable-next-line max-len
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/questions?stationRithmId=${stationId}&includePreviousQuestions=${includePreviousQuestions}`
    );
    expect(req.request.params).toBeTruthy();
    expect(req.request.method).toEqual('GET');
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should get the allow external workers', () => {
    const expectedResponse: StandardBooleanJSON = {
      data: true,
    };

    service.getAllowExternalWorkers(stationId).subscribe((response) => {
      expect(response).toEqual(expectedResponse.data);
    });

    const router = `${environment.baseApiUrl}${MICROSERVICE_PATH}/allow-external-workers?rithmId=${stationId}`;
    const req = httpTestingController.expectOne(router);
    expect(req.request.url).toBe(router);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should get the allow previous button for the document', () => {
    const expectedResponse: StandardBooleanJSON = {
      data: true,
    };

    service.getAllowPreviousButton(stationId).subscribe((response) => {
      expect(response).toEqual(expectedResponse.data);
    });

    const router = `${environment.baseApiUrl}${MICROSERVICE_PATH}/allow-previous-button?rithmId=${stationId}`;
    const req = httpTestingController.expectOne(router);
    expect(req.request.url).toBe(router);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should update the allow external workers status in the station', () => {
    const allowExtWorkers = true;
    const expectedResponse: StandardBooleanJSON = {
      data: true,
    };
    service
      .updateAllowExternalWorkers(stationId, allowExtWorkers)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse.data);
      });
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/allow-external-workers?rithmId=${stationId}`
    );
    expect(req.request.params).toBeTruthy();
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(expectedResponse);
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return the value of allow all org workers', () => {
    const expectedResponse: StandardBooleanJSON = {
      data: true,
    };

    service.getAllowAllOrgWorkers(stationId).subscribe((response) => {
      expect(response).toEqual(expectedResponse.data);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/allow-all-org-workers?rithmId=${stationId}`
    );
    expect(req.request.params.get('rithmId')).toBe(stationId);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should update the allowAllOrgWorkers status in station', () => {
    const expectedResponse: StandardBooleanJSON = {
      data: true,
    };
    const allowAllOrgWorkers = true;
    service
      .updateAllowAllOrgWorkers(stationId, allowAllOrgWorkers)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse.data);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/allow-all-org-workers?rithmId=${stationId}`
    );
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(expectedResponse);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should test the behavior subject of flow button text', () => {
    service.flowButtonText$.subscribe((flowButtonText) => {
      expect(flowButtonText).toBe('Flow');
    });
    service.updatedFlowButtonText('Flow');
  });

  it('should update the state of the allow-previous-button button for the station', () => {
    const expectedResponse: StandardBooleanJSON = {
      data: true,
    };
    service.updateAllowPreviousButton(stationId, true).subscribe((response) => {
      expect(response).toEqual(expectedResponse.data);
    });
    const router = `${environment.baseApiUrl}${MICROSERVICE_PATH}/allow-previous-button?rithmId=${stationId}`;
    const req = httpTestingController.expectOne(router);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(expectedResponse);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return the status when updated the flow button text', () => {
    const expectedResponse: StandardStringJSON = {
      data: 'test',
    };
    const flowButtonText = 'test';
    service
      .updateFlowButtonText(stationId, flowButtonText)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse.data);
      });
    const router = `${environment.baseApiUrl}${MICROSERVICE_PATH}/flow-button?stationRithmId=${stationId}`;
    const req = httpTestingController.expectOne(router);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(expectedResponse);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return the flow button text', () => {
    const expectedResponse: StandardStringJSON = {
      data: 'Flow',
    };
    service.getFlowButtonText(stationId).subscribe((response) => {
      expect(response).toEqual(expectedResponse.data);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/flow-button?stationRithmId=${stationId}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('stationRithmId')).toBe(stationId);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return the station group', () => {
    const depth = 1;
    const expectedResponse: StationGroupData = {
      rithmId: '6375027-78345-73824-54244',
      title: 'Station Group',
      subStationGroups: [
        {
          rithmId: '1375027-78345-73824-54244',
          title: 'Sub Station Group',
          subStationGroups: [],
          stations: [
            {
              rithmId: '123-321-456',
              name: 'station 1',
              totalDocuments: 3,
              workers: [
                {
                  rithmId: '123-321-456',
                  firstName: 'John',
                  lastName: 'Wayne',
                  email: 'name@company.com',
                  isWorker: true,
                  isOwner: true,
                },
              ],
              stationOwners: [
                {
                  rithmId: '789-798-456',
                  firstName: 'Peter',
                  lastName: 'Doe',
                  email: 'name1@company.com',
                  isWorker: true,
                  isOwner: true,
                },
              ],
            },
          ],
          users: [
            {
              rithmId: '789-798-456',
              firstName: 'Noah',
              lastName: 'Smith',
              email: 'name2@company.com',
              isWorker: true,
              isOwner: true,
            },
          ],
          admins: [
            {
              rithmId: '159-753-456',
              firstName: 'Taylor',
              lastName: 'Du',
              email: 'name3@company.com',
              isWorker: true,
              isOwner: true,
            },
          ],
          isChained: true,
          isImplicitRootStationGroup: true,
        },
      ],
      stations: [
        {
          rithmId: '123-321-456',
          name: 'station 1',
          totalDocuments: 3,
          workers: [
            {
              rithmId: '123-321-456',
              firstName: 'John',
              lastName: 'Wayne',
              email: 'name@company.com',
              isWorker: true,
              isOwner: true,
            },
          ],
          stationOwners: [
            {
              rithmId: '789-798-456',
              firstName: 'Peter',
              lastName: 'Doe',
              email: 'name1@company.com',
              isWorker: true,
              isOwner: true,
            },
          ],
        },
      ],
      users: [
        {
          rithmId: '789-798-456',
          firstName: 'Noah',
          lastName: 'Smith',
          email: 'name2@company.com',
          isWorker: true,
          isOwner: true,
        },
      ],
      admins: [
        {
          rithmId: '159-753-456',
          firstName: 'Taylor',
          lastName: 'Du',
          email: 'name3@company.com',
          isWorker: true,
          isOwner: true,
        },
      ],
      isChained: true,
      isImplicitRootStationGroup: true,
    };

    service.getStationGroups(stationId).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH_STATION_GROUP}/hierarchy?stationGroupRithmId=${stationId}&depth=${depth}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('stationGroupRithmId')).toBe(stationId);
    expect(req.request.params.get('depth')).toBe('1');

    req.flush(expectedResponse);
  });

  it('should return the status when updated the flow button text', () => {
    const expectedResponse: StandardStringJSON = {
      data: 'test',
    };
    const flowButtonText = 'test';
    service
      .updateFlowButtonText(stationId, flowButtonText)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse.data);
      });
    const router = `${environment.baseApiUrl}${MICROSERVICE_PATH}/flow-button?stationRithmId=${stationId}`;
    const req = httpTestingController.expectOne(router);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(expectedResponse);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should save/update the array of stationFramesWidget', () => {
    const frameStationWidget: StationFrameWidget[] = [
      {
        rithmId: '3813442c-82c6-4035-893a-86fa9deca7c3',
        stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        cols: 6,
        rows: 4,
        x: 0,
        y: 0,
        type: FrameType.Input,
        data: '',
        id: 0,
      },
    ];

    service
      .saveStationWidgets(stationId, frameStationWidget)
      .subscribe((response) => {
        expect(response).toEqual(frameStationWidget);
      });
    const router = `${environment.baseApiUrl}${MICROSERVICE_PATH}/frames?stationRithmId=${stationId}`;
    const req = httpTestingController.expectOne(router);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(frameStationWidget);

    req.flush(frameStationWidget);
    httpTestingController.verify();
  });

  it('should save/update the array of stationDataLinkFrames', () => {
    const frameStationWidget: StationFrameWidget[] = [
      {
        rithmId: '3813442c-82c6-4035-893a-86fa9deca7c3',
        stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        cols: 6,
        rows: 4,
        x: 0,
        y: 0,
        type: FrameType.DataLink,
        data: '',
        id: 0,
      },
    ];

    service
      .saveDataLinkFrames(stationId, frameStationWidget)
      .subscribe((response) => {
        expect(response).toEqual(frameStationWidget);
      });
    const router = `${environment.baseApiUrl}${MICROSERVICE_PATH}/data-links-frames?stationRithmId=${stationId}`;
    const req = httpTestingController.expectOne(router);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(frameStationWidget);

    req.flush(frameStationWidget);
    httpTestingController.verify();
  });

  it('should remove a member the owner from the roster for group specific', () => {
    const usersIds: Array<string> = ['495FC055-4472-45FE-A68E-B7A0D060E1C8'];
    const expectedResponse: StationRosterMember[] = [
      {
        rithmId: '12dasd1-asd12asdasd-asdas',
        firstName: 'Cesar',
        lastName: 'Quijada',
        email: 'strut@gmail.com',
        isOwner: true,
        isWorker: false,
      },
      {
        rithmId: '12dasd1-asd12asdasd-ffff1',
        firstName: 'Maria',
        lastName: 'Quintero',
        email: 'Maquin@gmail.com',
        isOwner: true,
        isWorker: true,
      },
      {
        rithmId: '12dasd1-asd12asdasd-a231',
        firstName: 'Pedro',
        lastName: 'Perez',
        email: 'pperez@gmail.com',
        isOwner: true,
        isWorker: false,
      },
    ];

    service
      .removeUsersFromOwnerRosterGroup(stationGroupRithmId, usersIds)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH_STATION_GROUP}/admins?stationGroupRithmId=${stationGroupRithmId}`
    );
    req.flush(expectedResponse);
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.body).toEqual(usersIds);
    httpTestingController.verify();
  });

  it('should remove a member from worker roster for group specific', () => {
    const userIdList: Array<string> = ['495FC055-4472-45FE-A68E-B7A0D060E1C8'];
    const expectedResponse: StationRosterMember[] = [
      {
        rithmId: '12dasd1-asd12asdasd-asdas',
        firstName: 'Cesar',
        lastName: 'Quijada',
        email: 'strut@gmail.com',
        isOwner: true,
        isWorker: true,
      },
      {
        rithmId: '12dasd1-asd12asdasd-ffff1',
        firstName: 'Maria',
        lastName: 'Quintero',
        email: 'Maquin@gmail.com',
        isOwner: true,
        isWorker: true,
      },
      {
        rithmId: '12dasd1-asd12asdasd-a231',
        firstName: 'Pedro',
        lastName: 'Perez',
        email: 'pperez@gmail.com',
        isOwner: true,
        isWorker: true,
      },
    ];
    service
      .removeUsersFromWorkerRosterGroup(stationGroupRithmId, userIdList)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH_STATION_GROUP}/roster?stationGroupRithmId=${stationGroupRithmId}`
    );
    req.flush(expectedResponse);
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.body).toEqual(userIdList);
    httpTestingController.verify();
  });

  it('should get station events history', () => {
    const stationRithmId = '6375027-78345-73824-54244';
    const expectHistoryResponse: DocumentEvent[] = [
      {
        eventTimeUTC: '2022-01-18T22:13:05.871Z',
        description: 'Event Document #1',
        user: {
          rithmId: '123',
          firstName: 'Testy',
          lastName: 'Test',
          email: 'test@test.com',
          isEmailVerified: true,
          notificationSettings: null,
          createdDate: '1/2/34',
          role: null,
          organization: 'kdjfkd-kjdkfjd-jkjdfkdjk',
          profileImageRithmId: '123-456-789',
          defaultDashboardType: RoleDashboardMenu.Personal,
          defaultDashboardId: '347cf568-27a4-4968-5628-046ccfee24fd',
        },
      },
    ];
    service.getStationHistory(stationRithmId).subscribe((response) => {
      expect(response).toEqual(expectHistoryResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/history?rithmId=${stationRithmId}`
    );
    req.flush(expectHistoryResponse);
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('rithmId')).toBeTruthy();
    expect(req.request.params.get('rithmId')).toEqual(stationRithmId);
    httpTestingController.verify();
  });

  it('should get getStationGroupOwnerRoster', () => {
    const expectedResponse: StationRosterMember[] = [
      {
        rithmId: '123-456-789',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
      {
        rithmId: '987-654-321',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
    ];

    service
      .getStationGroupOwnerRoster(stationGroupRithmId)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH_STATION_GROUP}/admins?stationGroupRithmId=${stationGroupRithmId}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params).toBeTruthy();
    expect(req.request.params.get('stationGroupRithmId')).toEqual(
      stationGroupRithmId
    );
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should get getStationGroupWorkerRoster', () => {
    const expectedResponse: StationRosterMember[] = [
      {
        rithmId: '123-456-789',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
      {
        rithmId: '987-654-321',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
    ];

    service
      .getStationGroupWorkerRoster(stationGroupRithmId)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH_STATION_GROUP}/roster?stationGroupRithmId=${stationGroupRithmId}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params).toBeTruthy();
    expect(req.request.params.get('stationGroupRithmId')).toEqual(
      stationGroupRithmId
    );
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should get getNumberOfContainer', () => {
    const expectedResponse: StandardNumberJSON = {
      data: 10,
    };
    service.getNumberOfContainers(stationId).subscribe((response) => {
      expect(response).toEqual(expectedResponse.data);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/number-of-documents?stationRithmId=${stationId}`
    );
    expect(req.request.params.get('stationRithmId')).toBe(stationId);
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should get getStationWidgets', () => {
    const expectedResponse: StationInformation = {
      rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      name: 'New Station Name',
      instructions: '',
      nextStations: [
        {
          rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1X',
          name: 'Development',
          totalDocuments: 5,
          isGenerator: true,
        },
      ],
      previousStations: [
        {
          rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1Y',
          name: 'Station-1',
          totalDocuments: 2,
          isGenerator: true,
        },
      ],
      stationOwners: [
        {
          rithmId: '',
          firstName: 'Marry',
          lastName: 'Poppins',
          email: 'marrypoppins@inpivota.com',
          isWorker: false,
          isOwner: true,
        },
      ],
      workers: [
        {
          rithmId: '',
          firstName: 'Harry',
          lastName: 'Potter',
          email: 'harrypotter@inpivota.com',
          isWorker: false,
          isOwner: false,
        },
      ],
      frames: [
        {
          rithmId: '9144-3f0d-e1f1',
          stationRithmId: 'qwe-321-ert-123',
          id: 0,
          x: 6,
          y: 1,
          cols: 6,
          rows: 4,
          type: FrameType.Headline,
          data: '',
          questions: [],
        },
      ],
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: [],
      priority: 2,
      allowPreviousButton: false,
      allowAllOrgWorkers: false,
      allowExternalWorkers: true,
      flowButton: 'Flow',
      isChained: false,
    };

    service.getStationWidgets(stationId).subscribe((response) => {
      expect(response).toEqual(expectedResponse.frames);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/station-info-frames?stationRithmId=${stationId}`
    );
    expect(req.request.params.get('stationRithmId')).toBe(stationId);
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should call getGroupTrafficData', () => {
    const expectedResponse: GroupTrafficData = {
      title: 'Group Eagle',
      stationGroupRithmId: stationId,
      labels: [
        'station 1',
        'station 2',
        'station 3',
        'station 4',
        'station 5 with a long text for test view',
        'station 6',
        'station 7',
      ],
      stationDocumentCounts: [10, 5, 8, 10, 20, 35, 7],
      averageDocumentFlow: [3000, 72000, 60, 2880, 10080, 40, 120],
      averageDocumentFlowLabels: [
        '2 days',
        '7 weeks',
        '1 hour',
        '2 days',
        '1 weeks',
        '40 minutes',
        '2 hour',
      ],
    };
    service.getGroupTrafficData(stationId, true).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH_STATION_GROUP}/traffic?rithmId=${stationId}&forceRefresh=true`
    );
    expect(req.request.params.get('rithmId')).toBe(stationId);
    expect(req.request.params.get('forceRefresh')).toBe('true');
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should call getStationWidgetPreBuiltData', () => {
    const expectedData: StationWidgetPreBuilt[] = [
      {
        rithmId: 'qwe-321-ert-123',
        name: 'Mars station',
        totalContainers: 5,
        groupName: 'Eagle',
        stationOwners: [
          {
            rithmId: '',
            firstName: 'Marry',
            lastName: 'Poppins',
            email: 'marrypoppins@inpivota.com',
            isOwner: false,
            isWorker: true,
          },
          {
            rithmId: '',
            firstName: 'Worker',
            lastName: 'User',
            email: 'workeruser@inpivota.com',
            isOwner: false,
            isWorker: true,
          },
        ],
      },
      {
        rithmId: '123-456-789',
        name: 'Grogu station',
        totalContainers: 1,
        groupName: '  ',
        stationOwners: [],
      },
    ];
    service.getStationWidgetPreBuiltData().subscribe((response) => {
      expect(response).toEqual(expectedData);
    });
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/member-station`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(expectedData);
    httpTestingController.verify();
  });

  it('should call saveInputFrameQuestions', () => {
    const frameRithmId = '3j4k-3h2j-hj4j-3j4k';
    const frameQuestions: Question[] = [
      {
        prompt: 'Example question#1',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
      {
        prompt: 'Example question#2',
        rithmId: '3j5k-3h2j-hj5j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
    ];
    service
      .saveInputFrameQuestions(frameRithmId, frameQuestions)
      .subscribe((response) => {
        expect(response).toEqual(frameQuestions);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/frame-questions?frameRithmId=${frameRithmId}`
    );
    expect(req.request.method).toEqual('POST');

    req.flush(frameQuestions);
    httpTestingController.verify();
  });

  it('should add a new member to station group owners roster', () => {
    const userIdList: Array<string> = ['495FC055-4472-45FE-A68E-B7A0D060E1C8'];
    const expectedResponse: StationRosterMember[] = [
      {
        rithmId: '123-456-789',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
      {
        rithmId: '987-654-321',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
    ];

    service
      .addUserStationGroupToOwnersRoster(stationGroupRithmId, userIdList)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH_STATION_GROUP}/admins?stationGroupRithmId=${stationGroupRithmId}`
    );
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(userIdList);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should add a new member to station group workers roster', () => {
    const userIdList: Array<string> = ['495FC055-4472-45FE-A68E-B7A0D060E1C8'];
    const expectedResponse: StationRosterMember[] = [
      {
        rithmId: '123-456-789',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
      {
        rithmId: '987-654-321',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
    ];

    service
      .addUserStationGroupWorkersRoster(stationGroupRithmId, userIdList)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH_STATION_GROUP}/roster?stationGroupRithmId=${stationGroupRithmId}`
    );
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(userIdList);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return the potential roster members of the stationGroup', () => {
    const pageNum = 1;
    const pageSize = 20;
    const expectedResponse: StationPotentialRostersUsers = {
      users: [
        {
          rithmId: '12dasd1-asd12asdasd-asdas',
          firstName: 'Cesar',
          lastName: 'Quijada',
          email: 'strut@gmail.com',
          isOwner: true,
          isWorker: true,
        },
        {
          rithmId: '12dasd1-asd12asdasd-ffff1',
          firstName: 'Maria',
          lastName: 'Quintero',
          email: 'Maquin@gmail.com',
          isOwner: true,
          isWorker: true,
        },
        {
          rithmId: '12dasd1-asd12asdasd-a231',
          firstName: 'Pedro',
          lastName: 'Perez',
          email: 'pperez@gmail.com',
          isOwner: true,
          isWorker: true,
        },
      ],
      totalUsers: 3,
    };

    service
      .getPotentialStationGroupRosterMembers(stationId, pageNum)
      .subscribe((users) => {
        expect(users).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(
      // eslint-disable-next-line max-len
      `${environment.baseApiUrl}${MICROSERVICE_PATH_STATION_GROUP}/potential-roster-users?stationGroupRithmId=${stationId}&pageNum=${pageNum}&pageSize=${pageSize}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('stationGroupRithmId')).toBe(stationId);
    expect(req.request.params.get('pageNum')).toBe(pageNum.toString());
    expect(req.request.params.get('pageSize')).toBe(pageSize.toString());
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return the users roster to the station.', () => {
    const expectedResponse: StationRosterMember[] = [
      {
        rithmId: 'e769aee2-76a4-40fb-a2ee-52112c4a0422',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
      {
        rithmId: '755036EA-A624-495F-AE5E-3F3ADBF2BC56',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
    ];
    service.getStationAllRoster(stationId).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/all-roster?rithmId=${stationId}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('rithmId')).toBe(stationId);
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return a list optimized of all stations', () => {
    const expectedResponse: StationOptimized[] = [
      {
        rithmId: '247cf568-27a4-4968-9338-046ccfee24f3',
        name: 'Test Name',
        instructions: 'Instructions Test #1',
        dueDate: '1 day',
        createdByRithmId: 'B5702D6F-0C35-4EB2-9062-C895E22EAEEF',
        createdDateUTC: '2021-12-13T22:27:48.39',
        updatedByRithmId: 'B5702D6F-0C35-4EB2-9062-C895E22EAEEF',
        updatedDateUTC: '2022-05-09T16:13:28.3564695',
        organizationRithmId: '7D9854CF-1070-4F4C-81C1-7ACD433A2EE1',
        archived: false,
        priority: 0,
        locationX: -377,
        locationY: 33,
        documentGeneratorStatus: 1,
        workerCanRenameDocuments: true,
        notes: null,
        isChained: false,
        allowExternalWorkers: true,
        allowAllOrgWorkers: true,
        altStationButtons: false,
        allowPreviousButton: true,
        flowButton: 'Flow Test #1',
      },
    ];

    service.getAllStationsOptimized().subscribe((response) => {
      expect(response).toBeDefined();
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/stations`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });
});
