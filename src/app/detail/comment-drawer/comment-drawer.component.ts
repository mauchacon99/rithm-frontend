import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommentService } from '../comment.service';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { Comment, DocumentStationInformation } from 'src/models';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';

/** Variable that sets number of comments retrieved on a get request. */
const COMMENTS_PER_PAGE = 20;

/**
 * Component for containing all comments in the side drawer for a station or document.
 */
@Component({
  selector: 'app-comment-drawer',
  templateUrl: './comment-drawer.component.html',
  styleUrls: ['./comment-drawer.component.scss']
})
export class CommentDrawerComponent implements OnInit {
  /** Station this drawer is attached to. */
  stationId = '';

  /** Document this drawer is attached to. */
  documentId = '';

  /** Is the content being loaded. */
  isLoading = true;

  /** Are more comments being loaded. */
  loadingMoreComments = false;

  /** No more comments to load. */
  commentsEnd = false;

  /** Current page to get comments from. */
  commentPage = 1;

  /** Is the posted comment loading? */
  loadingPostedComment = false;

  /** The posted comment data. */
  postedComment?: Comment;

  /** List of comments for a document. */
  comments: Comment[] = [];

  constructor(
    private commentService: CommentService,
    private errorService: ErrorService,
    private sidenavDrawerService: SidenavDrawerService
  ) { }

  /**
   * Display initial group of comments.
   */
  ngOnInit(): void {
    this.sidenavDrawerService.drawerData$
      .pipe(first())
      .subscribe((drawerData) => {
        const info = drawerData as DocumentStationInformation;
        if (info) {
          this.stationId = info.stationId;
          this.documentId = info.documentRithmId;
          this.getDocumentComments(true);
        }
      }, (error: HttpErrorResponse) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }

  /**
   * A function that loads the next page of comments.
   */
  loadMore(): void {
    this.getDocumentComments(false);
  }

  /**
   * Gets the initial list of comments to load.
   *
   * @param initialGet Is this an initial get of comments?
   */
  private getDocumentComments(initialGet: boolean): void {
    /**
     * Reuseable ternary statement for setting loading variables.
     *
     * @param loading Set the variables to true or false.
     */
    const setLoading = (loading: boolean) => {
      initialGet ? this.isLoading = loading : this.loadingMoreComments = loading;
    };

    setLoading(true);
    this.commentService.getDocumentComments(this.documentId, this.stationId, this.commentPage, COMMENTS_PER_PAGE)
      .pipe(first())
      .subscribe((commentsResponse) => {
        this.comments = this.comments.concat(commentsResponse);
        if (commentsResponse.length === COMMENTS_PER_PAGE) {
          ++this.commentPage;
        } else {
          this.commentsEnd = true;
        }
        setLoading(false);
      }, (error: HttpErrorResponse) => {
        setLoading(false);
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }
}
