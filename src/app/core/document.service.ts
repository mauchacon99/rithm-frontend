import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { delay, map, Observable, of, throwError } from 'rxjs';
// eslint-disable-next-line max-len
import { StationDocuments, ForwardPreviousStationsDocument, DocumentStationInformation, StandardStringJSON, DocumentAnswer } from 'src/models';
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
  updateDocumentName(documentId: string, documentName: string): Observable<string> {
    const newDocumentName: StandardStringJSON = {
      data: documentName
    };
    return this.http.put<StandardStringJSON>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/name?rithmId=${documentId}`, newDocumentName)
      .pipe(map(response => response.data));
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
    if (!documentRithmId || !answerDocument) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Cannot get the name of the document or its answers.'
        }
      })).pipe(delay(1000));
    } else {
      return this.http.post<DocumentAnswer[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/answers?documentRithmId=${documentRithmId}`,
        answerDocument
      );
    }
  }

  /**
   * Get last updated time for document.
   *
   * @param documentRithmId The id of the document to get the last updated date.
   * @returns Formatted Updated Date.
   */
  getLastUpdated(documentRithmId: string): Observable<string> {
    const params = new HttpParams()
      .set('documentRithmId', documentRithmId);
    return this.http.get<StandardStringJSON>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/last-updated`, { params })
      .pipe(map(response => response.data));
  }
}
