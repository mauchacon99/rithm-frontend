/**
 * Represents the type of a field.
 */
export enum FieldType {

  /** Short text field. */
  ShortText = 'shortText',

  /** Text area. */
  LongText = 'longText',

  /** URL input type. */
  URL = 'url',

  /** Email input type. */
  Email = 'email',

  /** Address input type. */
  Address = 'address',

  /** Number input type. */
  Number = 'number',

  /** Phone number input type. */
  Phone = 'phoneNumber',

  /** Currency input type. */
  Currency = 'currency',

  /** Select input type. */
  Select = 'singleDropdown',

  /** Multi select input type. */
  MultiSelect = 'multiDropdown',

  /** Date input type. */
  Date = 'date',

  /** Date time input type. */
  DateTime = 'datetime',

  /** Checkbox input type. */
  CheckBox = 'singleCheckbox',

  /** Checklist input type. */
  CheckList = 'multiCheckbox'

}
