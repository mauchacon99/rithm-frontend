import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Comment } from 'src/models';

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
  getDocumentComments(documentId: string, stationId: string, pageNum: number, commentsPerPage: number): Observable<Comment[]> {
    const comments: Comment[] = [{
      displayText: 'This is first comment',
      dateCreated: '2021-06-16T17:26:47.3506612Z',
      dateLastEdited: '2021-07-14T17:26:47.3506612Z',
      archived: false,
      rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      userRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C'
    }, {
      displayText: 'This is second comment',
      dateCreated: '2021-06-15T17:26:47.3506612Z',
      dateLastEdited: '2021-07-12T17:26:47.3506612Z',
      archived: false,
      rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      userRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C'
    }];
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
        rithmId: '1', docName: 'Almond Flour', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: true, lastUpdated: '2021-06-16T17:26:47.3506612Z', userRithmId: '', documentRithmId: '', documentName: '', flowedTimeUTC: '', stationRithmId: '', id: 1
      },
      rithmId: 'string'
    };

    return of(response).pipe(delay(1000));
  }

}
