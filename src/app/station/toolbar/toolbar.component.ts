import { Component, EventEmitter, Output } from '@angular/core';
import { QuestionFieldType } from 'src/models';

/**
 * Toolbar component.
 */
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
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
      typeString: this.fieldTypeEnum.ShortText
    },
    {
      name: 'Long Text',
      icon: 'fas fa-paragraph',
      typeString: this.fieldTypeEnum.LongTextLabel
    },
    {
      name: 'URL',
      icon: 'fas fa-link',
      typeString: this.fieldTypeEnum.URL
    },
    {
      name: 'Email',
      icon: 'fas fa-envelope',
      typeString: this.fieldTypeEnum.Email
    },
    //TODO: figure out how to correctly format the nested field upon creation.
    {
      name: 'Address',
      icon: 'far fa-address-card',
      typeString: this.fieldTypeEnum.AddressLine
    },
    {
      name: 'Number',
      icon: 'fas fa-calculator',
      typeString: this.fieldTypeEnum.Number
    },
    {
      name: 'Phone Number',
      icon: 'fas fa-phone',
      typeString: this.fieldTypeEnum.Phone
    },
    {
      name: 'Currency',
      icon: 'fas fa-money-bill-wave',
      typeString: this.fieldTypeEnum.Currency
    },
    {
      name: 'Date',
      icon: 'fas fa-calendar-day',
      typeString: this.fieldTypeEnum.Date
    },
    {
      name: 'Checklist',
      icon: 'fas fa-list',
      typeString: this.fieldTypeEnum.CheckList
    },
    {
      name: 'Single Select',
      icon: 'fas fa-chevron-circle-down',
      typeString: this.fieldTypeEnum.Select
    },
    {
      name: 'Multi Select',
      icon: 'fas fa-chevron-circle-down',
      typeString: this.fieldTypeEnum.MultiSelect
    },
    {
      name: 'Instructions',
      icon: 'fas fa-sticky-note',
      typeString: this.fieldTypeEnum.Instructions
    }
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
