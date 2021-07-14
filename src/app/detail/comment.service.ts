import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from 'src/models';

const MICROSERVICE_PATH = '/userservice/api/comment';

/**
 * Service for all behavior involving comments.
 */
@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor( private http: HttpClient ) { }

  /**
   * Posts a new comment to a document or station.
   *
   * @param displayText Text of comment.
   * @param dateCreated Date comment was posted.
   * @param userRithmId User commenting.
   * @param documentRithmId Document posted to.
   * @param stationRithmId Station document is housed in.
   * @returns Observable of Comment.
   */
  postDocumentComment(
    displayText: string,
    dateCreated: string,
    userRithmId: string,
    documentRithmId: string,
    stationRithmId: string
  ): Observable<Comment> {
    return this.http.post<Comment>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/Document`, {
      displayText,
      dateCreated,
      userRithmId,
      documentRithmId,
      stationRithmId
    }, { withCredentials: true });
  }
}
