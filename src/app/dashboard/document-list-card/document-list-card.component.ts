import { Component, Input } from '@angular/core';
import { Document } from 'src/models';
import { UtcTimeConversion } from 'src/helpers';

/**
 * Component for displaying a list of documents on the dashboard.
 */
@Component({
  selector: 'app-document-list-card',
  templateUrl: './document-list-card.component.html',
  styleUrls: ['./document-list-card.component.scss'],
  providers: [UtcTimeConversion]
})
export class DocumentListCardComponent {

  /** Temp list of documents. */
  @Input() docList = Array<Document>();

  /** Is the data being loaded. */
  @Input() isLoading = false;

  /** Use to show or hide continue button. */
  @Input() isPriority = false;

  constructor(private utcTimeConversion: UtcTimeConversion) { }

  /**
   * Uses the helper: UtcTimeConversion.
   * Tells how long a document has been in a station for.
   *
   * @param entered Reflects time a document entered a station.
   * @returns A string reading something like "4 days" or "32 minutes".
   */
  handleElapsedTime(entered: string): string {
    return this.utcTimeConversion.convertElapsedTime(
      this.utcTimeConversion.updateTimeInStation(entered)
    );
  }
}
