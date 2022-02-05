/**
 * Represents a single option to be selected for a question.
 */
export interface QuestionOption {
  /** Separate text to display (if different than value). */
  displayText?: string;

  /** The value of the option. */
  value: string;

  /** Whether the option is selected. */
  isSelected: boolean;
}
