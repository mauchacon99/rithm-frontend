/**
 * Represents all information about a document field name.
 */
export interface DocumentNameField {
  /** The rithm ID for the associated question. */
  questionRithmId?: string | null;

  /** The name/label of the document field name. */
  prompt: string;
}
