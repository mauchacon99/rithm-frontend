import { Component } from '@angular/core';
import { UtcTimeConversion } from 'src/helpers';
import { User } from 'src/models';

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
  /** User commenting. */
  user: User = {
    rithmId: '123',
    firstName: 'Testy',
    lastName: 'Test',
    email: 'test@test.com',
    objectPermissions: [],
    groups: [],
    createdDate: '1/2/34'
  };

  /** Full name. */
  name = this.user.firstName + ' ' + this.user.lastName;

  /** Comment message. */
  message = 'Here is a test message that is a test and a message.';

  /** Timecode. */
  UTCtimecode = '2021-07-12T19:06:47.3506612Z';

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
