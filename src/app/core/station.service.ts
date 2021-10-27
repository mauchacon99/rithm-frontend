import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
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
  getStationDocumentGenerationStatus(stationId: string): Observable<DocumentGenerationStatus> {
    const params = new HttpParams()
      .set('rithmId', stationId);
    return this.http.get(`${environment.baseApiUrl}${MICROSERVICE_PATH}/generator-status`, { params, responseType: 'text' })
      .pipe(map((value) => value as DocumentGenerationStatus));
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
   * Adds users to the worker roster.
   *
   * @param stationId The Specific id of station.
   * @param userIds The users ids for assign in station.
   * @returns Rosters in the station.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addUsersToWorkerRoster(stationId: string, userIds: string[]): Observable<StationRosterMember[]> {
    const mockPrevAddRosterStation: StationRosterMember[] = [{
      rithmId: '',
      firstName: 'Marry',
      lastName: 'Poppins',
      email: 'marrypoppins@inpivota.com'
    }, {
      rithmId: '',
      firstName: 'Worker',
      lastName: 'User',
      email: 'workeruser@inpivota.com'
    }];
    return of(mockPrevAddRosterStation).pipe(delay(1000));
  }

  /**
   * Removes a user from the station's worker roster.
   *
   * @param stationId The Specific id of station.
   * @param usersIds The selected users id array to removed.
   * @returns New station Worker Roster.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeUsersFromWorkerRoster(stationId: string, usersIds: string[]): Observable<StationRosterMember[]> {
    const data: StationRosterMember[] = [{
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
    return of(data).pipe(delay(1000));
  }

  /**
   * Get organization users for a specific station.
   *
   * @param organizationId The id of the organization.
   * @param stationRithmId The Specific id of station.
   * @param pageNum The current page.
   * @returns Users for the organization bind to station.
   */
  getPotentialStationRosterMembers(organizationId: string, stationRithmId: string, pageNum: number): Observable<StationRosterMember[]> {
    if (!organizationId || !pageNum) {
      return throwError(new HttpErrorResponse({
        error: {
          error: 'Invalid organization ID or page number.'
        }
      })).pipe(delay(1000));
    } else {
      const orgUsers: StationRosterMember[] = [{
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
      return of(orgUsers).pipe(delay(1000));
    }
  }

  /**
   * Deletes a specified station.
   *
   * @param stationId The Specific id of station.
   * @returns Returns an empty observable.
   */
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   deleteStation(stationId: string): Observable<unknown> {
    return this.http.delete<void>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/${stationId}`);
  }

  /**
   * Get Workers Roster for a given Station.
   *
   * @param stationId The id of the given station.
   * @returns A rosterMember array.
   */
  getStationWorkerRoster(stationId: string): Observable<StationRosterMember[]> {
    if (!stationId) {
      return throwError(new HttpErrorResponse({
        error: {
          error: 'Cannot get worker roster without defining a station.'
        }
      })).pipe(delay(1000));
    } else {
      const mockRosterMember: StationRosterMember[] = [
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
      return of(mockRosterMember).pipe(delay(1000));
    }
  }
}
