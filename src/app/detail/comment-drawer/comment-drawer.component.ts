import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { CommentService } from 'src/app/core/comment.service';
import { ErrorService } from 'src/app/core/error.service';
import { Comment } from 'src/models';

/**
 * Component for containing all comments in the side drawer for a station or document.
 */
@Component({
  selector: 'app-comment-drawer',
  templateUrl: './comment-drawer.component.html',
  styleUrls: ['./comment-drawer.component.scss']
})
export class CommentDrawerComponent {

  /** Is the content being loaded. */
  isLoading = true;

  /** List of comments for a document. */
  comments: Comment[] = [];

  constructor(private commentService: CommentService,
    private errorService: ErrorService) { }

  /**
   * Gets a list of comments.
   *
   * @param documentId The documentId of document for which comments needs to be fetched.
   * @param stationId Id of station for which comments needs to be fetched.
   * @param pageNumber The desired page number of results.
   * @param commentsPerPage The limit of comments per page.
   */
  getDocumentComments(documentId: string, stationId: string, pageNumber: number, commentsPerPage: number): void {
    this.isLoading = true;
    this.commentService.getDocumentComments(documentId, stationId, pageNumber, commentsPerPage)
      .pipe(first())
      .subscribe((commentsResponse) => {
        this.comments = commentsResponse;
        this.isLoading = false;
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error,
          true
        );
      });
  }

}
