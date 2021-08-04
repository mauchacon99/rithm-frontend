import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { UserFormComponent } from 'src/app/shared/user-form/user-form.component';
import { FieldType, Question } from 'src/models';

/**
 * Reusable component for all fields involving text.
 */
@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UserFormComponent),
      multi: true
    }
  ]
})
export class TextFieldComponent implements OnInit {
  /** The form to add this field in the template. */
  textField!: FormGroup;

  /** The document field to display. */
  @Input() field!: Question;

  /** The field type of the input. */
  fieldTypeEnum = FieldType;

  constructor(
    private fb: FormBuilder,
  ) { }

  /**
   * Set up FormBuilder group.
   */
  ngOnInit(): void {
    this.textField = this.fb.group({
      shortText: ['', [Validators.required]],
      // longText: ['', [Validators.required]],
      // email: ['', [Validators.email, Validators.required]],
      // url: ['', [Validators.required]]
    });
  }

  /**
   * FormControlName.
   *
   * @returns A string based on the field type.
   */
   name(): string {
    switch(this.field?.type) {
      case this.fieldTypeEnum.URL:
        return 'url';
      case this.fieldTypeEnum.EMAIL:
        return 'email';
      default:
        return 'shortText';
    }
  }

}
