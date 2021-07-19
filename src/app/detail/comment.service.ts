import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from 'src/models';
import { delay } from 'rxjs/operators';

const MICROSERVICE_PATH = '/userservice/api/comment';

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
  postDocumentComment(
    comment: Comment
  ): Observable<Comment> {
    return this.http.post<Comment>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/Document`, {
      comment
      //not currently actually requiring withCredentials.
    }, { withCredentials: true });
  }

  /**
   * Gets a list of comments.
   *
   * @param documentId The documentId of document for which comments needs to be fetched.
   * @param stationId Id of station for which comments needs to be fetched.
   * @param pageNumber The desired page number of results.
   * @param commentsPerPage The limit of comments per page.
   * @returns A list of comments based on documentId and stationId.
   */
  getDocumentComments(documentId: string, stationId: string, pageNumber: number, commentsPerPage: number): Observable<Comment[]> {
    // eslint-disable-next-line max-len
    const params = new HttpParams().set('documentId',documentId).set('stationId', stationId).set('pageNumber', pageNumber).set('commentsPerPage', commentsPerPage);

    return this.http.get<Comment[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/Document`, { withCredentials: true, params });

    // const comments: Comment[] = [{
    //   displayText: 'This is first comment',
    //   dateCreated: '2021-06-16T17:26:47.3506612Z',
    //   dateLastEdited: '2021-07-14T17:26:47.3506612Z',
    //   archived: false,
    //   rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
    //   userRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C'
    // }, {
    //   displayText: 'This is second comment',
    //   dateCreated: '2021-06-15T17:26:47.3506612Z',
    //   dateLastEdited: '2021-07-12T17:26:47.3506612Z',
    //   archived: false,
    //   rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
    //   userRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C'
    // }];
    // return of(comments).pipe(delay(1000));
  }
}
