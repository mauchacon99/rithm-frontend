import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnInit,
  Input,
} from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { CustomField, FrameType, QuestionFieldType } from 'src/models';

/**
 *
 */
@Component({
  selector: 'app-build-drawer[stationId]',
  templateUrl: './build-drawer.component.html',
  styleUrls: ['./build-drawer.component.scss'],
})
export class BuildDrawerComponent implements OnInit {
  /** The list of all the input frames in the grid. */
  @Input() inputFrameList: string[] = [];

  /** Event Emitter that executes toggle logic from station component. */
  @Output() toggleDrawer: EventEmitter<unknown> = new EventEmitter();

  /** Event Emitter Will add a new input frame in the station grid. */
  @Output() addInputFrame: EventEmitter<string> = new EventEmitter();

  /** The station id used to get previous fields. */
  @Input() stationId!: string;

  /** The field type of the input. */
  fieldTypeEnum = QuestionFieldType;

  /** Frame types list.  */
  frameTypes = FrameType;

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
      prompt: 'Short Text',
      icon: 'fa-solid fa-font',
      questionType: this.fieldTypeEnum.ShortText,
      dataTestId: 'add-short-text',
    },
    {
      prompt: 'Long Text',
      icon: 'fa-solid fa-paragraph',
      questionType: this.fieldTypeEnum.LongText,
      dataTestId: 'add-long-text',
    },
    {
      prompt: 'Email',
      icon: 'fa-solid fa-at',
      questionType: this.fieldTypeEnum.Email,
      dataTestId: 'add-email',
    },
    {
      prompt: 'URL',
      icon: 'fa-solid fa-link',
      questionType: this.fieldTypeEnum.URL,
      dataTestId: 'add-url',
    },
    {
      prompt: 'Address',
      icon: 'fa-regular fa-address-card',
      questionType: this.fieldTypeEnum.AddressLine,
      dataTestId: 'add-address',
    },
    {
      prompt: 'Date',
      icon: 'fa-solid fa-calendar-day',
      questionType: this.fieldTypeEnum.Date,
      dataTestId: 'add-date',
    },
    {
      prompt: 'Single Select',
      icon: 'fa-solid fa-chevron-circle-down',
      questionType: this.fieldTypeEnum.Select,
      dataTestId: 'add-single-select',
    },
    {
      prompt: 'Multiselect',
      icon: 'fa-solid fa-chevron-circle-down',
      questionType: this.fieldTypeEnum.MultiSelect,
      dataTestId: 'add-multiselect',
    },
    {
      prompt: 'Checklist',
      icon: 'fa-solid fa-list',
      questionType: this.fieldTypeEnum.CheckList,
      dataTestId: 'add-checklist',
    },
    {
      prompt: 'Checkbox',
      icon: 'fa-regular fa-square-check',
      questionType: this.fieldTypeEnum.Checkbox,
      dataTestId: 'add-checkbox',
    },
    {
      prompt: 'Number',
      icon: 'fa-solid fa-calculator',
      questionType: this.fieldTypeEnum.Number,
      dataTestId: 'add-number',
    },
    {
      prompt: 'Phone Number',
      icon: 'fa-solid fa-phone-flip',
      questionType: this.fieldTypeEnum.Phone,
      dataTestId: 'add-phone-number',
    },
    {
      prompt: 'Currency',
      icon: 'fa-solid fa-money-bill-wave',
      questionType: this.fieldTypeEnum.Currency,
      dataTestId: 'add-currency',
    },
    {
      prompt: 'Child Document',
      icon: 'fa-solid fa-file',
      questionType: this.fieldTypeEnum.ChildDocument,
      dataTestId: 'add-child-document',
    },
    {
      prompt: 'Custom Field',
      icon: 'fa-solid fa-wrench',
      questionType: this.fieldTypeEnum.CustomField,
      dataTestId: 'add-custom-field',
    },
  ];

  /** CustomComponents object with component data entry. */
  customComponents = [
    {
      prompt: 'Headline',
      icon: 'fa-heading fa-solid',
      dataTestId: 'component-headline',
      type: this.frameTypes.Headline,
    },
    {
      prompt: 'Title',
      icon: 'fa-heading fa-solid',
      dataTestId: 'component-title',
      type: this.frameTypes.Title,
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
   *
   * @param type Input frame type sended.
   */
  addNewInputFrame(type: string): void {
    this.addInputFrame.emit(type);
  }
}
