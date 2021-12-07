import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { delay, Observable, of, throwError } from 'rxjs';
// eslint-disable-next-line max-len
import { StationDocuments, ForwardPreviousStationsDocument, DocumentStationInformation, StandardStringJSON, DocumentAnswer, QuestionFieldType } from 'src/models';
import { environment } from 'src/environments/environment';

const MICROSERVICE_PATH = '/documentservice/api/document';

/**
 * Service for all document behavior and business logic.
 */
@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(
    private http: HttpClient) { }

  /**
   * Gets a list of documents for a given station.
   *
   * @param stationId The station for which to get the documents.
   * @param pageNum The desired page number of results.
   * @returns A list of documents (one page worth).
   */
  getStationDocuments(stationId: string, pageNum: number): Observable<StationDocuments> {
    const params = new HttpParams()
      .set('stationId', stationId)
      .set('pageNum', pageNum);
    return this.http.get<StationDocuments>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/station-documents`, { params });
  }

  /**
   * Gets a list of forward and previous stations for a specific document.
   *
   * @param documentId The Specific id of document.
   * @param stationId The Specific id of station.
   * @returns A list of forward and previous stations for a specific document.
   */
  getConnectedStationInfo(documentId: string, stationId: string): Observable<ForwardPreviousStationsDocument> {
    const params = new HttpParams()
      .set('documentId', documentId)
      .set('stationId', stationId);
    return this.http.get<ForwardPreviousStationsDocument>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/connected-station-info`, {
      params
    });
  }

  /**
   * Gets a list of forward and previous stations for a specific document.
   *
   * @param documentId The Specific id of document.
   * @param stationId The Specific id of station.
   * @returns A list of forward and previous stations for a specific document.
   */
  getDocumentInfo(documentId: string, stationId: string): Observable<DocumentStationInformation> {
    return this.http.get<DocumentStationInformation>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/document-info`,
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
  updateDocumentName(documentId: string, documentName: StandardStringJSON): Observable<StandardStringJSON> {
    if (!documentId && !documentName) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Cannot update document name.'
        }
      })).pipe(delay(1000));
    } else {
      const newDocumentName: StandardStringJSON = {
        data: 'Almond Flour'
      };
      return of(newDocumentName).pipe(delay(1000));
    }
  }

  /**
   * Get the document name.
   *
   * @param documentId The Specific id of document.
   * @returns The document name.
   */
  getDocumentName(documentId: string): Observable<StandardStringJSON> {
    if (!documentId) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Cannot get document name.'
        }
      })).pipe(delay(1000));
    } else {
      const documentName: StandardStringJSON = {
        data: 'Metroid Dread'
      };
      return of(documentName).pipe(delay(1000));
    }
  }

  /**
   * Save the document answers.
   *
   * @param documentRithmId The specific document id.
   * @param answerDocument The answers so document.
   * @returns The document answers.
   */
  saveAnswerToDocument(documentRithmId: string, answerDocument: DocumentAnswer[]): Observable<DocumentAnswer[]> {
    if (!documentRithmId || answerDocument) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Cannot get the name of the document or its answers.'
        }
      })).pipe(delay(1000));
    } else {
      const expectAnswerDocument: DocumentAnswer[] = [{
        questionRithmId: 'Dev 1',
        documentRithmId: '123-654-789',
        stationRithmId: '741-951-753',
        value: 'Answer Dev',
        file: 'dev.txt',
        filename: 'dev',
        type: QuestionFieldType.Email,
        rithmId: '789-321-456',
        questionUpdated: true,
      },
      {
        questionRithmId: 'Dev 2',
        documentRithmId: '123-654-789-856',
        stationRithmId: '741-951-753-741',
        value: 'Answer Dev2',
        file: 'dev2.txt',
        filename: 'dev2',
        type: QuestionFieldType.City,
        rithmId: '789-321-456-789',
        questionUpdated: false,
      }];
      return of(expectAnswerDocument).pipe(delay(1000));
    }
  }
}
