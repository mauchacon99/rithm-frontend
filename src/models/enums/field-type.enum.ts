/**
 * Represents the type of a field.
 */
export enum FieldType {

  /** Short text field. */
  ShortText = 'string',

  /** Text area. */
  LongText = 'textarea',

  /** URL input type. */
  URL = 'url',

  /** Email input type. */
  Email = 'email',

  /** Address input type. */
  Address = 'address',

  /** Number input type. */
  Number = 'integer',

  /** Phone number input type. */
  Phone = 'phone',

  /** Currency input type. */
  Currency = 'currency',

  /** Select input type. */
  Select = 'select',

  /** Multi select input type. */
  MultiSelect = 'multi-select',

  /** Date input type. */
  Date = 'date',

  /** Date time input type. */
  DateTime = 'datetime',

  /** Checkbox input type. */
  CheckBox = 'checkbox',

  /** Checklist input type. */
  CheckList = 'checklist'

}
