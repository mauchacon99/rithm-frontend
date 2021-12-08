import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
// eslint-disable-next-line max-len
import { DocumentGenerationStatus, StationRosterMember, Question, QuestionFieldType, Station, StationInformation, StationPotentialRostersUsers, ForwardPreviousStationsDocument, StandardStringJSON, DocumentNameField } from 'src/models';
import { StationService } from './station.service';

const MICROSERVICE_PATH = '/stationservice/api/station';

describe('StationService', () => {
  let service: StationService;
  let httpTestingController: HttpTestingController;
  const stationId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
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
      nextStations: [{
        stationName: 'Development',
        totalDocuments: 5,
        isGenerator: true
      }],
      previousStations: [{
        stationName: 'Station-1',
        totalDocuments: 2,
        isGenerator: true
      }],
      stationOwners: [{
        rithmId: '',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isOwner: false,
        isWorker: true
      }],
      workers: [{
        rithmId: '',
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@inpivota.com',
        isOwner: false,
        isWorker: true
      }],
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: []
    };

    service.getStationInfo(stationId)
      .subscribe((response) => {
        expect(response).toBeDefined();
      });

    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/station-info?stationRithmId=${stationId}`);
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return a list of all stations', () => {
    const expectedResponse: Station = {
      name: 'Example Station',
      rithmId: '3j4k-3h2j-hj4j',
      instructions: 'Do as I instruct'
    };

    service.getAllStations()
      .subscribe((response) => {
        expect(response).toBeDefined();
      });

    // outgoing request
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}`);
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return station information with updated data', () => {
    const station: StationInformation = {
      rithmId: 'E204F369-386F-4E41',
      name: 'Station Name',
      instructions: 'General instructions',
      nextStations: [{
        name: 'Development',
        rithmId: '123-321-654'
      }],
      previousStations: [{
        name: 'Station-1',
        rithmId: '159-357-761'
      }],
      stationOwners: [{
        rithmId: '',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isWorker: true,
        isOwner: false
      }],
      workers: [{
        rithmId: '',
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@inpivota.com',
        isWorker: true,
        isOwner: false
      }],
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: [],
      priority: 1,
    };

    const expectedResponse: StationInformation = {
      rithmId: station.rithmId,
      name: station.name,
      instructions: 'General instructions',
      nextStations: [{
        name: 'Development',
        rithmId: '123-869-742'
      }],
      previousStations: [{
        name: 'Station-1',
        rithmId: '258-635-412'
      }],
      stationOwners: [{
        rithmId: '',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isWorker: true,
        isOwner: false
      }],
      workers: [{
        rithmId: '',
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@inpivota.com',
        isWorker: true,
        isOwner: false
      }],
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: [],
      priority: 1
    };

    service.updateStation(station)
      .subscribe((response) => {
        expect(response).toBe(expectedResponse);
      });

    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/${station.rithmId}`);
    expect(req.request.method).toEqual('PUT');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return updated date from a specific station', () => {
    const expectedResponse = '2021-07-18T17:26:47.3506612Z';

    service.getLastUpdated(stationId)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/last-updated?rithmId=${stationId}`);
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return the status of the specific document', () => {
    const expectedResponse = DocumentGenerationStatus.None;

    service.getStationDocumentGenerationStatus(stationId)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/generator-status?rithmId=${stationId}`);
    expect(req.request.method).toEqual('GET');

    req.flush({ data: expectedResponse });
    httpTestingController.verify();
  });

  it('should return the status of the specific document once the status is updated', () => {
    const status = DocumentGenerationStatus.Manual;
    service.updateStationDocumentGenerationStatus(stationId, status)
      .subscribe((response) => {
        expect(response).toEqual(status);
      });
    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/generator-status?stationRithmId=${stationId}`);
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

    service.getStationPreviousQuestions(stationId, isPrivate)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/previous-questions?stationRithmId=${stationId}&getPrivate=${isPrivate}`);
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
    service.updateStationQuestions(stationId, expectedResponse)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/questions?stationRithmId=${stationId}`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(expectedResponse);
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should add a new member to the worker roster', () => {
    const usersIds: string[] = [
      '495FC055-4472-45FE-A68E-B7A0D060E1C8',
      '49B1A2B4-7B2A-466E-93F9-78F14A672052'
    ];
    const expectedResponse: StationRosterMember[] = [{
      rithmId: '',
      firstName: 'Marry',
      lastName: 'Poppins',
      email: 'marrypoppins@inpivota.com',
      isOwner: false,
      isWorker: true
    }, {
      rithmId: '',
      firstName: 'Worker',
      lastName: 'User',
      email: 'workeruser@inpivota.com',
      isOwner: false,
      isWorker: true
    }];

    service.addUsersToWorkerRoster(stationId, usersIds)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-roster-user?stationRithmId=${stationId}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(usersIds);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return the potential roster members of the station', () => {
    const pageNum = 1;
    const pageSize = 20;
    const expectedResponse: StationPotentialRostersUsers = {
      users: [{
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
      }],
      totalUsers: 3
    };

    service.getPotentialStationRosterMembers(stationId, pageNum)
      .subscribe((users) => {
        expect(users).toEqual(expectedResponse);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/potential-roster-users?stationRithmId=${stationId}&pageNum=${pageNum}&pageSize=${pageSize}`);
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should delete a station', () => {
    service.deleteStation(stationId)
      .subscribe((response) => {
        expect(response).toBeFalsy();
      });
  });

  it('should remove a member from worker roster', () => {
    const userIdList: Array<string> = [
      '495FC055-4472-45FE-A68E-B7A0D060E1C8',
    ];
    const expectedResponse: StationRosterMember[] = [{
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
    }];

    service.removeUsersFromWorkerRoster(stationId, userIdList)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-roster-user?stationRithmId=${stationId}`);
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

    service.getStationWorkerRoster(stationId)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });
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

    service.getStationOwnerRoster(stationId)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });
  });

  it('should add a new member to the owner roster', () => {
    const userIdList: Array<string> = [
      '495FC055-4472-45FE-A68E-B7A0D060E1C8',
    ];
    const expectedResponse: StationRosterMember[] = [{
      rithmId: 'C5C1480C-461E-4267-BBB1-BB79E489F991',
      firstName: 'Marry',
      lastName: 'Poppins',
      email: 'marrypoppins@inpivota.com',
      isOwner: true,
      isWorker: false
    }, {
      rithmId: 'C5C1480C-461E-4267-BBB1-BB79E489F992',
      firstName: 'Worker',
      lastName: 'User',
      email: 'workeruser@inpivota.com',
      isOwner: true,
      isWorker: false
    }];

    service.addUsersToOwnersRoster(stationId, userIdList)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/owner-user?stationRithmId=${stationId}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(userIdList);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should remove a member the owner from the roster', () => {
    const usersIds: Array<string> = ['495FC055-4472-45FE-A68E-B7A0D060E1C8'];
    const expectedResponse: StationRosterMember[] = [{
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
    }];

    service.removeUsersFromOwnerRoster(stationId, usersIds)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/owner-user?stationRithmId=${stationId}`);
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.body).toEqual(usersIds);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should update the editable status of the document in the station', () => {
    const stationRithmId = '247cf568-27a4-4968-9338-046ccfee24f3';
    const newStatus = true;
    service.updateStatusDocumentEditable(stationRithmId, newStatus)
      .subscribe((response) => {
        expect(response).toEqual(newStatus);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-rename-document?stationRithmId=${stationRithmId}&canRename=${newStatus}`);
    expect(req.request.method).toEqual('PUT');

    req.flush(newStatus);
    httpTestingController.verify();
  });

  it('should get the current editable status of the document', () => {
    const stationRithmId = '247cf568-27a4-4968-9338-046ccfee24f3';
    const expectedResponse = true;

    service.getStatusDocumentEditable(stationRithmId)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-rename-document?stationRithmId=${stationRithmId}`);
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
        isOwner: true
      }
    ];
    service.getStationOwnerRoster(stationId)
      .subscribe((orgInfo) => {
        expect(orgInfo).toEqual(expectedResponse);
      });
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/owner-users?stationRithmId=${stationId}`);
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
          totalDocuments: 5
        },
        {
          rithmId: '789-654-753',
          name: 'Previous station 2',
          totalDocuments: 2
        }
      ],
      nextStations: [
        {
          rithmId: '852-963-741',
          name: 'Follow station 1',
          totalDocuments: 2
        },
        {
          rithmId: '852-963-418',
          name: 'Follow station 2',
          totalDocuments: 1
        }
      ]
    };
    service.getPreviousAndNextStations(stationRithmId)
      .subscribe((prevAndNextStations) => {
        expect(prevAndNextStations).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/prev-next-stations?stationRithmId=${stationRithmId}`);
    expect(req.request.params.get('stationRithmId')).toBe('4eca65f1-89ef-4970-8aa5-8a26a5e45628');
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
      nextStations: [{
        rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1X',
        name: 'Development',
        totalDocuments: 5,
        isGenerator: true
      }],
      previousStations: [{
        rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1Y',
        name: 'Station-1',
        totalDocuments: 2,
        isGenerator: true
      }, {
        rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1Z',
        name: 'Station-2',
        totalDocuments: 0,
        isGenerator: false
      }],
      stationOwners: [{
        rithmId: '',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isWorker: false,
        isOwner: true
      }, {
        rithmId: '',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isWorker: false,
        isOwner: true
      }],
      workers: [{
        rithmId: '',
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@inpivota.com',
        isWorker: false,
        isOwner: false
      }, {
        rithmId: '',
        firstName: 'Supervisor',
        lastName: 'User',
        email: 'supervisoruser@inpivota.com',
        isWorker: true,
        isOwner: false
      }],
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: [],
      priority: 2
    };

    service.updateStationName(newName, station.rithmId);
    const stationRithmId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
    service.updateStationName(newName, stationRithmId)
      .subscribe((response) => {
        expect(response).toBe(newName);
      });
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/name?rithmId=${stationRithmId}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual({ data: newName });
    req.flush({ data: newName });
    httpTestingController.verify();
  });

  it('should test connection to get the station Document name template', () => {
    const expectData: DocumentNameField[] = [
      {
        prompt: 'Address',
        rithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a'
      },
      {
        prompt: '/',
        rithmId: ''
      },
      {
        prompt: 'Which is best?',
        rithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a'
      },
    ];

    service.getDocumentNameTemplate(stationId)
      .subscribe((response) => {
        expect(response).toEqual(expectData);
      });
    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/document-naming-template?stationRithmId=${stationId}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toEqual(null);

    req.flush(expectData);
    httpTestingController.verify();

  });

  it('should test connection to service to update station document name template', () => {
    const appendedFields: DocumentNameField[] = [
      {
        prompt: 'Address',
        rithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a'
      },
      {
        prompt: '/',
        rithmId: ''
      },
      {
        prompt: 'Which is best?',
        rithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a'
      },
    ];

    service.updateDocumentNameTemplate(stationId, appendedFields)
      .subscribe((response) => {
        expect(response).toEqual(appendedFields);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/document-naming-template?stationRithmId=${stationId}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(appendedFields);
    req.flush(appendedFields);
    httpTestingController.verify();
  });



  it('should return the station with updated general instructions', () => {
    const instructions = 'New Instructions for current Station';
    const expectedResponse: StandardStringJSON = {
      data: 'New Instructions for current Station'
    };
    service.updateStationGeneralInstructions(stationId, instructions)
      .subscribe((stationInfo) => {
        expect(stationInfo).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/instructions?rithmId=${stationId}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual({ data: instructions });
    req.flush({ data: instructions });
    httpTestingController.verify();
  });

});


