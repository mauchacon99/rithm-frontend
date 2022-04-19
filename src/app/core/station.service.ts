import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  DocumentGenerationStatus,
  Question,
  Station,
  StationInformation,
  StationPotentialRostersUsers,
  StationRosterMember,
  DocumentNameField,
  StandardStringJSON,
  ForwardPreviousStationsDocument,
  StandardBooleanJSON,
  StationFrameWidget,
  DocumentEvent,
  DataLinkObject,
  GroupTrafficData,
  FrameType,
  StandardNumberJSON,
  StationWidgetPreBuilt,
} from 'src/models';
import { StationGroupData } from 'src/models/station-group-data';

const MICROSERVICE_PATH = '/stationservice/api/station';
const MICROSERVICE_PATH_STATION_GROUP = '/stationservice/api/stationGroup';

/**
 * Service for all station behavior and business logic.
 */
@Injectable({
  providedIn: 'root',
})
export class StationService {
  /** The Name of the Station as BehaviorSubject. */
  stationName$ = new BehaviorSubject<string>('');

  /** The Name of the Station Document as BehaviorSubject. */
  documentStationNameFields$ = new BehaviorSubject<DocumentNameField[]>([]);

  /** Contains the name of the Flow Button as BehaviorSubject. */
  flowButtonText$ = new BehaviorSubject<string>('Flow');

  /** The questions to be updated when it changes in station page. */
  currentStationQuestions$ = new BehaviorSubject<Question[]>([]);

  /** Set the Question of the station-template which will be moved to previous fields expansion panel. */
  questionToMove$ = new Subject<Question>();

  /** Set touch to station template form. */
  stationFormTouched$ = new Subject<void>();

  /** The question to be updated when it changes in station page. */
  stationQuestion$ = new Subject<Question>();

  /** The datalink widget to be saved. */
  dataLinkObject$ = new Subject<DataLinkObject>();

  /** The question to be deleted when it delete in station field settings. */
  deleteStationQuestion$ = new Subject<Question>();

  /** The question title to be updated when it's updated in setting drawer. */
  stationQuestionTitle$ = new Subject<Question>();

  constructor(private http: HttpClient) {}

