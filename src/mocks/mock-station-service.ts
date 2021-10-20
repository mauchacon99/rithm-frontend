/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Question, QuestionFieldType, Station, StationInformation } from 'src/models';

/**
 * Mocks methods of the `StationService`.
 */
export class MockStationService {

  /**
   * Gets a station information.
   *
   * @param stationId The Specific id of station.
   * @returns Information related to station.
   */
  getStationInfo(stationId: string): Observable<StationInformation> {
    const data: StationInformation = {
      rithmId: 'E204F369-386F-4E41',
      name: 'Dry Goods & Liquids',
      instructions: '',
      nextStations: [{
        stationName: 'Development',
        totalDocuments: 5,
        isGenerator: true
      }],
      previousStations: [{
        stationName: 'Station-1',
        totalDocuments: 2,
        isGenerator: true
      }, {
        stationName: 'Station-2',
        totalDocuments: 0,
        isGenerator: false
      }],
      supervisors: [{
        userRithmId: '',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com'
      }, {
        userRithmId: '',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com'
      }],
      workers: [{
        userRithmId: '',
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@inpivota.com'
      }, {
        userRithmId: '',
        firstName: 'Supervisor',
        lastName: 'User',
        email: 'supervisoruser@inpivota.com'
      }],
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: [],
      priority: 2
    };
    return of(data).pipe(delay(1000));
  }

  /**
   * Gets all the stations from the API.
   *
   * @returns The list of all stations.
   */
  getAllStations(): Observable<Station[]> {
    const mockStationData: Station[] = [
      {
        name: 'Example Station',
        rithmId: '3j4k-3h2j-hj4j',
        instructions: 'Do as I instruct'
      }
    ];
    return of(mockStationData).pipe(delay(1000));
  }

  /**
   * Update station information.
   *
   * @returns The station information updated.
   * @param station The station information that will be update.
   */
  updateStation(station: StationInformation): Observable<StationInformation> {
    if (!station) {
      return throwError(new HttpErrorResponse({
        error: {
          error: 'Some error message'
        }
      })).pipe(delay(1000));
    } else {
      const data: StationInformation = {
        rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        name: 'New Station Name',
        instructions: '',
        nextStations: [{
          stationName: 'Development',
          totalDocuments: 5,
          isGenerator: true
        }],
        previousStations: [{
          stationName: 'Station-1',
          totalDocuments: 2,
          isGenerator: true
        }, {
          stationName: 'Station-2',
          totalDocuments: 0,
          isGenerator: false
        }],
        supervisors: [{
          userRithmId: '',
          firstName: 'Marry',
          lastName: 'Poppins',
          email: 'marrypoppins@inpivota.com'
        }, {
          userRithmId: '',
          firstName: 'Worker',
          lastName: 'User',
          email: 'workeruser@inpivota.com'
        }],
        workers: [{
          userRithmId: '',
          firstName: 'Harry',
          lastName: 'Potter',
          email: 'harrypotter@inpivota.com'
        }, {
          userRithmId: '',
          firstName: 'Supervisor',
          lastName: 'User',
          email: 'supervisoruser@inpivota.com'
        }],
        createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
        createdDate: '2021-07-16T17:26:47.3506612Z',
        updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
        updatedDate: '2021-07-18T17:26:47.3506612Z',
        questions: [],
        priority: 2
      };
      return of(data).pipe(delay(1000));
    }
  }

  /**
   * Get station information updated date.
   *
   * @param stationId The id of the station for witch to get the last updated date.
   * @returns Formatted Updated Date.
   */
  getLastUpdated(stationId: string): Observable<string> {
    const mockDate = '2021-07-18T17:26:47.3506612Z';
    return of(mockDate).pipe(delay(1000));
  }

  /**
   * Get all station previous private/all questions.
   *
   * @param stationId The Specific id of station.
   * @param isPrivate True returns private questions - False returns all questions.
   * @returns Station private/all items Array.
   */
  getStationPreviousQuestions(stationId: string, isPrivate: boolean): Observable<Question[]> {
    const mockPrevQuestions: Question[] = [
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
    return of(mockPrevQuestions).pipe(delay(1000));
  }

/**
 * Get worker roster for the given station identified by rithmId.
 *
 * @param rithmId The Specific id of station.
 * @returns Rosters for the station.
 */
  getWorkerRosterStation(rithmId: string): Observable<unknown> {
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
    return of(workerRosterStation).pipe(delay(1000));
  }
}
