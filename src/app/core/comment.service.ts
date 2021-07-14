
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * Service for all interactions involving a comments.
 */
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) { }

  /**
   * Gets a list of comments.
   *
   * @param documentId The documentId of document for which comments needs to be fetched.
   * @param stationId Id of station for which comments needs to be fetched.
   * @param pageNumber The desired page number of results.
   * @param commentsPerPage The limit of comments per page.
   * @returns A list of comments based on documentId and stationId.
   */
  getDocumentComments(documentId: string, stationId: string, pageNumber: number, commentsPerPage: number): Observable<string> {
    const params = new HttpParams()
      .set('documentId', documentId)
      .set('stationId', stationId)
      .set('pageNumber', pageNumber)
      .set('commentsPerPage', commentsPerPage);
    return of('Joe').pipe(delay(1000));
  }

}
