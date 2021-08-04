import { Component, forwardRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldType, Question } from 'src/models';

/**
 * Reusable component for every field on a document.
 */
@Component({
  selector: 'app-document-field[field]',
  templateUrl: './document-field.component.html',
  styleUrls: ['./document-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DocumentFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DocumentFieldComponent),
      multi: true
    }
  ]
})
export class DocumentFieldComponent {
  /** The form to add to the template.*/
  documentFieldForm!: FormGroup;

  /** The document field to display. */
  @Input() field!: Question;

  /** The field type. */
  fieldTypes = FieldType;

  constructor(
    private fb: FormBuilder,
  ) {
    this.documentFieldForm = this.fb.group({
      textField: this.fb.control('')
    });
  }


}
