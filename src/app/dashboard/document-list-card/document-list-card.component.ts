import { Component, Input } from '@angular/core';
import { Document } from 'src/models';
import { UtcTimeConversion } from 'src/helpers';

/**
 * Component for displaying a list of documents on the dashboard.
 */
@Component({
  selector: 'app-document-list-card[documents][isLoading][isPriority]',
  templateUrl: './document-list-card.component.html',
  styleUrls: ['./document-list-card.component.scss'],
  providers: [UtcTimeConversion],
})
export class DocumentListCardComponent {
  /** The list of documents to display in the card. */
  @Input() documents = Array<Document>();

  /** Whether the data is being loaded. */
  @Input() isLoading = false;

  /** Whether the card is for the priority queue. */
  @Input() isPriority = false;

  constructor(private utcTimeConversion: UtcTimeConversion) {}

  /**
   * Uses the helper: UtcTimeConversion.
   * Tells how long a document has been in a station for.
   *
   * @param timeEntered Reflects time a document entered a station.
   * @returns A string reading something like "4 days" or "32 minutes".
   */
  getElapsedTime(timeEntered: string): string {
    return this.utcTimeConversion.getElapsedTimeText(
      this.utcTimeConversion.getMillisecondsElapsed(timeEntered)
    );
  }
}
