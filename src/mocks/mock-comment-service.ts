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
   * @returns Comment observable.
   */
   postDocumentComment(): Observable<Comment> {
    const comment: Comment = {
      displayText: 'Here is a test message that is a test and a message.',
      dateCreated: '2021-07-12T19:06:47.3506612Z',
      dateLastEdited: '2021-07-12T19:06:47.3506612Z',
      archived: false,
      userRithmId: '1234',
      documentRithmId: '1234',
      stationRithmId: '1234'
    };

    return of(comment).pipe(delay(1000));
  }

}
