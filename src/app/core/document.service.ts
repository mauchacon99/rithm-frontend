import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { delay, Observable, of, throwError } from 'rxjs';
import { StationDocuments, ForwardPreviousStationsDocument, DocumentStationInformation } from 'src/models';
import { environment } from 'src/environments/environment';
import { DocumentNameField } from 'src/models/document-name-field';

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
   * Get the document field name array.
   *
   * @param documentId The id of document.
   * @param stationId  The id of station.
   * @param appendedFiles  The appended files.
   * @returns A list of field names for document name.
   */
  updateDocumentName(documentId: string, stationId: string, appendedFiles: string[]): Observable<DocumentNameField[]> {
    if (!documentId || !stationId || !appendedFiles) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Cannot update document name.'
        }
      })).pipe(delay(1000));
    } else {
      const documentFieldName = [
        {
          prompt: 'SKU',
          rithmId: '1lk2-as3k-12kk-9s83'
        },
        {
          prompt: '-',
          rithmId: ''
        }
      ];
      return of(documentFieldName).pipe(delay(1000));
    }
  }
}
