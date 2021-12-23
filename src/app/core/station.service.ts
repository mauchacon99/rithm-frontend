import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
// eslint-disable-next-line max-len
import { DocumentGenerationStatus, Question, Station, StationInformation, StationPotentialRostersUsers, StationRosterMember, DocumentNameField, StandardStringJSON, ForwardPreviousStationsDocument } from 'src/models';

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

  /** Set the Question of the station-template which will be moved to previous fields expansion panel. */
  questionToMove$ = new Subject<Question>();

  /** The Name of the Station Document as BehaviorSubject. */
  documentStationNameFields$ = new BehaviorSubject<DocumentNameField[]>([]);

  /** Set touch to station template form. */
  stationFormTouched$ = new Subject<void>();

  /** The question to be updated when it changes in station page. */
  stationQuestion$ = new Subject<Question>();

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
    const params = new HttpParams().set('rithmId', stationId);
    return this.http.get<StandardStringJSON>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/generator-status`, { params })
      .pipe(map((response) => response.data as DocumentGenerationStatus));
  }

  /**
   * Update station document generation status.
   *
   * @param stationId The id of the station return status document.
   * @param status The new status set in station document.
   * @returns Status new the document.
   */
  updateStationDocumentGenerationStatus(stationId: string, status: DocumentGenerationStatus): Observable<DocumentGenerationStatus> {
    const standardBody = { data: status };
    return this.http.put<StandardStringJSON>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/generator-status?stationRithmId=${stationId}`,
      standardBody).pipe(map(response => response.data as DocumentGenerationStatus));
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
   * Update the station questions.
   *
   * @param stationId The Specific id of station.
   * @param questions The question to be updated.
   * @returns Station updated questions array.
   */
  updateStationQuestions(stationId: string, questions: Question[]): Observable<Question[]> {
    return this.http.post<Question[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/questions?stationRithmId=${stationId}`, questions);
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
   * Update the station document name template.
   *
   * @param documentName The name of the document in the station.
   */
  updateDocumentStationNameFields(documentName: DocumentNameField[]): void {
    this.documentStationNameFields$.next(documentName);
  }

  /**
   * Update the station question values in the template area.
   *
   * @param question The question to be updated.
   */
  updateStationQuestionInTemplate(question: Question): void {
    this.stationQuestion$.next(question);
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
   * Reports a new question to be moved.
   *
   * @param question The question of the station-template to be moved.
   */
  moveQuestion(question: Question): void {
    this.questionToMove$.next(question);
  }

  /**
   * Update the Station General Instruction.
   *
   * @param rithmId The Specific id of station.
   * @param instructions The general instructions to be updated.
   * @returns The updated stationInformation.
   */
  updateStationGeneralInstructions(rithmId: string, instructions: string): Observable<StandardStringJSON> {
    const generalInstructions: StandardStringJSON = {
      data: instructions
    };
    // eslint-disable-next-line max-len
    return this.http.put<StandardStringJSON>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/instructions?rithmId=${rithmId}`, generalInstructions);
  }

  /**
   * Update station name.
   * Get previous and next stations.
   *
   * @param stationRithmId The rithm id actually station.
   * @returns Previous and next stations.
   */
  getPreviousAndNextStations(stationRithmId: string): Observable<ForwardPreviousStationsDocument> {
    const params = new HttpParams()
      .set('stationRithmId', stationRithmId);
    return this.http.get<ForwardPreviousStationsDocument>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/prev-next-stations`, { params });
  }

  /**
   * Updates a station name.
   *
   * @param name The new name for the station.
   * @param stationRithmId The id of the station to rename.
   * @returns The updated station name.
   */
  updateStationName(name: string, stationRithmId: string): Observable<string> {
    const standardBody: StandardStringJSON = { data: name };
    return this.http.put<StandardStringJSON>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/name?rithmId=${stationRithmId}`, standardBody)
      .pipe(map((response) => response.data));
  }

  /**
   * Get appended fields to document name template.
   *
   * @param stationId  The id of station.
   * @returns Array the appended fields in document name.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDocumentNameTemplate(stationId: string): Observable<DocumentNameField[]> {
    const params = new HttpParams()
      .set('stationRithmId', stationId);
    return this.http.get<DocumentNameField[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/document-naming-template`, {
      params
    });
  }

  /**
   * Update the document naming template.
   *
   * @param stationId  The id of station.
   * @param appendedFields  The appended fields.
   * @returns The updated document name template in the station.
   */
  updateDocumentNameTemplate(stationId: string, appendedFields: DocumentNameField[]): Observable<DocumentNameField[]> {
    // eslint-disable-next-line max-len
    return this.http.put<DocumentNameField[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/document-naming-template?stationRithmId=${stationId}`, appendedFields);
  }

  /** Set touch to station template form. */
  touchStationForm(): void {
    this.stationFormTouched$.next();
  }
}
