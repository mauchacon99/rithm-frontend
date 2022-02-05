/**
 * Represents all information about a notification.
 */
export interface Notification {
  /** The global Rithm ID for this notification. */
  rithmId: string;

  /** The notification title. */
  title: string;

  /** The type of notification. */
  type: string;

  /** Has the notification been read. */
  read: boolean;

  /** The time the notification was sent. */
  time: string;

  /** The initials of the user that mentioned another user. */
  initials: string;

  /** The photo of the mentioning user. */
  photo?: string;

  /** The message of the notification. Used for toasts. */
  message?: string;
}
