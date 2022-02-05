import { Component, EventEmitter, Output } from '@angular/core';
import { QuestionFieldType } from 'src/models';

/**
 * Toolbar component.
 */
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  /** Send tool.typeString to parent. */
  @Output() fieldSelected = new EventEmitter<QuestionFieldType>();

  /** Is the inline toolbar open? */
  isInlineToolbarOpen = false;

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

  /** Tools in the toolbar. */
  tools = [
    {
      name: 'Short Text',
      icon: 'fas fa-font',
      typeString: this.fieldTypeEnum.ShortText,
      dataTestId: 'add-short-text',
    },
    {
      name: 'Long Text',
      icon: 'fas fa-paragraph',
      typeString: this.fieldTypeEnum.LongText,
      dataTestId: 'add-long-text',
    },
    {
      name: 'URL',
      icon: 'fas fa-link',
      typeString: this.fieldTypeEnum.URL,
      dataTestId: 'add-url',
    },
    {
      name: 'Email',
      icon: 'fas fa-envelope',
      typeString: this.fieldTypeEnum.Email,
      dataTestId: 'add-email',
    },
    //TODO: figure out how to correctly format the nested field upon creation.
    {
      name: 'Address',
      icon: 'far fa-address-card',
      typeString: this.fieldTypeEnum.AddressLine,
      dataTestId: 'add-address',
    },
    {
      name: 'Number',
      icon: 'fas fa-calculator',
      typeString: this.fieldTypeEnum.Number,
      dataTestId: 'add-number',
    },
    {
      name: 'Phone Number',
      icon: 'fas fa-phone',
      typeString: this.fieldTypeEnum.Phone,
      dataTestId: 'add-phone-number',
    },
    {
      name: 'Currency',
      icon: 'fas fa-money-bill-wave',
      typeString: this.fieldTypeEnum.Currency,
      dataTestId: 'add-currency',
    },
    {
      name: 'Date',
      icon: 'fas fa-calendar-day',
      typeString: this.fieldTypeEnum.Date,
      dataTestId: 'add-date',
    },
    {
      name: 'Checklist',
      icon: 'fas fa-list',
      typeString: this.fieldTypeEnum.CheckList,
      dataTestId: 'add-checklist',
    },
    {
      name: 'Single Select',
      icon: 'fas fa-chevron-circle-down',
      typeString: this.fieldTypeEnum.Select,
      dataTestId: 'add-select',
    },
    {
      name: 'Multi Select',
      icon: 'fas fa-chevron-circle-down',
      typeString: this.fieldTypeEnum.MultiSelect,
      dataTestId: 'add-multi-select',
    },
    {
      name: 'Instructions',
      icon: 'fas fa-sticky-note',
      typeString: this.fieldTypeEnum.Instructions,
      dataTestId: 'add-instructions',
    },
  ];

  /**
   * Add a given fieldtype to parent.
   *
   * @param field The selected field.
   */
  selectField(field: QuestionFieldType): void {
    this.fieldSelected.emit(field);
  }

  /**
   * Toggle the inline toolbar.
   */
  toggleInlineToolbar(): void {
    this.isInlineToolbarOpen = !this.isInlineToolbarOpen;
  }

  /**
   * Check if toolbar is open before closing it.
   */
  clickedOutside(): void {
    if (this.isInlineToolbarOpen) {
      this.isInlineToolbarOpen = false;
    }
  }
}
