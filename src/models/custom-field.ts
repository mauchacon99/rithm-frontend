import { QuestionFieldType } from './enums';

/**
 * Represents a custom field on station.
 */
export interface CustomField {
  /** Name to display on field. */
  name: string;

  /** Icon to visual support on field. */
  icon: string;

  /** Type of question field represent. */
  typeString: QuestionFieldType;

  /** Id provided for testing proposes. */
  dataTestId: string;
}
