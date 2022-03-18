import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnInit,
  Input,
} from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { CustomField, QuestionFieldType } from 'src/models';

/**
 *
 */
@Component({
  selector: 'app-build-drawer[stationId]',
  templateUrl: './build-drawer.component.html',
  styleUrls: ['./build-drawer.component.scss'],
})
export class BuildDrawerComponent implements OnInit {
  /** The station id used to get previous fields. */
  @Input() stationId!: string;

  /**
   * Event Emitter that executes toggle logic from station component.
   */
  @Output() toggleDrawer: EventEmitter<unknown> = new EventEmitter();

  /**
   * Event Emitter Will add a new input frame in the station grid.
   */
  @Output() addInputFrame: EventEmitter<void> = new EventEmitter();

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

  /** The current category selected. */
  categorySelected = 'Form Inputs';

  /** List of categories to selection.  */
  buildCategories: string[] = [
    'Form Inputs',
    'Previous Fields',
    'Components',
    'Integrations',
  ];

  /** Custom fields to form input category data. */
  customFields: CustomField[] = [
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
  handleCategoryChange(selectionData: MatSelectionListChange): void {
    this.categorySelected = selectionData.options[0].value;
  }

  /**
   * Function to handle Close Drawer button.
   */
  handleCloseDrawer(): void {
    this.toggleDrawer.emit();
  }

  /**
   * Will add a new input frame in the station grid.
   */
  addNewInputFrame(): void {
    this.addInputFrame.emit();
  }
}
