import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required]]
    });
  }

  /**
   * Add the comment.
   */
  addComment(): void {
    // TODO: RIT-645, Add comment
  }
}
