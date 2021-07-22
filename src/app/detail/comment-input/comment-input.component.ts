import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { Comment } from 'src/models';
import { CommentService } from '../comment.service';

/**
 * Comment input component.
 */
@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.scss']
})
export class CommentInputComponent {
  /** The form for adding a new comment. */
  commentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private errorService: ErrorService
  ) {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required]]
    });
  }

  /**
   * Add the comment.
   */
  addComment(): void {
    const newComment: Comment = {
      displayText: '',
      stationRithmId: '',
      documentRithmId: ''
    };
    // this.loadingPostedComment = true;
    this.commentService.postDocumentComment(newComment)
      .pipe(first())
      .subscribe((comment) => {
        if (comment) {
          // this.postedCommen = comment;
        }
        // this.loadingPostedComment = false;
      }, (error) => {
        // this.loadingPostedComment = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error,
          true
        );
      });
  }
}
