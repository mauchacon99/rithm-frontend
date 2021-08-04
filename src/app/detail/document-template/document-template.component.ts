import { Component, forwardRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UserFormComponent } from 'src/app/shared/user-form/user-form.component';
import { Question } from 'src/models';

/**
 * Component for the document template area of a station/document.
 */
@Component({
  selector: 'app-document-template[documentFields][generalInstructions]',
  templateUrl: './document-template.component.html',
  styleUrls: ['./document-template.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DocumentTemplateComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DocumentTemplateComponent),
      multi: true
    }
  ]
})
export class DocumentTemplateComponent {
  /** The form to add to document. */
  documentTemplateForm!: FormGroup;

  /** The general instructions to be displayed, if any. */
  @Input() generalInstructions!: string;

  /** The document fields in the template area for the station/document. */
  @Input() documentFields!: Question[];

  constructor(
    private fb: FormBuilder,
  ) {
    this.documentTemplateForm = this.fb.group({
      documentFieldForm: this.fb.control('')
    });
  }

}
