import { Component, Input, OnInit } from '@angular/core';
import { UtcTimeConversion } from 'src/helpers';
import { User, Comment } from 'src/models';

/**
 * Component for an individual comment.
 */
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  providers: [UtcTimeConversion]
})
export class CommentComponent {
  /** The Data needed to construct the comment. */
  @Input() commentData!: Comment;

  /** User commenting. */
  user!: User | undefined;

  /** Full name. */
  name!: string;

  /** Comment message. */
  message!: string;

  /** Timecode. */
  dateCreated!: string;

  /** Has the comment been read before? */
  read = false;

  constructor(
    private utcTimeConversion: UtcTimeConversion
  ) {}

  /**
   * Convert a UTC Timecode into date and time.
   *
   * @param timeCommented Reflects time a comment was made.
   * @returns A string with date and time.
   */
   convertTimecode(timeCommented: string): string {
    return this.utcTimeConversion.getDateAndTime(timeCommented);
   }
}
