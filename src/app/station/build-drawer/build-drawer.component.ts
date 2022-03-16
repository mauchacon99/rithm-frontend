import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { QuestionFieldType } from 'src/models';
/**
 *
 */
@Component({
  selector: 'app-build-drawer',
  templateUrl: './build-drawer.component.html',
  styleUrls: ['./build-drawer.component.scss'],
})
export class BuildDrawerComponent implements OnInit {
  buildCategories: string[] = [
    'Form Inputs',
    'Previous Fields',
    'Components',
    'Integrations',
  ];

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

  formInputsCategory = [
    {
      name: 'Input Frame',
      icon: 'fa-regular fa-object-group',
      typeString: this.fieldTypeEnum.InputFrame,
      dataTestId: 'add-input-frame',
    },
    {
      name: 'Short Text',
      icon: 'fa-solid fa-font',
      typeString: this.fieldTypeEnum.ShortText,
      dataTestId: 'add-short-text',
    },
    {
      name: 'Long Text',
      icon: 'fa-solid fa-paragraph',
      typeString: this.fieldTypeEnum.LongText,
      dataTestId: 'add-long-text',
    },
    {
      name: 'Email',
      icon: 'fa-solid fa-at',
      typeString: this.fieldTypeEnum.Email,
      dataTestId: 'add-email',
    },
    {
      name: 'URL',
      icon: 'fa-solid fa-link',
      typeString: this.fieldTypeEnum.URL,
      dataTestId: 'add-url',
    },
    {
      name: 'Address',
      icon: 'fa-regular fa-address-card',
      typeString: this.fieldTypeEnum.AddressLine,
      dataTestId: 'add-address',
    },
    {
      name: 'Date',
      icon: 'fa-solid fa-calendar-day',
      typeString: this.fieldTypeEnum.Date,
      dataTestId: 'add-date',
    },
    {
      name: 'Single Select',
      icon: 'fa-solid fa-chevron-circle-down',
      typeString: this.fieldTypeEnum.Select,
      dataTestId: 'add-single-select',
    },
    {
      name: 'Multiselect',
      icon: 'fa-solid fa-chevron-circle-down',
      typeString: this.fieldTypeEnum.MultiSelect,
      dataTestId: 'add-multiselect',
    },
    {
      name: 'Checklist',
      icon: 'fa-solid fa-list',
      typeString: this.fieldTypeEnum.CheckList,
      dataTestId: 'add-checklist',
    },
    {
      name: 'Checkbox',
      icon: 'fa-regular fa-square-check',
      typeString: this.fieldTypeEnum.Checkbox,
      dataTestId: 'add-checkbox',
    },
    {
      name: 'Number',
      icon: 'fa-solid fa-calculator',
      typeString: this.fieldTypeEnum.Number,
      dataTestId: 'add-number',
    },
    {
      name: 'Phone Number',
      icon: 'fa-solid fa-phone-flip',
      typeString: this.fieldTypeEnum.Phone,
      dataTestId: 'add-phone-number',
    },
    {
      name: 'Currency',
      icon: 'fa-solid fa-money-bill-wave',
      typeString: this.fieldTypeEnum.Currency,
      dataTestId: 'add-currency',
    },
    {
      name: 'Child Document',
      icon: 'fa-solid fa-file',
      typeString: this.fieldTypeEnum.ChildDocument,
      dataTestId: 'add-child-document',
    },
    {
      name: 'Custom Field',
      icon: 'fa-solid fa-wrench',
      typeString: this.fieldTypeEnum.CustomField,
      dataTestId: 'add-custom-field',
    },
  ];

  categorySelected = 'Form Inputs';

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private changeDetector: ChangeDetectorRef) {}

  /**
   * Init Component to detect changes.
   */
  ngOnInit(): void {
    this.changeDetector.detectChanges();
  }

  /**
   * Functions to control changes on selection list.
   *
   * @param selectionData Data send by mat-selection-list EventEmitter.
   */
  handleSelectionChange(selectionData: MatSelectionListChange): void {
    this.categorySelected = selectionData.options[0].value;
  }
}
