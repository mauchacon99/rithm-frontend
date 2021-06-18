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
   * Tells how much time a document has been in a station.
   *
   * @param elapsed Reflects time a document has spent in a station.
   * @returns Converts milliseconds to an easier format.
   */
  handleElapsedTime(elapsed: string): string {
    return this.utcTimeConversion.convertElapsedTime(
      this.utcTimeConversion.updateTimeInStation(elapsed)
    );
  }

}
