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
  DocumentWidget,
  RuleType,
  OperandType,
  OperatorType,
  DocumentImage,
  ImageData,
  DataLinkObject,
  StationFrameWidget,
  FrameType,
  ContainerWidgetPreBuilt,
  DocumentCurrentStation,
  Power,
  TriggerType,
  ActionType,
  OptionsCompressFile,
} from 'src/models';
import { environment } from 'src/environments/environment';
import imageCompression from 'browser-image-compression';
import { CacheBucket, withCache } from '@ngneat/cashew';

const MICROSERVICE_PATH = '/documentservice/api/document';
const MICROSERVICE_PATH_FILE_USER = '/documentservice/api/vault';

/**
 * Service for all document behavior and business logic.
 */
@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  /** Bucket contain avatars. */
  avatarsBucket = new CacheBucket();

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
   * @param documentName Search documents by name.
   * @param pageSize Limit of documents per page.
   * @returns A list of documents (one page worth).
   */
  getStationDocuments(
    stationId: string,
    pageNum: number,
    documentName = '',
    pageSize = 10
  ): Observable<StationDocuments> {
    const params = new HttpParams()
      .set('stationId', stationId)
      .set('pageNum', pageNum)
      .set('pageSize', pageSize)
      .set('documentName', documentName);
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
      if (element.type === QuestionFieldType.File) {
        if (element.file) {
          formData.append(`answers[${index}].file`, element.file);
        } else {
          formData.append(`answers[${index}].file`, '');
        }
        if (element.filename) {
          formData.append(`answers[${index}].filename`, element.filename);
        } else {
          formData.append(`answers[${index}].filename`, '');
        }
      }
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
  autoFlowDocument(documentAutoFlow: DocumentAutoFlow): Observable<string[]> {
    return this.http.post<string[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/auto-flow`,
      documentAutoFlow
    );
  }

  /**
   * Changes the flow of the document a current station to a previous station.
   *
   * @param document Document to be moved to a previous station.
   * @returns Returns an empty observable.
   */
  flowDocumentToPreviousStation(document: MoveDocument): Observable<unknown> {
    if (!document) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error:
                'Invalid data, document cannot be moved to a previous station.',
            },
          })
      ).pipe(delay(1000));
    }
    return this.http.post<void>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/flow-station-to-station`,
      document
    );
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
      name: name || 'New Document',
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
   * @param columns The Specifics id the questions for show.
   * @returns Returns data station widget.
   */
  getStationWidgetDocuments(
    stationRithmId: string,
    columns: string[]
  ): Observable<StationWidgetData> {
    const columnParameter = { data: columns };
    return this.http.post<StationWidgetData>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/documents-at-station?stationRithmId=${stationRithmId}`,
      columnParameter
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
   * @param newFlowLogic New flow logic rule for current station.
   * @returns Station flow logic.
   */
  saveStationFlowLogic(newFlowLogic: FlowLogicRule[]): Observable<unknown> {
    return this.http.put<void>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/flow-logic`,
      newFlowLogic
    );
  }

  /**
   * Get document widget.
   *
   * @param documentRithmId Rithm of document.
   * @returns Returns DocumentWidget.
   */
  getDocumentWidget(documentRithmId: string): Observable<DocumentWidget> {
    const params = new HttpParams().set('documentRithmId', documentRithmId);
    return this.http.get<DocumentWidget>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/document-widget`,
      { params }
    );
  }

  /**
   * Update each station flow rules.
   *
   * @param flowsLogic Flow logic rules for each station.
   * @returns Updated station logic flows rules.
   */
  updateStationFlowLogicRule(flowsLogic: FlowLogicRule[]): Observable<unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    flowsLogic = [
      {
        stationRithmId: '3813442c-82c6-4035-893a-86fa9deca7c3',
        destinationStationRithmID: '63d47261-1932-4fcf-82bd-159eb1a7243g',
        flowRule: {
          ruleType: RuleType.Or,
          equations: [
            {
              leftOperand: {
                type: OperandType.Number,
                questionType: QuestionFieldType.ShortText,
                value: '102',
                text: 'test',
              },
              operatorType: OperatorType.GreaterOrEqual,
              rightOperand: {
                type: OperandType.Number,
                questionType: QuestionFieldType.ShortText,
                value: '101',
                text: 'test',
              },
            },
          ],
          subRules: [],
        },
      },
    ];
    return of().pipe(delay(1000));
  }

  /**
   * Delete rule from station flow logic.
   *
   * @param rulesFromStationFlowLogic The flow logic rule to be updated.
   * @returns Station flow logic.
   */
  deleteRuleFromStationFlowLogic(
    rulesFromStationFlowLogic: FlowLogicRule[]
  ): Observable<unknown> {
    return this.http.put<void>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/flow-logic`,
      rulesFromStationFlowLogic
    );
  }

  /**
   * Upload image.
   *
   * @param file File to upload.
   * @returns Id of image uploaded.
   */
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http
      .post<StandardStringJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/image`,
        formData
      )
      .pipe(map((response) => response.data));
  }

  /**
   * Get images document.
   *
   * @param documentRithmId The Specific ID of document.
   * @returns Returns data images document.
   */
  getImagesDocuments(documentRithmId: string): Observable<DocumentImage[]> {
    const params = new HttpParams().set('documentRithmId', documentRithmId);
    return this.http.get<DocumentImage[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/images`,
      { params }
    );
  }

  /**
   * Get image by rithmId of image.
   *
   * @param imageRithmId The Specific ID of image.
   * @returns Returns data image.
   */
  getImageByRithmId(imageRithmId: string): Observable<ImageData> {
    const params = new HttpParams().set('vaultFileRithmId', imageRithmId);
    return this.http.get<ImageData>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/vaultjson`,
      {
        params,
      }
    );
  }

  /**
   * Save/update a datalink object.
   *
   * @param stationRithmId The current station id.
   * @param dataLinkObject The object to save.
   * @returns A DataLinkObject.
   */
  saveDataLink(
    stationRithmId: string,
    dataLinkObject: DataLinkObject
  ): Observable<DataLinkObject> {
    return this.http.put<DataLinkObject>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/refresh-data-link?stationRithmId=${stationRithmId}`,
      dataLinkObject
    );
  }

  /**
   * Get containers assigned to me.
   *
   * @returns Data containers.
   */
  getContainerWidgetPreBuilt(): Observable<ContainerWidgetPreBuilt[]> {
    return this.http.get<ContainerWidgetPreBuilt[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/assigned-to-me`
    );
  }

  /**
   * Get frames by type.
   *
   * @param stationRithmId The current station id.
   * @param documentRithmId The Specific ID of document.
   * @param frameType The frame type.
   * @returns A StationFrameWidget.
   */
  getDataLinkFrames(
    stationRithmId: string,
    documentRithmId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    frameType: FrameType
  ): Observable<StationFrameWidget[]> {
    if (!stationRithmId || !documentRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot get the frames by type.',
            },
          })
      ).pipe(delay(1000));
    } else {
      const params = new HttpParams()
        .set('stationRithmId', stationRithmId)
        .set('documentRithmId', documentRithmId);

      return this.http.get<StationFrameWidget[]>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH}/frames-by-types`,
        {
          params,
        }
      );
    }
  }

  /**
   * Get the widgets of a container.
   *
   * @param documentRithmId The Specific ID of document.
   * @param stationRithmId The current station id.
   * @param type The frame type.
   * @returns The container widget data.
   */
  getContainerWidgets(
    documentRithmId: string,
    stationRithmId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type?: FrameType
  ): Observable<StationFrameWidget[]> {
    const params = new HttpParams()
      .set('documentRithmId', documentRithmId)
      .set('stationRithmId', stationRithmId);

    return this.http.get<StationFrameWidget[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/frames-by-type`,
      {
        params,
      }
    );
  }

  /**
   * Get the current stations from containers.
   *
   * @param documentRithmId The current document id.
   * @returns The current stations.
   */
  getCurrentStations(
    documentRithmId: string
  ): Observable<DocumentCurrentStation[]> {
    const params = new HttpParams().set('documentRithmId', documentRithmId);
    return this.http.get<DocumentCurrentStation[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/current-stations`,
      { params }
    );
  }

  /**
   * Upload image to user.
   *
   * @param file File to upload.
   * @returns Id of image uploaded.
   */
  async uploadImageUser(file: File): Promise<Observable<string>> {
    const configCompressImage: OptionsCompressFile = {
      maxSizeMB: 0.02,
      maxWidthOrHeight: 1024,
    };
    const formData = new FormData();
    const compressImage = await this.compressImage(file, configCompressImage);
    formData.append('image', compressImage);

    return this.http
      .post<StandardStringJSON>(
        `${environment.baseApiUrl}${MICROSERVICE_PATH_FILE_USER}/profile-image`,
        formData
      )
      .pipe(map((response) => response.data));
  }

  /**
   * It takes a file and an options object as parameters, and returns a compressed file.
   *
   * @param file - File - The file to be compressed.
   * @param options - OptionsCompressFile.
   * @returns A promise that resolves to a compressed file.
   */
  async compressImage(file: File, options: OptionsCompressFile): Promise<File> {
    return imageCompression(file, options)
      .then((compressedFile) => {
        return new File([compressedFile], file.name, {
          type: file.type,
        });
      })
      .catch(() => {
        return file;
      });
  }

  /**
   * Get Image user.
   *
   * @param imageRithmId Image Rithm Id.
   * @returns Image Data.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getImageUser(imageRithmId: string): Observable<ImageData> {
    const params = new HttpParams().set('vaultFileRithmId', imageRithmId);
    return this.http.get<ImageData>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH_FILE_USER}/profile-image`,
      {
        params,
        context: withCache({
          bucket: this.avatarsBucket,
        }),
      }
    );
  }

  /**
   * Get powers of current station.
   *
   * @param stationRithmId Specific id of station.
   * @returns The power of a station.
   */
  getStationPowers(stationRithmId: string): Observable<Power[]> {
    if (!stationRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot retrive the powers of current station.',
            },
          })
      ).pipe(delay(1000));
    } else {
      const stationPowers: Power[] = [
        {
          rithmId: '3j4k-3h2j-hj4j',
          triggers: [
            {
              rithmId: '3j4k-3h2j-hj5h',
              type: TriggerType.ManualFlow,
              source: 'Source Trigger #1',
              value: 'Value Trigger #1',
            },
          ],
          actions: [
            {
              rithmId: '3j4k-3h2j-ft5h',
              type: ActionType.CreateDocument,
              target: 'Target Action #1',
              data: 'Data Action #1',
              resultMapping: 'Result Action #1',
              header: 'Header Action #1',
            },
          ],
          stationRithmId: '73d47261-1932-4fcf-82bd-159eb1a7243f',
          flowToStationRithmIds: [
            '73d47261-1932-4fcf-82bd-159eb1a72422',
            '73d47261-1932-4fcf-82bd-159eb1a7242g',
          ],
          name: 'Power Test #1',
          condition: 'Condition Test #1',
        },
      ];
      return of(stationPowers).pipe(delay(1000));
    }
  }

  /**
   * Delete powers from the stations.
   *
   * @param powerRithmId Specific id of the power.
   * @param stationRithmId Specific id of the station where the power will be removed.
   * @returns A object.
   */
  deleteStationPowers(
    powerRithmId: string,
    stationRithmId: string
  ): Observable<unknown> {
    if (!powerRithmId || !stationRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot delete the powers of current station.',
            },
          })
      ).pipe(delay(1000));
    } else {
      const stationPowers: Power[] = [
        {
          rithmId: '3j4k-3h2j-hj4j',
          triggers: [
            {
              rithmId: '3j4k-3h2j-hj5h',
              type: TriggerType.ManualFlow,
              source: 'Source Trigger #1',
              value: 'Value Trigger #1',
            },
          ],
          actions: [
            {
              rithmId: '3j4k-3h2j-ft5h',
              type: ActionType.CreateDocument,
              target: 'Target Action #1',
              data: 'Data Action #1',
              resultMapping: 'Result Action #1',
              header: 'Header Action #1',
            },
          ],
          stationRithmId: '73d47261-1932-4fcf-82bd-159eb1a7243f',
          flowToStationRithmIds: [
            '73d47261-1932-4fcf-82bd-159eb1a72422',
            '73d47261-1932-4fcf-82bd-159eb1a7242g',
          ],
          name: 'Power Test #1',
          condition: 'Condition Test #1',
        },
      ];
      return of(stationPowers).pipe(delay(1000));
    }
  }
}
