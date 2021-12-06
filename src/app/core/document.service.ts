import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { delay, Observable, of, throwError } from 'rxjs';
// eslint-disable-next-line max-len
import { StationDocuments, ForwardPreviousStationsDocument, DocumentStationInformation, DocumentNameField, StandardStringJSON } from 'src/models';
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
   * Get appended fields to document.
   *
   * @param stationId  The id of station.
   * @returns Array the fields in document.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAppendedFieldsOnDocumentName(stationId: string): Observable<DocumentNameField[]> {
    const params = new HttpParams()
      .set('stationRithmId', stationId);
    return this.http.get<DocumentNameField[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/document-naming-template`, {
      params
    });
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
}
