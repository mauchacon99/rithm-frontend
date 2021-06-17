import { Component, Input } from '@angular/core';
import { Document } from 'src/models';

/**
 * Component for displaying a list of documents on the dashboard.
 */
@Component({
  selector: 'app-document-list-card',
  templateUrl: './document-list-card.component.html',
  styleUrls: ['./document-list-card.component.scss']
})
export class DocumentListCardComponent {
  /** Temp list of documents. */
  @Input() docList = Array<Document>();

  /** Is the data being loaded. */
  @Input() isLoading = false;

  /** Use to show or hide continue button. */
  @Input() isPriority = false;

}
