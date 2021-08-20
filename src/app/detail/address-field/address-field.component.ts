import { Component, Input } from '@angular/core';
import { Question, QuestionFieldType } from 'src/models';

/**
 * Reusable component for every address field.
 */
@Component({
  selector: 'app-address-field',
  templateUrl: './address-field.component.html',
  styleUrls: ['./address-field.component.scss']
})
export class AddressFieldComponent {

  /** The document field to display. */
  @Input() field!: Question;

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

  /** Set up the address form fields. */
  addressFields: Question[] = [
    {
      prompt: 'Address line 1',
      instructions: '',
      questionType: {
        rithmId: '',
        typeString: QuestionFieldType.ShortText,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: true,
      isPrivate: false
    },
    {
      prompt: 'Address line 2',
      instructions: '',
      questionType: {
        rithmId: '',
        typeString: QuestionFieldType.ShortText,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: false,
      isPrivate: false
    },
    {
      prompt: 'City',
      instructions: '',
      questionType: {
        rithmId: '',
        typeString: QuestionFieldType.ShortText,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: true,
      isPrivate: false
    },
    {
      prompt: 'State',
      instructions: '',
      questionType: {
        rithmId: '',
        typeString: QuestionFieldType.Select,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      possibleAnswers:
      [
        {
          text: 'Alabama',
          default: false,
        },
        {
          text: 'Alaska',
          default: false,
        },
        {
          text: 'American Samoa',
          default: false,
        },
        {
          text: 'Arizona',
          default: false,
        },
        {
          text: 'Arkansas',
          default: false,
        },
        {
          text: 'California',
          default: false,
        },
        {
          text: 'Colorado',
          default: false,
        },
        {
          text: 'Connecticut',
          default: false,
        },
        {
          text: 'Delaware',
          default: false,
        },
        {
          text: 'District of Columbia',
          default: false,
        },
        {
          text: 'Federated States of Micronesia',
          default: false,
        },
        {
          text: 'Florida',
          default: false,
        },
        {
          text: 'Georgia',
          default: false,
        },
        {
          text: 'Guam',
          default: false,
        },
        {
          text: 'Hawaii',
          default: false,
        },
        {
          text: 'Idaho',
          default: false,
        },
        {
          text: 'Illinois',
          default: false,
        },
        {
          text: 'Indiana',
          default: false,
        },
        {
          text: 'Iowa',
          default: false,
        },
        {
          text: 'Kansas',
          default: false,
        },
        {
          text: 'Kentucky',
          default: false,
        },
        {
          text: 'Louisiana',
          default: false,
        },
        {
          text: 'Maine',
          default: false,
        },
        {
          text: 'Marshall Islands',
          default: false,
        },
        {
          text: 'Maryland',
          default: false,
        },
        {
          text: 'Massachusetts',
          default: false,
        },
        {
          text: 'Michigan',
          default: false,
        },
        {
          text: 'Minnesota',
          default: false,
        },
        {
          text: 'Mississippi',
          default: false,
        },
        {
          text: 'Missouri',
          default: false,
        },
        {
          text: 'Montana',
          default: false,
        },
        {
          text: 'Nebraska',
          default: false,
        },
        {
          text: 'Nevada',
          default: false,
        },
        {
          text: 'New Hampshire',
          default: false,
        },
        {
          text: 'New Jersey',
          default: false,
        },
        {
          text: 'New Mexico',
          default: false,
        },
        {
          text: 'New York',
          default: false,
        },
        {
          text: 'North Carolina',
          default: false,
        },
        {
          text: 'North Dakota',
          default: false,
        },
        {
          text: 'Northern Mariana Islands',
          default: false,
        },
        {
          text: 'Ohio',
          default: false,
        },
        {
          text: 'Oklahoma',
          default: false,
        },
        {
          text: 'Oregon',
          default: false,
        },
        {
          text: 'Palau',
          default: false,
        },
        {
          text: 'Pennsylvania',
          default: false,
        },
        {
          text: 'Puerto Rico',
          default: false,
        },
        {
          text: 'Rhode Island',
          default: false,
        },
        {
          text: 'South Carolina',
          default: false,
        },
        {
          text: 'South Dakota',
          default: false,
        },
        {
          text: 'Tennessee',
          default: false,
        },
        {
          text: 'Texas',
          default: false,
        },
        {
          text: 'Utah',
          default: false,
        },
        {
          text: 'Vermont',
          default: false,
        },
        {
          text: 'Virgin Island',
          default: false,
        },
        {
          text: 'Virginia',
          default: false,
        },
        {
          text: 'Washington',
          default: false,
        },
        {
          text: 'West Virginia',
          default: false,
        },
        {
          text: 'Wisconsin',
          default: false,
        },
        {
          text: 'Wyoming',
          default: false,
        },
      ]
    },
    {
      prompt: 'Postal code',
      instructions: '',
      questionType: {
        rithmId: '',
        typeString: QuestionFieldType.Address,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: true,
      isPrivate: false
    },
  ];

}
