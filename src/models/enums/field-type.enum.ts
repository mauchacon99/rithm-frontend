/**
 * Represents the type of a field.
 */
export enum FieldType {
  /** Short text field. */
  SHORT_TEXT = 'string',
  /** Text area. */
  LONG_TEXT = 'textarea',
  /** URL input type. */
  URL = 'url',
  /** Email input type. */
  EMAIL = 'email',
  /** Address input type. */
  ADDRESS = 'address',
  /** Number input type. */
  NUMBER = 'integer',
  /** Phone number input type. */
  PHONE = 'phone',
  /** Currency input type. */
  CURRENCY = 'currency',
  /** Select input type. */
  SELECT = 'select',
  /** Multi select input type. */
  MULTI_SELECT = 'multi-select',
  /** Date input type. */
  DATE = 'date',
  /** Date time input type. */
  DATETIME = 'datetime',
  /** Checkbox input type. */
  CHECKBOX = 'checkbox',
  /** Checklist input type. */
  CHECKLIST = 'checklist'
}
