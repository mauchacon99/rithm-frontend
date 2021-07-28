import { Component, Input } from '@angular/core';
import { Question } from 'src/models';

/**
 * Component for the document template area of a station/document.
 */
@Component({
  selector: 'app-document-template[documentFields][generalInstructions]',
  templateUrl: './document-template.component.html',
  styleUrls: ['./document-template.component.scss']
})
export class DocumentTemplateComponent {

  /** The general instructions to be displayed, if any. */
  @Input() generalInstructions!: string;

  /** The document fields in the template area for the station/document. */
  @Input() documentFields!: Question[];

}
