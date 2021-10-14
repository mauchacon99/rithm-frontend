import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Question, QuestionFieldType, Station, StationInformation } from 'src/models';

const MICROSERVICE_PATH = '/stationservice/api/station';

/**
 * Service for all station behavior and business logic.
 */
@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Gets station information.
   *
   * @param stationId The Specific id of station.
   * @returns Information related to station.
   */
  getStationInfo(stationId: string): Observable<StationInformation> {
    const params = new HttpParams()
      .set('stationRithmId', stationId);
    return this.http.get<StationInformation>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/station-info`, { params });
  }

  /**
   * Gets all the stations from the API.
   *
   * @returns The list of all stations.
   */
  getAllStations(): Observable<Station[]> {
    return this.http.get<Station[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}`);
  }

  /**
   * Update station name.
   *
   * @returns The list of all stations.
   * @param station The station information that will be update.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateStation(station: StationInformation): Observable<StationInformation> {
    const data: StationInformation = {
      stationRithmId: 'E204F369-386F-4E41',
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

  /**
   * Get the las updated for a specific station.
   *
   * @param stationId The id for the specific station for which to get the latest updated date.
   * @returns The last updated date for this station.
   */
   getLastUpdated(stationId: string): Observable<string> {
    const params = new HttpParams()
    .set('rithmId', stationId);
    return this.http.get<string>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/last-updated`, { params });
  }

  /**
   * Get all stations private items.
   *
   * @param stationId The Specific id of station.
   * @returns Station private items Array.
   */
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   getStationPrivateItems(stationId: string): Observable<Question[]>{
    const mockPrivateItems: Question[]= [
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
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   getStationAllItems(stationId: string): Observable<Question[]>{
    const mockAllItems: Question[]= [
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
