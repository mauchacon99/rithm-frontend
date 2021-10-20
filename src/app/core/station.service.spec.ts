import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { Question, QuestionFieldType, Station, StationInformation } from 'src/models';

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

  it('Return the rosters of the paged station', () => {
    const stationId = '4eca65f1-89ef-4970-8aa5-8a26a5e45628';
    const workerRosterStation: unknown = [
      {
        firstName: 'Worker T',
        lastName: 'User',
        rithmId: 'D4162FAB-E521-492F-9895-C98D4026A126',
        email: 'workeruser@inpivota.com',
        assignedStations: [
          {
            rithmId: '4eca65f1-89ef-4970-8aa5-8a26a5e45628'
          },
          {
            rithmId: '73d47261-1932-4fcf-82bd-159eb1a7243f'
          },
          {
            rithmId: '3813442c-82c6-4035-893a-86fa9deca7c4'
          },
          {
            rithmId: '247cf568-27a4-4968-9338-046ccfee24f3'
          }
        ],
        supervisedStations: []
      }
    ];

    service.getWorkerRosterStation(stationId)
      .subscribe((response) => {
        expect(response).toEqual(workerRosterStation);
      });
  });

});
