import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DocumentGenerationStatus, Question, Station, StationInformation, StationRosterMember } from 'src/models';

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
   * Get station document generation status.
   *
   * @param stationId The id of the station return status document.
   * @returns Status the document.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getStationDocumentGenerationStatus(stationId: string): Observable<DocumentGenerationStatus> {
    const mockStatusDocument = DocumentGenerationStatus.None;
    return of(mockStatusDocument).pipe(delay(1000));
  }

  /**
   * Update station document generation status.
   *
   * @param stationId The id of the station return status document.
   * @param statusNew The new status set in station document.
   * @returns Status new the document.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateStationDocumentGenerationStatus(stationId: string, statusNew: DocumentGenerationStatus): Observable<DocumentGenerationStatus> {
    return of(statusNew).pipe(delay(1000));
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
   * Removes a user from the station's worker roster.
   *
   * @param stationId The Specific id of station.
   * @param usersIds The selected users id array to removed.
   * @returns New Station information with worker roster.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
   removeUserFromWorkerRoster(stationId: string, usersIds: StationRosterMember[]): Observable<StationInformation>{
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
