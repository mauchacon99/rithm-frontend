import { ParamMap } from '@angular/router';
import { EmailLinkType } from 'src/models';

/**
 * All behavior for and information present on a URL link to the sign in page from the user's email.
 */
export class EmailLinkParams {
  /** The context of the action to be performed on the sign in page. */
  type: EmailLinkType | null;

  /** The unique identifier used to validate this request (through the user's email.). */
  guid: string | null;

  /** The email address of the user. */
  email: string | null;

  constructor(params: ParamMap) {
    this.type = params.get('type') as EmailLinkType;
    this.guid = params.get('guid');
    this.email = params.get('email');
  }

  /**
   * Whether the current params are valid or not.
   *
   * @returns True if params are valid, false otherwise.
   */
  get valid(): boolean {
    return !!(this.type && this.guid && this.email);
  }
}
