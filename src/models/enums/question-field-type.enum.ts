/**
 * Represents all the various types of a question/field.
 */
export enum QuestionFieldType {

  /** Short text field. */
  ShortText = 'shortText',

  /** Text area. */
  LongText = 'longText',

  /** URL input type. */
  URL = 'url',

  /** Email input type. */
  Email = 'email',

  /** Address Line input type. */
  AddressLine = 'addressLine',

  /** City input type. */
  City = 'city',

  /** Generic Nested type. */
  Nested = 'nested',

  /** Number input type. */
  Number = 'number',

  /** Phone number input type. */
  Phone = 'phoneNumber',

  /** Currency input type. */
  Currency = 'currency',

  /** Payment input type. */
  CreditCard = 'creditcard',

  /** Zip code input type. */
  Zip = 'zip',

  /** Select input type. */
  Select = 'singleDropdown',

  /** Multi select input type. */
  MultiSelect = 'multiDropdown',

  /** State input type. */
  State = 'state',

  /** Date input type. */
  Date = 'date',

  /** Date time input type. */
  DateTime = 'datetime',

  /** Checklist input type. */
  CheckList = 'checklist',

  /** Text area label for station edit mode. */
  LongTextLabel = 'LongTextLabel',

  /** Instruction input type. */
  Instructions = 'instructions',

}
