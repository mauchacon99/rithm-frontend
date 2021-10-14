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
      stationRithmId: 'E204F369-386F-4E41',
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
        stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
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
   * Get all stations private items.
   *
   * @param stationId The Specific id of station.
   * @returns Station private items Array.
   */
  getStationPrivateItems(stationId: string): Observable<Question[]> {
    const mockPrivateItems: Question[] = [
      {
        prompt: 'Fake question 1',
        instructions: 'Fake question 1',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: {
          rithmId: '3j4k-3h2j-hj4j',
          typeString: QuestionFieldType.Number,
          validationExpression: '.+'
        },
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
      {
        prompt: 'Fake question 2',
        instructions: 'Fake question 2',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: {
          rithmId: '3j4k-3h2j-hj4j',
          typeString: QuestionFieldType.Number,
          validationExpression: '.+'
        },
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
    ];
    return of(mockPrivateItems).pipe(delay(1000));
  }

  /**
   * Get all stations all items.
   *
   * @param stationId The Specific id of station.
   * @returns Station all items Array.
   */
  getStationAllItems(stationId: string): Observable<Question[]> {
    const mockAllItems: Question[] = [
      {
        prompt: 'Fake question 1',
        instructions: 'Fake question 1',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: {
          rithmId: '3j4k-3h2j-hj4j',
          typeString: QuestionFieldType.Number,
          validationExpression: '.+'
        },
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
      {
        prompt: 'Fake question 2',
        instructions: 'Fake question 2',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: {
          rithmId: '3j4k-3h2j-hj4j',
          typeString: QuestionFieldType.Number,
          validationExpression: '.+'
        },
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
    ];
    return of(mockAllItems).pipe(delay(1000));
  }
}
