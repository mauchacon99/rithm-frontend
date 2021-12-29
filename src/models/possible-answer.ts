/**
 * Represents info about a possible answer for a select dropdown or checklist.
 */
export interface PossibleAnswer {

  /** The order in which the possible answer displays in the list. */
  // order: number; TODO: re-add this if order is determined by this property

  /** The text to display for the possible answer. */
  text: string;

  /** Whether this answer is the default choice if left empty. */
  default: boolean;

  /** ID to determine the answer to update. */
  answerId?: string | null;

}
