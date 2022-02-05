import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Comment } from 'src/models';
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Mocks methods of the `CommentService`.
 */
export class MockCommentService {
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
    const comments: Comment[] = [
      {
        displayText: 'This is first comment',
        stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        dateCreated: '2021-06-16T17:26:47.3506612Z',
        dateLastEdited: '2021-07-14T17:26:47.3506612Z',
        archived: false,
        rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        userRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      },
      {
        displayText: 'This is second comment',
        stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        dateCreated: '2021-06-15T17:26:47.3506612Z',
        dateLastEdited: '2021-07-12T17:26:47.3506612Z',
        archived: false,
        rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        userRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      },
    ];
    return of(comments).pipe(delay(1000));
  }

  /**
   * Posts a new comment to a document or station.
   *
   * @param comment A Comment interface.
   * Comment needs parameters: displayText, DateCreated, UserRithmId, documentRithmId, and stationRithmId.
   * @returns Comment observable.
   */
  postDocumentComment(comment: Comment): Observable<Comment> {
    const response: Comment = {
      displayText: 'string',
      stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      dateCreated: '2021-07-14T18:57:59.771Z',
      dateLastEdited: '2021-07-14T18:57:59.771Z',
      archived: true,
      userFirstName: 'Alex',
      userLastName: 'Can',
      rithmId: 'string',
    };

    return of(response).pipe(delay(1000));
  }
}
