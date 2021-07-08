import { Component, Input } from '@angular/core';

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
  @Input() type!: 'admin' | 'super' | 'worker';

  constructor() {
    this.type = 'worker';
  }
}
