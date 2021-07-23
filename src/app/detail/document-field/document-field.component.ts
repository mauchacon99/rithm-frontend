import { Component, Input } from '@angular/core';

/**
 * Reusable component for every field on a document.
 */
@Component({
  selector: 'app-document-field[field]',
  templateUrl: './document-field.component.html',
  styleUrls: ['./document-field.component.scss']
})
export class DocumentFieldComponent {

  /** The document field to display. */
  @Input() field!: any; // TODO: define interface for this

}
