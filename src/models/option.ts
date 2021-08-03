/**
 * Represents a single option.
 */
export interface Option {
  /** If display text is separate from returned value. */
  displayText?: string;
  /** The value of the option. */
  value: string;
  /** Is the option selected? */
  isSelected: boolean;
}
