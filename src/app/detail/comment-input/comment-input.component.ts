import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
/**
 * Comment input component.
 */
@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.scss']
})
export class CommentInputComponent {
  /** The comment form. */
  @Input() commentForm!: FormGroup;

  /**
   * Add the comment.
   */
  addComment(): void {
    // TODO: RIT-645, Add comment
  }
}
