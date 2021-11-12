import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  DocumentGenerationStatus, Question, Station, StationInformation, StationPotentialRostersUsers, StationRosterMember
} from 'src/models';

const MICROSERVICE_PATH = '/stationservice/api/station';

/**
 * Service for all station behavior and business logic.
 */
@Injectable({
  providedIn: 'root'
})
export class StationService {


  /** The Name of the Station as BehaviorSubject. */
  stationName$ = new BehaviorSubject<string>('');

  /** Refresh the info drawer as BehaviorSubject. */
  refreshDrawer$ = new BehaviorSubject<boolean>(false);

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
  // eslint-disable-next-line max-len
  updateStationDocumentGenerationStatus(stationId: string, statusNew: DocumentGenerationStatus): Observable<DocumentGenerationStatus> {
    return this.http.put(`${environment.baseApiUrl}${MICROSERVICE_PATH}/generator-status?stationRithmId=${stationId}`,
      {
        generatorStatus: statusNew
      },
      { responseType: 'text' }
    ).pipe(map(value => value as DocumentGenerationStatus));
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
  addUsersToWorkerRoster(stationId: string, userIds: string[]): Observable<StationRosterMember[]> {
    // eslint-disable-next-line max-len
    return this.http.put<StationRosterMember[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-roster-user?stationRithmId=${stationId}`, userIds);
  }

  /**
   * Removes users from the station's roster.
   *
   * @param stationId The Specific id of station.
   * @param usersIds The selected users id array to removed.
   * @returns New station Worker Roster.
   */
  removeUsersFromWorkerRoster(stationId: string, usersIds: string[]): Observable<StationRosterMember[]> {
    // eslint-disable-next-line max-len
    return this.http.delete<StationRosterMember[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-roster-user?stationRithmId=${stationId}`,
      {
        body: usersIds
      });
  }

  /**
   * Get organization users for a specific station.
   *
   * @param stationRithmId The Specific id of station.
   * @param pageNum The current page.
   * @returns Users for the organization bind to station.
   */
  // eslint-disable-next-line max-len
  getPotentialStationRosterMembers(stationRithmId: string, pageNum: number): Observable<StationPotentialRostersUsers> {
    if (!pageNum) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Invalid page number.'
        }
      })).pipe(delay(1000));
    } else {
      const params = new HttpParams()
        .set('stationRithmId', stationRithmId)
        .set('pageNum', pageNum)
        .set('pageSize', 20);
      // eslint-disable-next-line max-len
      return this.http.get<StationPotentialRostersUsers>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/potential-roster-users`, { params });
    }
  }

  /**
   * Deletes a specified station.
   *
   * @param stationId The Specific id of station.
   * @returns Returns an empty observable.
   */
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
    const params = new HttpParams()
      .set('rithmId', stationId);
    return this.http.get<StationRosterMember[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-roster`, { params });
  }

  /**
   * Get Owner Roster for a given Station.
   *
   * @param stationId The id of the given station.
   * @returns A rosterMember array.
   */
  getStationOwnerRoster(stationId: string): Observable<StationRosterMember[]> {
    if (!stationId) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Invalid station ID.'
        }
      })).pipe(delay(1000));
    } else {
      const params = new HttpParams()
        .set('stationRithmId', stationId);
      return this.http.get<StationRosterMember[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/owner-users`, { params });
    }
  }

  /**
   * Returns the station name.
   *
   * @param stationName The name of the station.
   */
  updatedStationNameText(stationName: string): void {
    this.stationName$.next(stationName);
  }

  /**
   * Adds users to the owners roster.
   *
   * @param stationId The Specific id of station.
   * @param userIds The users ids for assign in station.
   * @returns OwnerRoster in the station.
   */
  addUsersToOwnersRoster(stationId: string, userIds: string[]): Observable<StationRosterMember[]> {
    // eslint-disable-next-line max-len
    return this.http.put<StationRosterMember[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/owner-user?stationRithmId=${stationId}`, userIds);
  }

  /**
   * Remove owner from the station's roster.
   *
   * @param stationId The Specific id of station.
   * @param usersIds The selected owners id array to removed.
   * @returns New Station information with owners roster.
   */
  removeUsersFromOwnerRoster(stationId: string, usersIds: string[]): Observable<StationRosterMember[]> {
    // eslint-disable-next-line max-len
    return this.http.delete<StationRosterMember[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/owner-user?stationRithmId=${stationId}`,
      {
        body: usersIds
      });
  }

  /**
   * Update status document is editable or not.
   *
   * @param stationRithmId The Specific id of station.
   * @param newStatus The new status is editable in the change for document.
   * @returns New status for document editable.
   */
  updateStatusDocumentEditable(stationRithmId: string, newStatus: boolean): Observable<boolean> {
    // eslint-disable-next-line max-len
    return this.http.put<boolean>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-rename-document?stationRithmId=${stationRithmId}&canRename=${newStatus}`, stationRithmId);
  }

  /**
   * Get status document is editable or not.
   *
   * @param stationRithmId The Specific id of station.
   * @returns Status for document editable.
   */
  getStatusDocumentEditable(stationRithmId: string): Observable<boolean> {
    const params = new HttpParams()
      .set('stationRithmId', stationRithmId);
    return this.http.get<boolean>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-rename-document`, { params });
  }

  /**
   * Refresh info drawer component.
   *
   * @param refresh Refresh param boolean.
   */
  refreshInfoDrawer(refresh: boolean): void {
    this.refreshDrawer$.next(refresh);
  }
}
