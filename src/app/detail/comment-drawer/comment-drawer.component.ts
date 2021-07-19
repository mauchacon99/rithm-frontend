import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommentService } from '../comment.service';
import { first } from 'rxjs/operators';
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
export class CommentDrawerComponent implements OnInit {

  /** Is the content being loaded. */
  isLoading = true;

  /** Are more comments being loaded. */
  loadingMoreComments = false;

  /** Current page to get comments from. */
  commentPage = 0;

  /** Is the posted comment loading? */
  loadingPostedComment = false;

  /** The posted comment data. */
  postedComment?: Comment;

  /** List of comments for a document. */
  comments: Comment[] = [];

  constructor(
    private commentService: CommentService,
    private errorService: ErrorService
  ) { }

  /**
   * Display initial group of comments.
   */
  ngOnInit(): void {
    // getDocumentComments()
    setTimeout(() => this.isLoading = false, 500);
  }

  /**
   * Gets the initial list of comments to load.
   *
   * @param documentId The documentId of document for which comments needs to be fetched.
   * @param stationId Id of station for which comments needs to be fetched.
   * @param pageNumber The desired page number of results, use this.commentPage.
   * @param commentsPerPage The limit of comments per page.
   * @param initialGet Is this an initial get of comments?
   */
  // eslint-disable-next-line max-len
  getDocumentComments(documentId: string, stationId: string, pageNumber: number, commentsPerPage: number, initialGet: boolean): void {
    initialGet ? this.isLoading = true : this.loadingMoreComments = true;
    this.commentService.getDocumentComments(documentId, stationId, pageNumber, commentsPerPage)
      .pipe(first())
      .subscribe((commentsResponse) => {
        this.comments = commentsResponse;
        ++this.commentPage;
        initialGet ? this.isLoading = false : this.loadingMoreComments = false;
      }, (error: HttpErrorResponse) => {
        initialGet ? this.isLoading = false : this.loadingMoreComments = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }

  /**
   * Post a new comment.
   *
   * @param comment A Comment interface.
   * Comment needs parameters: displayText, DateCreated, UserRithmId, documentRithmId, and stationRithmId.
   */
  postComment(
    comment: Comment
  ): void {
    this.loadingPostedComment = true;
    this.commentService.postDocumentComment(comment)
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
