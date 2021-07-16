import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Comment } from 'src/models';

/**
 * Mocks methods of the `CommentService`.
 */
export class MockCommentService {

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
