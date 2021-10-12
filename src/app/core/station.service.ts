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
        rithmId: '',
        questionType: {
          rithmId: '',
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
        rithmId: '',
        questionType: {
          rithmId: '',
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

}
