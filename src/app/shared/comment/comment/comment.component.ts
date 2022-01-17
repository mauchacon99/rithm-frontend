import { Component, Input } from '@angular/core';
import { UtcTimeConversion } from 'src/helpers';
import { Comment } from 'src/models';

/**
 * Component for an individual comment.
 */
@Component({
  selector: 'app-comment[comment]',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  providers: [UtcTimeConversion],
})
export class CommentComponent {
  /** The Data needed to construct the comment. */
  @Input() comment!: Comment;

  /** Has the comment been read before? */
  read = false;

  constructor(private utcTimeConversion: UtcTimeConversion) {}

  /**
   * Convert a UTC Timecode into date and time.
   *
   * @param timeCommented Reflects time a comment was made.
   * @returns A string with date and time.
   */
  convertTimecode(timeCommented?: string): string {
    if (timeCommented) {
      return this.utcTimeConversion.getDateAndTime(timeCommented);
    }
    return 'Unknown';
  }
}
