import { HttpClient } from '@angular/common/http';
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
}
