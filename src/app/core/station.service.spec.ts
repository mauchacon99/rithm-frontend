import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { DocumentGenerationStatus, Question, QuestionFieldType, Station, StationInformation, StationRosterMember } from 'src/models';

import { StationService } from './station.service';

const MICROSERVICE_PATH = '/stationservice/api/station';

describe('StationService', () => {
  let service: StationService;
  let httpTestingController: HttpTestingController;

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
    const stationId = 'E204F369-386F-4E41';
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
      supervisors: [{
        userRithmId: '',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com'
      }],
      workers: [{
        userRithmId: '',
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@inpivota.com'
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
        stationName: 'Development',
        totalDocuments: 5,
        isGenerator: true
      }],
      previousStations: [{
        stationName: 'Station-1',
        totalDocuments: 2,
        isGenerator: true
      }],
      supervisors: [{
        userRithmId: '',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com'
      }],
      workers: [{
        userRithmId: '',
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@inpivota.com'
      }],
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: [],
      priority: 1,
    };

    const expectedResponse = {
      rithmId: station.rithmId,
      name: station.name,
      instructions: 'General instructions',
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
      supervisors: [{
        userRithmId: '',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com'
      }],
      workers: [{
        userRithmId: '',
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@inpivota.com'
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
    const stationId = 'E204F369-386F-4E41';
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
    const stationId = '3a97bead-e698-45ea-a1d9-51f4513a909a';
    const expectedResponse = DocumentGenerationStatus.None;

    service.getStationDocumentGenerationStatus(stationId)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/generator-status?rithmId=${stationId}`);
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return the status of the specific document once the status is updated', () => {
    const stationId = '3a97bead-e698-45ea-a1d9-51f4513a909a';
    const statusNew = DocumentGenerationStatus.Manual;
    service.updateStationDocumentGenerationStatus(stationId, statusNew)
      .subscribe((response) => {
        expect(response).toEqual(statusNew);
      });
  });

  it('should return a list of stations private/all questions', () => {
    const stationId = 'E204F369-386F-4E41';
    const isPrivate = true;
    const expectedResponse: Question[] = [
      {
        prompt: 'Fake question 1',
        instructions: 'Fake question 1',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
      {
        prompt: 'Fake question 2',
        instructions: 'Fake question 2',
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

  it('should add a new member to the worker roster', () => {
    const stationId = '3a97bead-e698-45ea-a1d9-51f4513a909a';
    const usersIds: string[] = [
      '495FC055-4472-45FE-A68E-B7A0D060E1C8',
      '49B1A2B4-7B2A-466E-93F9-78F14A672052'
    ];
    const expectedResponse: StationRosterMember[] = [{
      userRithmId: '',
      firstName: 'Marry',
      lastName: 'Poppins',
      email: 'marrypoppins@inpivota.com'
    }, {
      userRithmId: '',
      firstName: 'Worker',
      lastName: 'User',
      email: 'workeruser@inpivota.com'
    }];

    service.addUsersToWorkerRoster(stationId, usersIds)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });
  });

  it('should delete a station', () => {
    const stationId = 'E204F369-386F-4E41';

    service.deleteStation(stationId)
      .subscribe((response) => {
        expect(response).toBeFalsy();
      });
  });
});
