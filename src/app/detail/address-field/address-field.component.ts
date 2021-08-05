import { Component, Input } from '@angular/core';
import { FieldType, Question } from 'src/models';

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
  fieldTypeEnum = FieldType;

  /** Set up the address form fields. */
  addressFields: Question[] = [
    {
      id: 1,
      prompt: 'Address line 1',
      instructions: '',
      type: FieldType.ShortText,
      isReadOnly: false,
      isRequired: true
    },
    {
      id: 2,
      prompt: 'Address line 2',
      instructions: '',
      type: FieldType.ShortText,
      isReadOnly: false,
      isRequired: false
    },
    {
      id: 3,
      prompt: 'City',
      instructions: '',
      type: FieldType.ShortText,
      isReadOnly: false,
      isRequired: true
    },
    {
      id: 4,
      prompt: 'State',
      instructions: '',
      type: FieldType.Select,
      isReadOnly: false,
      isRequired: true,
      options:
      [
        {
          displayText: 'Alabama',
          value: 'AL',
          isSelected: false,
        },
        {
          displayText: 'Alaska',
          value: 'AK',
          isSelected: false,
        },
        {
          displayText: 'American Samoa',
          value: 'AS',
          isSelected: false,
        },
        {
          displayText: 'Arizona',
          value: 'AZ',
          isSelected: false,
        },
        {
          displayText: 'Arkansas',
          value: 'AR',
          isSelected: false,
        },
        {
          displayText: 'California',
          value: 'CA',
          isSelected: false,
        },
        {
          displayText: 'Colorado',
          value: 'CO',
          isSelected: false,
        },
        {
          displayText: 'Connecticut',
          value: 'CT',
          isSelected: false,
        },
        {
          displayText: 'Delaware',
          value: 'DE',
          isSelected: false,
        },
        {
          displayText: 'District of Columbia',
          value: 'DC',
          isSelected: false,
        },
        {
          displayText: 'Federated States of Micronesia',
          value: 'FM',
          isSelected: false,
        },
        {
          displayText: 'Florida',
          value: 'FL',
          isSelected: false,
        },
        {
          displayText: 'Georgia',
          value: 'GA',
          isSelected: false,
        },
        {
          displayText: 'Guam',
          value: 'GU',
          isSelected: false,
        },
        {
          displayText: 'Hawaii',
          value: 'HI',
          isSelected: false,
        },
        {
          displayText: 'Idaho',
          value: 'ID',
          isSelected: false,
        },
        {
          displayText: 'Illinois',
          value: 'IL',
          isSelected: false,
        },
        {
          displayText: 'Indiana',
          value: 'IN',
          isSelected: false,
        },
        {
          displayText: 'Iowa',
          value: 'IA',
          isSelected: false,
        },
        {
          displayText: 'Kansas',
          value: 'KS',
          isSelected: false,
        },
        {
          displayText: 'Kentucky',
          value: 'KY',
          isSelected: false,
        },
        {
          displayText: 'Louisiana',
          value: 'LA',
          isSelected: false,
        },
        {
          displayText: 'Maine',
          value: 'ME',
          isSelected: false,
        },
        {
          displayText: 'Marshall Islands',
          value: 'MH',
          isSelected: false,
        },
        {
          displayText: 'Maryland',
          value: 'MD',
          isSelected: false,
        },
        {
          displayText: 'Massachusetts',
          value: 'MA',
          isSelected: false,
        },
        {
          displayText: 'Michigan',
          value: 'MI',
          isSelected: false,
        },
        {
          displayText: 'Minnesota',
          value: 'MN',
          isSelected: false,
        },
        {
          displayText: 'Mississippi',
          value: 'MS',
          isSelected: false,
        },
        {
          displayText: 'Missouri',
          value: 'MO',
          isSelected: false,
        },
        {
          displayText: 'Montana',
          value: 'MT',
          isSelected: false,
        },
        {
          displayText: 'Nebraska',
          value: 'NE',
          isSelected: false,
        },
        {
          displayText: 'Nevada',
          value: 'NV',
          isSelected: false,
        },
        {
          displayText: 'New Hampshire',
          value: 'NH',
          isSelected: false,
        },
        {
          displayText: 'New Jersey',
          value: 'NJ',
          isSelected: false,
        },
        {
          displayText: 'New Mexico',
          value: 'NM',
          isSelected: false,
        },
        {
          displayText: 'New York',
          value: 'NY',
          isSelected: false,
        },
        {
          displayText: 'North Carolina',
          value: 'NC',
          isSelected: false,
        },
        {
          displayText: 'North Dakota',
          value: 'ND',
          isSelected: false,
        },
        {
          displayText: 'Northern Mariana Islands',
          value: 'MP',
          isSelected: false,
        },
        {
          displayText: 'Ohio',
          value: 'OH',
          isSelected: false,
        },
        {
          displayText: 'Oklahoma',
          value: 'OK',
          isSelected: false,
        },
        {
          displayText: 'Oregon',
          value: 'OR',
          isSelected: false,
        },
        {
          displayText: 'Palau',
          value: 'PW',
          isSelected: false,
        },
        {
          displayText: 'Pennsylvania',
          value: 'PA',
          isSelected: false,
        },
        {
          displayText: 'Puerto Rico',
          value: 'PR',
          isSelected: false,
        },
        {
          displayText: 'Rhode Island',
          value: 'RI',
          isSelected: false,
        },
        {
          displayText: 'South Carolina',
          value: 'SC',
          isSelected: false,
        },
        {
          displayText: 'South Dakota',
          value: 'SD',
          isSelected: false,
        },
        {
          displayText: 'Tennessee',
          value: 'TN',
          isSelected: false,
        },
        {
          displayText: 'Texas',
          value: 'TX',
          isSelected: false,
        },
        {
          displayText: 'Utah',
          value: 'UT',
          isSelected: false,
        },
        {
          displayText: 'Vermont',
          value: 'VT',
          isSelected: false,
        },
        {
          displayText: 'Virgin Island',
          value: 'VI',
          isSelected: false,
        },
        {
          displayText: 'Virginia',
          value: 'VA',
          isSelected: false,
        },
        {
          displayText: 'Washington',
          value: 'WA',
          isSelected: false,
        },
        {
          displayText: 'West Virginia',
          value: 'WV',
          isSelected: false,
        },
        {
          displayText: 'Wisconsin',
          value: 'WI',
          isSelected: false,
        },
        {
          displayText: 'Wyoming',
          value: 'WY',
          isSelected: false,
        },
      ]
    },
    {
      id: 5,
      prompt: 'Postal code',
      instructions: '',
      type: FieldType.Address,
      isReadOnly: false,
      isRequired: true
    },
  ];

}
