import { Component, Input } from '@angular/core';
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
  /** The id of the station that the user is commenting on or that the document is in. */
  @Input() stationId!: string;

  /** The id of the document that the user is commenting on (only applicable for document comments). */
  @Input() documentId?: string;

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
      displayText: this.commentForm.controls['comment'].value,
      stationRithmId: this.stationId,
      documentRithmId: this.documentId
    };

    this.commentService.postDocumentComment(newComment)
      .pipe(first())
      .subscribe((comment) => {
        if (comment) {
        }
      }, (error) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error,
          true
        );
      });
  }
}
