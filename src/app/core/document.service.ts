import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import {
  BehaviorSubject,
  delay,
  map,
  Observable,
  of,
  Subject,
  throwError,
} from 'rxjs';
import {
  StationDocuments,
  ForwardPreviousStationsDocument,
  DocumentStationInformation,
  StandardStringJSON,
  DocumentAnswer,
  DocumentName,
  StationRosterMember,
  Question,
  DocumentAutoFlow,
  MoveDocument,
  StationWidgetData,
  FlowLogicRule,
  DocumentEvent,
  QuestionFieldType,
  RuleType,
  OperandType,
  OperatorType,
} from 'src/models';
import { environment } from 'src/environments/environment';

const MICROSERVICE_PATH = '/documentservice/api/document';

/**
 * Service for all document behavior and business logic.
 */
@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  /** The Name of the Document as BehaviorSubject. */
  documentName$ = new BehaviorSubject<DocumentName>({
    baseName: '',
    appendedName: '',
  });

  /** Document Answer to be updated. */
  documentAnswer$ = new Subject<DocumentAnswer>();

  constructor(private http: HttpClient) {}

  /**
   * Update the DocumentAnswer subject.
   *
   * @param answer An answer to be updated in the documentTemplate.
   */
  updateAnswerSubject(answer: DocumentAnswer): void {
    this.documentAnswer$.next(answer);
  }

  /**
   * Gets a list of documents for a given station.
   *
   * @param stationId The station for which to get the documents.
   * @param pageNum The desired page number of results.
   * @returns A list of documents (one page worth).
   */
  getStationDocuments(
    stationId: string,
    pageNum: number
  ): Observable<StationDocuments> {
    const params = new HttpParams()
      .set('stationId', stationId)
      .set('pageNum', pageNum);
    return this.http.get<StationDocuments>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/station-documents`,
      { params }
    );
  }

  /**
   * Gets a list of forward and previous stations for a specific document.
   *
   * @param documentId The Specific id of document.
   * @param stationId The Specific id of station.
   * @returns A list of forward and previous stations for a specific document.
   */
  getConnectedStationInfo(
    documentId: string,
    stationId: string
  ): Observable<ForwardPreviousStationsDocument> {
    const params = new HttpParams()
      .set('documentId', documentId)
      .set('stationId', stationId);
    return this.http.get<ForwardPreviousStationsDocument>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/connected-station-info`,
      {
        params,
      }
    );
  }

  /**
   * Gets a list of forward and previous stations for a specific document.
   *
   * @param documentId The Specific id of document.
   * @param stationId The Specific id of station.
   * @returns A list of forward and previous stations for a specific document.
   */
  getDocumentInfo(
    documentId: string,
    stationId: string
  ): Observable<DocumentStationInformation> {
    return this.http.get<DocumentStationInformation>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/document-info`,
      { params: { documentId, stationId } }
    );
  }

  /**
   * Update the document name.
   *
   * @param documentId The specific id of document.
   * @param documentName The new document name.
   * @returns The new document name.
   */
  updateDocumentName(
    documentId: string,
    documentName: string
  ): Observable<string> {
    const newDocumentName: StandardStringJSON = {
      data: documentName,
    };
    return this.http
      .put<StandardStringJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/name?rithmId=${documentId}`,
        newDocumentName
      )
      .pipe(map((response) => response.data));
  }

  /**
   * Get the document name.
   *
   * @param documentId The Specific id of document.
   * @returns The document name.
   */
  getDocumentName(documentId: string): Observable<DocumentName> {
    const params = new HttpParams().set('documentRithmId', documentId);
    return this.http.get<DocumentName>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/name`,
      { params }
    );
  }

  /**
   * Save the document answers.
   *
   * @param documentRithmId The specific document id.
   * @param documentAnswers The answers so document.
   * @returns The document answers.
   */
  saveDocumentAnswer(
    documentRithmId: string,
    documentAnswers: DocumentAnswer[]
  ): Observable<DocumentAnswer[]> {
    const formData = new FormData();
    documentAnswers.forEach((element, index) => {
      formData.append(
        `answers[${index}].questionRithmId`,
        element.questionRithmId
      );
      formData.append(
        `answers[${index}].documentRithmId`,
        element.documentRithmId
      );
      formData.append(
        `answers[${index}].stationRithmId`,
        element.stationRithmId
      );
      formData.append(
        `answers[${index}].value`,
        element.type !== QuestionFieldType.Phone
          ? element.value
          : element.value.replace(/\s/g, '')
      );
      formData.append(`answers[${index}].type`, element.type);
      formData.append(`answers[${index}].questionUpdated`, 'true');
    });
    return this.http.post<DocumentAnswer[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/answers?documentRithmId=${documentRithmId}`,
      formData
    );
  }

  /**
   * Update the Document Name Behavior Subject.
   *
   * @param documentName The Document Name.
   */
  updateDocumentNameBS(documentName: DocumentName): void {
    this.documentName$.next(documentName);
  }

  /**
   * Get last updated time for document.
   *
   * @param documentRithmId The id of the document to get the last updated date.
   * @returns Formatted Updated Date.
   */
  getLastUpdated(documentRithmId: string): Observable<string> {
    const params = new HttpParams().set('documentRithmId', documentRithmId);
    return this.http
      .get<StandardStringJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/last-updated`,
        { params }
      )
      .pipe(map((response) => response.data));
  }

  /**
   * Get held time in station for document.
   *
   * @param documentId The specific id of document.
   * @param stationId The specific id of station.
   * @returns The document time in station.
   */
  getDocumentTimeInStation(
    documentId: string,
    stationId: string
  ): Observable<string> {
    const params = new HttpParams()
      .set('documentRithmId', documentId)
      .set('stationRithmId', stationId);
    return this.http
      .get<StandardStringJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/flowed-time`,
        { params }
      )
      .pipe(map((response) => response.data));
  }

  /**
   * Get the user assigned to the document.
   *
   * @param documentId The specific id of document.
   * @param stationId The specific id of station.
   * @param getOnlyCurrentStation The specific current station only.
   * @returns The assigned user.
   */
  getAssignedUserToDocument(
    documentId: string,
    stationId: string,
    getOnlyCurrentStation: boolean
  ): Observable<StationRosterMember[]> {
    if (!documentId || (!stationId && getOnlyCurrentStation)) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot get the user assigned for document.',
            },
          })
      ).pipe(delay(1000));
    } else {
      const params = new HttpParams()
        .set('documentId', documentId)
        .set('stationId', stationId)
        .set('getOnlyCurrentStation', getOnlyCurrentStation);
      return this.http.get<StationRosterMember[]>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/assigned-user`,
        { params }
      );
    }
  }

  /**
   * Get Previous Questions.
   *
   * @param documentId The specific id of document.
   * @param stationId The specific id of station.
   * @param getPrivate Will fetch only private or non private questions.
   * @returns The array with previous questions.
   */
  getDocumentPreviousQuestions(
    documentId: string,
    stationId: string,
    getPrivate: boolean
  ): Observable<Question[]> {
    const params = new HttpParams()
      .set('documentRithmId', documentId)
      .set('stationRithmId', stationId)
      .set('getPrivate', getPrivate);

    return this.http.get<Question[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/previous-questions`,
      { params }
    );
  }

  /**
   * Delete a specified document.
   *
   * @param documentRithmId The Specific id of document.
   * @returns Returns an empty observable.
   */
  deleteDocument(documentRithmId: string): Observable<unknown> {
    return this.http.delete<void>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/${documentRithmId}`
    );
  }

  /**
   * Flow a document.
   *
   * @param documentAutoFlow Params for add flow to Document.
   * @returns Returns an empty observable.
   */
  autoFlowDocument(documentAutoFlow: DocumentAutoFlow): Observable<unknown> {
    if (!documentAutoFlow) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Unable to flow the document, invalid parameters.',
            },
          })
      ).pipe(delay(1000));
    } else {
      return this.http.post<void>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/auto-flow`,
        documentAutoFlow
      );
    }
  }

  /**
   * Unassign a user to document via API.
   *
   * @param documentRithmId The Specific id of document.
   * @param stationRithmId The station Id.
   * @returns Returns an empty observable.
   */
  unassignUserToDocument(
    documentRithmId: string,
    stationRithmId: string
  ): Observable<unknown> {
    if (!documentRithmId || !stationRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'The user cannot be unassigned.',
            },
          })
      ).pipe(delay(1000));
    } else {
      const requestObject = {
        documentRithmId: documentRithmId,
        stationRithmId: stationRithmId,
      };
      return this.http.delete<void>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/assign-user`,
        { body: requestObject }
      );
    }
  }

  /**
   * Move the document from a station to another.
   *
   * @param moveDocument Model to move the document.
   * @returns Returns an empty observable.
   */
  moveDocument(moveDocument: MoveDocument): Observable<unknown> {
    if (!moveDocument) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Data invalid, document could not be moved.',
            },
          })
      ).pipe(delay(1000));
    } else {
      return this.http.post<void>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/flow-station-to-station`,
        moveDocument
      );
    }
  }

  /**
   * Creates a new document.
   *
   * @param name The name of document.
   * @param priority The priority of the document.
   * @param stationRithmId The rithmid of the station where this document should start.
   * @returns Return string rithmId.
   */
  createNewDocument(
    name: string,
    priority: number,
    stationRithmId: string
  ): Observable<string> {
    const requestObject = {
      name,
      priority,
    };
    return this.http
      .post<{ /** Document Rithm Id. */ rithmId: string }>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}?stationRithmId=${stationRithmId}`,
        requestObject
      )
      .pipe(map((response) => response.rithmId));
  }

  /**
   * Assign an user to a document.
   *
   * @param userRithmId The Specific id of user assign.
   * @param stationRithmId The Specific id of station.
   * @param documentRithmId The Specific id of document.
   * @returns Returns an empty observable.
   */
  assignUserToDocument(
    userRithmId: string,
    stationRithmId: string,
    documentRithmId: string
  ): Observable<unknown> {
    const requestObject = {
      userRithmId: userRithmId,
      documentRithmId: documentRithmId,
      stationRithmId: stationRithmId,
    };
    return this.http.post<void>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/assign-user`,
      requestObject
    );
  }

  /**
   * Get document for station widgets.
   *
   * @param stationRithmId The Specific ID of station.
   * @returns Returns data station widget.
   */
  getStationWidgetDocuments(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stationRithmId: string
  ): Observable<StationWidgetData> {
    const params = new HttpParams().set('stationRithmId', stationRithmId);
    return this.http.get<StationWidgetData>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/documents-at-station`,
      { params }
    );
  }

  /**
   * Get each station flow rules.
   *
   * @param stationRithmId The specific  station id.
   * @returns Station flow logic rule.
   */
  getStationFlowLogicRule(stationRithmId: string): Observable<FlowLogicRule[]> {
    const params = new HttpParams().set('stationRithmId', stationRithmId);
    return this.http.get<FlowLogicRule[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/flow-logic`,
      { params }
    );
  }

  /**
   * Get events for the document history.
   *
   * @param documentRithmId The Specific ID of document.
   * @returns Returns an array of events for the document history.
   */
  getDocumentEvents(documentRithmId: string): Observable<DocumentEvent[]> {
    const params = new HttpParams().set('documentRithmId', documentRithmId);
    return this.http.get<DocumentEvent[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/history`,
      { params }
    );
  }

  /**
   * Save station flow rules.
   *
   * @param stationRithmId The specific  station id.
   * @returns Station flow logic rule.
   */
  saveStationFlowLogicRule(stationRithmId: string): Observable<FlowLogicRule> {
    if (!stationRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'The id of the Station cannot be empty.',
            },
          })
      ).pipe(delay(1000));
    } else {
      const stationFlowLogic: FlowLogicRule = {
        stationRithmId: '3813442c-82c6-4035-893a-86fa9deca7c3',
        destinationStationRithmId: '73d47261-1932-4fcf-82bd-159eb1a7243f',
        flowRules: [
          {
            ruleType: RuleType.Or,
            equations: [
              {
                leftOperand: {
                  type: OperandType.Field,
                  value: 'birthday',
                },
                operatorType: OperatorType.Before,
                rightOperand: {
                  type: OperandType.Date,
                  value: '5/27/1982',
                },
              },
            ],
          },
        ],
      };
      return of(stationFlowLogic).pipe(delay(1000));
    }
  }
}
