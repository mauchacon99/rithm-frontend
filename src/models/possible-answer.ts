/**
 * Represents info about a possible answer for a select dropdown or checklist.
 */
export interface PossibleAnswer {

  /** The rithm id for possible answers. */
  rithmId: string;

  /** The order in which the possible answer displays in the list. */
  // order: number; TODO: re-add this if order is determined by this property

  /** The text to display for the possible answer. */
  text: string;

  /** Whether this answer is the default choice if left empty. */
  default: boolean;

}
