import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from 'src/models';

const MICROSERVICE_PATH = '/commentservice/api/comment';

/**
 * Service for all behavior involving comments.
 */
@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}

  /**
   * Posts a new comment to a document or station.
   *
   * @param comment A Comment interface.
   * Comment needs parameters: displayText, DateCreated, UserRithmId, documentRithmId, and stationRithmId.
   * @returns Observable of Comment.
   */
  postDocumentComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/Document`,
      {
        ...comment,
      }
    );
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
      .set('documentId', documentId)
      .set('stationId', stationId)
      .set('pageNum', pageNum)
      .set('commentsPerPage', commentsPerPage);

    return this.http.get<Comment[]>(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/Document`,
      { params }
    );
  }
}
