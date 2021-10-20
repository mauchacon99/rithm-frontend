import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Question, Station, StationInformation } from 'src/models';

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
  updateStation(station: StationInformation): Observable<StationInformation> {
    return this.http.put<StationInformation>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/${station.rithmId}`, station);
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
   * Get all station previous private/all questions.
   *
   * @param stationId The Specific id of station.
   * @param isPrivate True returns private questions - False returns all questions.
   * @returns Station private/all items Array.
   */
  getStationPreviousQuestions(stationId: string, isPrivate: boolean): Observable<Question[]> {
    const params = new HttpParams()
      .set('stationRithmId', stationId)
      .set('getPrivate', isPrivate);
    return this.http.get<Question[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/previous-questions`, { params });
  }

  /**
   * Get worker roster for the given station identified by rithmId.
   *
   * @param rithmId The Specific id of station.
   * @returns Rosters for the station.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
