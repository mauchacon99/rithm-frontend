import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Comment } from 'src/models';

const MICROSERVICE_PATH = '/commentservice/api/comment';

/**
 * Service for all behavior involving comments.
 */
@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  /**
   * Posts a new comment to a document or station.
   *
   * @param comment A Comment interface.
   * Comment needs parameters: displayText, DateCreated, UserRithmId, documentRithmId, and stationRithmId.
   * @returns Observable of Comment.
   */
  postDocumentComment(comment: Comment): Observable<Comment> {
    const response: Comment = {
      displayText: comment.displayText,
      dateCreated: '2021-07-14T18:57:59.771Z',
      dateLastEdited: '2021-07-14T18:57:59.771Z',
      archived: true,
      user: {
        rithmId: '123',
        firstName: 'Testy',
        lastName: 'Test',
        email: 'test@test.com',
        objectPermissions: [],
        groups: [],
        createdDate: '1/2/34'
      },
      station: {
        name: 'string',
        instructions: 'sdfa',
        documents: 1,
        supervisors: [],
        rosterUsers: []
      },
      document: {
        // eslint-disable-next-line max-len
        rithmId: '1', documentName: 'Almond Flour', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: '', isEscalated: true, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', userRithmId: '', documentRithmId: '', stationRithmId: '', id: 1
      },
      rithmId: 'string'
    };

    return of(response).pipe(delay(1000));
  }

  /**
   * Gets a list of comments.
   *
   * @param documentId The documentId of document for which comments needs to be fetched.
   * @param stationId Id of station for which comments needs to be fetched.
   * @param pageNum The desired page number of results.
   * @param commentsPerPage The limit of comments per page.
   * @returns A list of comments based on documentId and stationId.
   */
  getDocumentComments(
    documentId: string,
    stationId: string,
    pageNum: number,
    commentsPerPage: number
  ): Observable<Comment[]> {
    const params = new HttpParams()
      .set('documentId',documentId)
      .set('stationId', stationId)
      .set('pageNum', pageNum)
      .set('commentsPerPage', commentsPerPage);

    return this.http.get<Comment[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/Document`, { params });
  }
}