  /**
   * Gets station information.
   *
   * @param stationId The Specific id of station.
   * @returns Information related to station.
   */
  getStationInfo(stationId: string): Observable<StationInformation> {
    const params = new HttpParams().set('stationRithmId', stationId);
    return this.http.get<StationInformation>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/station-info`,
      { params }
    );
  }

  /**
   * Gets all the stations from the API.
   *
   * @returns The list of all stations.
   */
  getAllStations(): Observable<Station[]> {
    return this.http.get<Station[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}`
    );
  }

  /**
   * Update station name.
   *
   * @returns The list of all stations.
   * @param station The station information that will be update.
   */
  updateStation(station: StationInformation): Observable<StationInformation> {
    return this.http.put<StationInformation>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/${station.rithmId}`,
      station
    );
  }

  /**
   * Get the las updated for a specific station.
   *
   * @param stationId The id for the specific station for which to get the latest updated date.
   * @returns The last updated date for this station.
   */
  getLastUpdated(stationId: string): Observable<string> {
    const params = new HttpParams().set('rithmId', stationId);
    return this.http.get<string>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/last-updated`,
      { params }
    );
  }

  /**
   * Get station document generation status.
   *
   * @param stationId The id of the station return status document.
   * @returns Status the document.
   */
  getStationDocumentGenerationStatus(
    stationId: string
  ): Observable<DocumentGenerationStatus> {
    const params = new HttpParams().set('rithmId', stationId);
    return this.http
      .get<StandardStringJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/generator-status`,
        { params }
      )
      .pipe(map((response) => response.data as DocumentGenerationStatus));
  }

  /**
   * Update station document generation status.
   *
   * @param stationId The id of the station return status document.
   * @param status The new status set in station document.
   * @returns Status new the document.
   */
  updateStationDocumentGenerationStatus(
    stationId: string,
    status: DocumentGenerationStatus
  ): Observable<DocumentGenerationStatus> {
    const standardBody = { data: status };
    return this.http
      .put<StandardStringJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/generator-status?stationRithmId=${stationId}`,
        standardBody
      )
      .pipe(map((response) => response.data as DocumentGenerationStatus));
  }

  /**
   * Get all station previous private/all questions.
   *
   * @param stationId The Specific id of station.
   * @param isPrivate True returns private questions - False returns all questions.
   * @returns Station private/all items Array.
   */
  getStationPreviousQuestions(
    stationId: string,
    isPrivate: boolean
  ): Observable<Question[]> {
    const params = new HttpParams()
      .set('stationRithmId', stationId)
      .set('getPrivate', isPrivate);
    return this.http.get<Question[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/previous-questions`,
      { params }
    );
  }

  /**
   * Update the station questions.
   *
   * @param stationId The Specific id of station.
   * @param questions The question to be updated.
   * @returns Station updated questions array.
   */
  updateStationQuestions(
    stationId: string,
    questions: Question[]
  ): Observable<Question[]> {
    return this.http.post<Question[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/questions?stationRithmId=${stationId}`,
      questions
    );
  }

  /**
   * Adds users to the worker roster.
   *
   * @param stationId The Specific id of station.
   * @param userIds The users ids for assign in station.
   * @returns Rosters in the station.
   */
  addUsersToWorkerRoster(
    stationId: string,
    userIds: string[]
  ): Observable<StationRosterMember[]> {
    // eslint-disable-next-line max-len
    return this.http.put<StationRosterMember[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-roster-user?stationRithmId=${stationId}`,
      userIds
    );
  }

  /**
   * Removes users from the station's roster.
   *
   * @param stationId The Specific id of station.
   * @param usersIds The selected users id array to removed.
   * @returns New station Worker Roster.
   */
  removeUsersFromWorkerRoster(
    stationId: string,
    usersIds: string[]
  ): Observable<StationRosterMember[]> {
    // eslint-disable-next-line max-len
    return this.http.delete<StationRosterMember[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-roster-user?stationRithmId=${stationId}`,
      {
        body: usersIds,
      }
    );
  }

  /**
   * Get organization users for a specific station.
   *
   * @param stationRithmId The Specific id of station.
   * @param pageNum The current page.
   * @returns Users for the organization bind to station.
   */
  // eslint-disable-next-line max-len
  getPotentialStationRosterMembers(
    stationRithmId: string,
    pageNum: number
  ): Observable<StationPotentialRostersUsers> {
    if (!pageNum) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Invalid page number.',
            },
          })
      ).pipe(delay(1000));
    } else {
      const params = new HttpParams()
        .set('stationRithmId', stationRithmId)
        .set('pageNum', pageNum)
        .set('pageSize', 20);
      // eslint-disable-next-line max-len
      return this.http.get<StationPotentialRostersUsers>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/potential-roster-users`,
        { params }
      );
    }
  }

  /**
   * Deletes a specified station.
   *
   * @param stationId The Specific id of station.
   * @returns Returns an empty observable.
   */
  deleteStation(stationId: string): Observable<unknown> {
    return this.http.delete<void>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/${stationId}`
    );
  }

  /**
   * Get Workers Roster for a given Station.
   *
   * @param stationId The id of the given station.
   * @returns A rosterMember array.
   */
  getStationWorkerRoster(stationId: string): Observable<StationRosterMember[]> {
    const params = new HttpParams().set('rithmId', stationId);
    return this.http.get<StationRosterMember[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-roster`,
      { params }
    );
  }

  /**
   * Get Owner Roster for a given Station.
   *
   * @param stationId The id of the given station.
   * @returns A rosterMember array.
   */
  getStationOwnerRoster(stationId: string): Observable<StationRosterMember[]> {
    if (!stationId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Invalid station ID.',
            },
          })
      ).pipe(delay(1000));
    } else {
      const params = new HttpParams().set('stationRithmId', stationId);
      return this.http.get<StationRosterMember[]>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/owner-users`,
        { params }
      );
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
   * Returns the flow button name.
   *
   * @param flowButtonText The name of the flow button .
   */
  updatedFlowButtonText(flowButtonText: string): void {
    this.flowButtonText$.next(flowButtonText);
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
   * Update the station questions in the data link field.
   *
   * @param questions The current questions to be updated in data link field.
   */
  updateCurrentStationQuestions(questions: Question[]): void {
    this.currentStationQuestions$.next(questions);
  }

  /**
   * Adds users to the owners roster.
   *
   * @param stationId The Specific id of station.
   * @param userIds The users ids for assign in station.
   * @returns OwnerRoster in the station.
   */
  addUsersToOwnersRoster(
    stationId: string,
    userIds: string[]
  ): Observable<StationRosterMember[]> {
    // eslint-disable-next-line max-len
    return this.http.put<StationRosterMember[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/owner-user?stationRithmId=${stationId}`,
      userIds
    );
  }

  /**
   * Remove owner from the station's roster.
   *
   * @param stationId The Specific id of station.
   * @param usersIds The selected owners id array to removed.
   * @returns New Station information with owners roster.
   */
  removeUsersFromOwnerRoster(
    stationId: string,
    usersIds: string[]
  ): Observable<StationRosterMember[]> {
    // eslint-disable-next-line max-len
    return this.http.delete<StationRosterMember[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/owner-user?stationRithmId=${stationId}`,
      {
        body: usersIds,
      }
    );
  }

  /**
   * Update status document is editable or not.
   *
   * @param stationRithmId The Specific id of station.
   * @param newStatus The new status is editable in the change for document.
   * @returns New status for document editable.
   */
  updateStatusDocumentEditable(
    stationRithmId: string,
    newStatus: boolean
  ): Observable<boolean> {
    // eslint-disable-next-line max-len
    return this.http.put<boolean>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-rename-document?stationRithmId=${stationRithmId}&canRename=${newStatus}`,
      stationRithmId
    );
  }

  /**
   * Get status document is editable or not.
   *
   * @param stationRithmId The Specific id of station.
   * @returns Status for document editable.
   */
  getStatusDocumentEditable(stationRithmId: string): Observable<boolean> {
    const params = new HttpParams().set('stationRithmId', stationRithmId);
    return this.http.get<boolean>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/worker-rename-document`,
      { params }
    );
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
  updateStationGeneralInstructions(
    rithmId: string,
    instructions: string
  ): Observable<StandardStringJSON> {
    const generalInstructions: StandardStringJSON = {
      data: instructions,
    };
    // eslint-disable-next-line max-len
    return this.http.put<StandardStringJSON>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/instructions?rithmId=${rithmId}`,
      generalInstructions
    );
  }

  /**
   * Update station name.
   * Get previous and next stations.
   *
   * @param stationRithmId The rithm id actually station.
   * @returns Previous and next stations.
   */
  getPreviousAndNextStations(
    stationRithmId: string
  ): Observable<ForwardPreviousStationsDocument> {
    const params = new HttpParams().set('stationRithmId', stationRithmId);
    return this.http.get<ForwardPreviousStationsDocument>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/prev-next-stations`,
      { params }
    );
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
    return this.http
      .put<StandardStringJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/name?rithmId=${stationRithmId}`,
        standardBody
      )
      .pipe(map((response) => response.data));
  }

  /**
   * Get appended fields to document name template.
   *
   * @param stationId  The id of station.
   * @returns Array the appended fields in document name.
   */
  getDocumentNameTemplate(stationId: string): Observable<DocumentNameField[]> {
    const params = new HttpParams().set('stationRithmId', stationId);
    return this.http.get<DocumentNameField[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/document-naming-template`,
      {
        params,
      }
    );
  }

  /**
   * Update the document naming template.
   *
   * @param stationId  The id of station.
   * @param appendedFields  The appended fields.
   * @returns The updated document name template in the station.
   */
  updateDocumentNameTemplate(
    stationId: string,
    appendedFields: DocumentNameField[]
  ): Observable<DocumentNameField[]> {
    // eslint-disable-next-line max-len
    return this.http.put<DocumentNameField[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/document-naming-template?stationRithmId=${stationId}`,
      appendedFields
    );
  }

  /** Set touch to station template form. */
  touchStationForm(): void {
    this.stationFormTouched$.next();
  }

  /**
   * Get the stations questions.
   *
   * @param stationRithmId  The station id.
   * @param includePreviousQuestions If is true contains previous questions.
   * @returns An array of current and previous for stations.
   */
  getStationQuestions(
    stationRithmId: string,
    includePreviousQuestions = false
  ): Observable<Question[]> {
    const params = new HttpParams()
      .set('stationRithmId', stationRithmId)
      .set('includePreviousQuestions', includePreviousQuestions);
    return this.http.get<Question[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/questions`,
      { params }
    );
  }

  /**
   * Get the field AllowAllOrgWorkers.
   *
   * @param stationRithmId  The station id.
   * @returns An object with value of AllowAllOrgWorkers.
   */
  getAllowAllOrgWorkers(stationRithmId: string): Observable<boolean> {
    const params = new HttpParams().set('rithmId', stationRithmId);
    return this.http
      .get<StandardBooleanJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/allow-all-org-workers`,
        { params }
      )
      .pipe(map((response) => response.data));
  }

  /**
   * Update the status to allow external workers for the station roster.
   *
   * @param stationRithmId The station id that will be update.
   * @param allowAllOrgWorkers The value that will be update.
   * @returns The field AllowAllOrgWorkers updated.
   */
  updateAllowAllOrgWorkers(
    stationRithmId: string,
    allowAllOrgWorkers: boolean
  ): Observable<boolean> {
    const standardBody: StandardBooleanJSON = { data: allowAllOrgWorkers };
    return this.http
      .put<StandardBooleanJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/allow-all-org-workers?rithmId=${stationRithmId}`,
        standardBody
      )
      .pipe(map((response) => response.data));
  }

  /**
   * Get the allow external workers for the station roster.
   *
   * @param stationRithmId The Specific id of station.
   * @returns Allow external workers to be assigned to station documents.
   */
  getAllowExternalWorkers(stationRithmId: string): Observable<boolean> {
    return this.http
      .get<StandardBooleanJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/allow-external-workers?rithmId=${stationRithmId}`
      )
      .pipe(map((response) => response.data));
  }

  /**
   * Get the allow previous button for the document.
   *
   * @param stationRithmId The Specific id of station.
   * @returns Allow previous button to be assigned to document.
   */
  getAllowPreviousButton(stationRithmId: string): Observable<boolean> {
    return this.http
      .get<StandardBooleanJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/allow-previous-button?rithmId=${stationRithmId}`
      )
      .pipe(map((response) => response.data));
  }

  /**
   * Update the the status to allow external workers for the station roster.
   *
   * @param stationRithmId The Specific id of station.
   * @param allowExtWorkers Whether to allow external workers.
   * @returns Allow external workers updated status in the station.
   */
  updateAllowExternalWorkers(
    stationRithmId: string,
    allowExtWorkers: boolean
  ): Observable<boolean> {
    const standardBody: StandardBooleanJSON = { data: allowExtWorkers };
    return this.http
      .put<StandardBooleanJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/allow-external-workers?rithmId=${stationRithmId}`,
        standardBody
      )
      .pipe(map((response) => response.data));
  }

  /**
   * Update AllowPreviousButton information.
   *
   * @param stationRithmId The station id that will be update.
   * @param allowPreviousButton The value that will be update.
   * @returns The status allowPreviousButton updated.
   */
  updateAllowPreviousButton(
    stationRithmId: string,
    allowPreviousButton: boolean
  ): Observable<boolean> {
    const standardBody: StandardBooleanJSON = { data: allowPreviousButton };
    return this.http
      .put<StandardBooleanJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/allow-previous-button?rithmId=${stationRithmId}`,
        standardBody
      )
      .pipe(map((response) => response.data));
  }

  /**
   * Update the flow button text.
   *
   * @param stationRithmId The station id that will be update.
   * @param flowButtonText Contains the text of flow button for updated.
   * @returns The status of update of flow button text.
   */
  updateFlowButtonText(
    stationRithmId: string,
    flowButtonText: string
  ): Observable<string> {
    const standardBody: StandardStringJSON = { data: flowButtonText };
    return this.http
      .put<StandardStringJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/flow-button?stationRithmId=${stationRithmId}`,
        standardBody
      )
      .pipe(map((response) => response.data));
  }

  /**
   * Get the flow button text.
   *
   * @param stationRithmId The current station id.
   * @returns The flow button text.
   */
  getFlowButtonText(stationRithmId: string): Observable<string> {
    const params = new HttpParams().set('stationRithmId', stationRithmId);
    return this.http
      .get<StandardStringJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/flow-button`,
        { params }
      )
      .pipe(map((response) => response.data));
  }

  /**
   * Get the station groups widget.
   *
   * @param stationGroupRithmId The current station id.
   * @param depth Depth of the sub-stationGroups.
   * @returns The station groups widget.
   */
  getStationGroups(
    stationGroupRithmId: string,
    depth = 1
  ): Observable<StationGroupData> {
    const params = new HttpParams()
      .set('stationGroupRithmId', stationGroupRithmId)
      .set('depth', depth);

    return this.http.get<StationGroupData>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH_STATION_GROUP}/hierarchy`,
      { params }
    );
  }

  /**
   * Save or update the field questions of widgets.
   *
   * @param stationRithmId The station id that will be update.
   * @param stationFrames The value that will be update.
   * @returns The field question updated.
   */
  saveStationWidgets(
    stationRithmId: string,
    stationFrames: StationFrameWidget[]
  ): Observable<StationFrameWidget[]> {
    return this.http.post<StationFrameWidget[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/frames?stationRithmId=${stationRithmId}`,
      stationFrames
    );
  }

  /**
   * Save or update the data link widgets.
   *
   * @param stationRithmId The station id that will be update.
   * @param stationFrames The value that will be update.
   * @returns The field question updated.
   */
  saveDataLinkFrames(
    stationRithmId: string,
    stationFrames: StationFrameWidget[]
  ): Observable<StationFrameWidget[]> {
    return this.http.put<StationFrameWidget[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/data-links-frames?stationRithmId=${stationRithmId}`,
      stationFrames
    );
  }

  /**
   * Get the widgets of a station.
   *
   * @param stationRithmId The current station id.
   * @returns The station widget data.
   */
  getStationWidgets(stationRithmId: string): Observable<StationFrameWidget[]> {
    if (!stationRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot retrive  the number of container',
            },
          })
      ).pipe(delay(1000));
    } else {
      const stationWidgets: StationFrameWidget[] = [
        {
          rithmId: '3813442c-82c6-4035-893a-86fa9deca7c3',
          stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
          cols: 6,
          rows: 4,
          x: 0,
          y: 0,
          type: FrameType.Input,
          data: '',
          questions: [],
          id: 0,
        },
        {
          rithmId: '3813442c-82c6-4035-903a-86f39deca2c1',
          stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
          cols: 6,
          rows: 1,
          x: 0,
          y: 0,
          type: FrameType.Headline,
          data: '',
          id: 1,
        },
      ];

      return of(stationWidgets).pipe(delay(1000));
    }
  }

  /**
   * Get worker roster for a given station group.
   *
   * @param stationGroupRithmId The id of the given station group.
   * @returns A rosterMember array.
   */
  getStationGroupWorkerRoster(
    stationGroupRithmId: string
  ): Observable<StationRosterMember[]> {
    const params = new HttpParams().set(
      'stationGroupRithmId',
      stationGroupRithmId
    );
    return this.http.get<StationRosterMember[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH_STATION_GROUP}/roster`,
      { params }
    );
  }

  /**
   * Get owner roster for a given station group.
   *
   * @param stationGroupRithmId The id of the given station group.
   * @returns A rosterMember array.
   */
  getStationGroupOwnerRoster(
    stationGroupRithmId: string
  ): Observable<StationRosterMember[]> {
    const params = new HttpParams().set(
      'stationGroupRithmId',
      stationGroupRithmId
    );
    return this.http.get<StationRosterMember[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH_STATION_GROUP}/admins`,
      { params }
    );
  }

  /**
   * Remove owner from the group's roster.
   *
   * @param stationGroupRithmId The Specific id of group.
   * @param usersIds The selected owners id array to removed.
   * @returns New Group information with owners roster.
   */
  removeUsersFromOwnerRosterGroup(
    stationGroupRithmId: string,
    usersIds: string[]
  ): Observable<StationRosterMember[]> {
    return this.http.delete<StationRosterMember[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH_STATION_GROUP}/admins?stationGroupRithmId=${stationGroupRithmId}`,
      {
        body: usersIds,
      }
    );
  }

  /**
   * Remove users from the group's workers roster.
   *
   * @param stationGroupRithmId The Specific id of group.
   * @param usersIds The selected users id array to removed.
   * @returns New Group information with worker roster.
   */
  removeUsersFromWorkerRosterGroup(
    stationGroupRithmId: string,

    usersIds: string[]
  ): Observable<StationRosterMember[]> {
    return this.http.delete<StationRosterMember[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH_STATION_GROUP}/roster?stationGroupRithmId=${stationGroupRithmId}`,
      { body: usersIds }
    );
  }

  /**
   * Get history station.
   *
   * @param stationRithmId The current station id.
   * @returns The history station.
   */
  getStationHistory(stationRithmId: string): Observable<DocumentEvent[]> {
    if (!stationRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot response station history',
            },
          })
      ).pipe(delay(1000));
    } else {
      const historyResponse: DocumentEvent[] = [
        {
          eventTimeUTC: '2022-01-18T22:13:05.871Z',
          description: 'Event Document #1',
          user: {
            rithmId: '123',
            firstName: 'Testy',
            lastName: 'Test',
            email: 'test@test.com',
            isEmailVerified: true,
            notificationSettings: null,
            createdDate: '1/2/34',
            role: null,
            organization: 'kdjfkd-kjdkfjd-jkjdfkdjk',
          },
        },
      ];
      return of(historyResponse).pipe(delay(1000));
    }
  }

  /**
   * Get the number of container in a station.
   *
   * @param stationRithmId The current station id.
   * @returns Number of containers.
   */
  getNumberOfContainers(stationRithmId: string): Observable<number> {
    const params = new HttpParams().set('stationRithmId', stationRithmId);
    return this.http
      .get<StandardNumberJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/number-of-documents`,
        { params }
      )
      .pipe(map((response) => response.data as number));
  }

  /**
   * Get traffic data document in stations.
   *
   * @param stationGroupRithmId RithmId of groupStation to graph.
   * @returns The data to graph.
   */
  getGroupTrafficData(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stationGroupRithmId: string
  ): Observable<GroupTrafficData> {
    const mockGetGroupTrafficData: GroupTrafficData = {
      title: 'Group Eagle',
      stationGroupRithmId: '9360D633-A1B9-4AC5-93E8-58316C1FDD9F',
      labels: ['station 1', 'station 2', 'station 3', 'station 4', 'station 5'],
      stationDocumentCounts: [10, 5, 8, 10, 20],
      averageDocumentFlow: [2, 4, 1, 8, 9],
    };
    return of(mockGetGroupTrafficData).pipe(delay(1000));
  }

  /**
   * Get user stations.
   *
   * @returns User Stations.
   */
  getStationWidgetPreBuiltData(): Observable<StationWidgetPreBuilt[]> {
    const stationWidgetData: StationWidgetPreBuilt[] = [
      {
        stationRithmId: 'qwe-321-ert-123',
        stationName: 'Mars station',
        totalContainers: 5,
        stationGroup: '132-123-132',
        stationOwners: [
          {
            rithmId: '',
            firstName: 'Marry',
            lastName: 'Poppins',
            email: 'marrypoppins@inpivota.com',
            isOwner: false,
            isWorker: true,
          },
          {
            rithmId: '',
            firstName: 'Worker',
            lastName: 'User',
            email: 'workeruser@inpivota.com',
            isOwner: false,
            isWorker: true,
          },
        ],
      },
    ];
    return of(stationWidgetData).pipe(delay(1000));
  }
}
