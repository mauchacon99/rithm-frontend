import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { Comment } from 'src/models';
import { CommentService } from 'src/app/core/comment.service';

/**
 * Comment input component.
 */
@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.scss'],
})
export class CommentInputComponent {
  /** The form group directive to reset form state. */
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  /** The id of the station that the user is commenting on or that the document is in. */
  @Input() stationId!: string;

  /** The id of the document that the user is commenting on (only applicable for document comments). */
  @Input() documentId?: string;

  /** Whether a comment is currently being posted. */
  @Output() private postingComment = new EventEmitter<boolean>();

  /** The newly posted comment. */
  @Output() private newComment = new EventEmitter<Comment>();

  /** The form for adding a new comment. */
  commentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private errorService: ErrorService
  ) {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required]],
    });
  }

  /**
   * Add the comment.
   */
  addComment(): void {
    this.commentForm.disable();
    this.postingComment.emit(true);
    const newComment: Comment = {
      displayText: this.commentForm.controls['comment'].value,
      stationRithmId: this.stationId,
      documentRithmId: this.documentId,
    };

    this.commentService
      .postDocumentComment(newComment)
      .pipe(first())
      .subscribe({
        next: (comment) => {
          this.commentForm.enable();
          this.newComment.emit(comment);
          this.postingComment.emit(false);
          this.commentForm.get('comment')?.reset('');
          this.formDirective.resetForm();
        },
        error: (error: unknown) => {
          this.commentForm.enable();
          this.postingComment.emit(false);
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error,
            true
          );
        },
      });
  }
}
