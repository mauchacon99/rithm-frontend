import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * Mocks methods of the `StationService`.
 */
export class MockCommentService {

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
    return of('Joe').pipe(delay(1000));
  }

}
