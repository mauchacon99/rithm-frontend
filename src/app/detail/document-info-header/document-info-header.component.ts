import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * Reusable component for the document information header.
 */
@Component({
  selector: 'app-document-info-header',
  templateUrl: './document-info-header.component.html',
  styleUrls: ['./document-info-header.component.scss']
})
export class DocumentInfoHeaderComponent {
  /** Type of user looking at a document. */
  @Input() userType!: 'admin' | 'super' | 'worker';

  /** Document name form. */
  documentNameForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.userType = 'worker';
    this.documentNameForm = this.fb.group({
      name: ['']
    });
  }
}
