import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { Comment } from 'src/models';
import { CommentService } from '../comment.service';


/**
 * Component for containing all comments in the side drawer for a station or document.
 */
@Component({
  selector: 'app-comment-drawer',
  templateUrl: './comment-drawer.component.html',
  styleUrls: ['./comment-drawer.component.scss']
})
export class CommentDrawerComponent {
  /** Is the posted comment loading? */
  loadingPostedComment = false;

  /** The posted comment data. */
  postedComment?: Comment;

  constructor(
    private commentService: CommentService,
    private errorService: ErrorService
  ) {}


  /**
   * Post a new comment.
   *
   * @param displayText Text of comment.
   * @param dateCreated Date comment was posted.
   * @param userRithmId User commenting.
   * @param documentRithmId Document posted to.
   * @param stationRithmId Station document is housed in.
   */
  postComment(
      displayText: string,
      dateCreated: string,
      userRithmId: string,
      documentRithmId: string,
      stationRithmId: string
  ): void {
    this.loadingPostedComment = true;
    this.commentService.postDocumentComment(displayText, dateCreated, userRithmId, documentRithmId, stationRithmId)
    .pipe(first())
    .subscribe((comment) => {
      if (comment) {
        this.postedComment = comment;
      }
      this.loadingPostedComment = false;
      }, (error: HttpErrorResponse) => {
      this.loadingPostedComment = false;
      this.errorService.displayError(
        'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
        error,
        true
      );
    });
  }
}
