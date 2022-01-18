import { User } from './user';

/**
 * Interface for document events.
 */
export interface DocumentEvent {
  /** Date of event the document. */
  date: string;

  /** Description for event the document. */
  description: string;

  /** User associate with the event. */
  user?: User;
}
