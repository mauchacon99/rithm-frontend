import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentStationInformation, UserType, StationInformation } from 'src/models';
import { UtcTimeConversion } from 'src/helpers';

/**
 * Reusable component for the document information header.
 */
@Component({
  selector: 'app-document-info-header[documentInformation]',
  templateUrl: './document-info-header.component.html',
  styleUrls: ['./document-info-header.component.scss'],
  providers: [UtcTimeConversion]
})
export class DocumentInfoHeaderComponent {
  /** Type of user looking at a document. */
  @Input() userType!: UserType;

  /** Document information object passed from parent. */
  @Input() documentInformation!: DocumentStationInformation | StationInformation;

  /** Station or Document looking at a document. */
  @Input() isStation!: boolean;

  /** Enum for all types of a user. */
  userTypeEnum = UserType;

  /** Document name form. */
  documentNameForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private utcTimeConversion: UtcTimeConversion,
  ) {
    this.userType = UserType.Worker;
    this.documentNameForm = this.fb.group({
      name: ['']
    });
  }

  /**
   * Uses the helper: UtcTimeConversion.
   * Tells how long a document has been in a station for.
   *
   * @param timeEntered Reflects the date we're calculating against.
   * @returns A string reading something like "4 days" or "32 minutes".
   */
  getElapsedTime(timeEntered: string): string {
    return this.utcTimeConversion.getElapsedTimeText(
      this.utcTimeConversion.getMillisecondsElapsed(timeEntered)
    );
  }

  /** Get Document Priority of document from DocumentStationInformation based on type.
   *
   * @returns The Document Priority.
   */
  get documentPriority(): number {
    return 'documentPriority' in this.documentInformation ? this.documentInformation.documentPriority : 0;
  }

  /** Get flowed time UTC of document from DocumentStationInformation based on type.
   *
   * @returns The Flowed time UTC.
   */
  get flowedTimeUTC(): string {
    return 'flowedTimeUTC' in this.documentInformation ? this.documentInformation.flowedTimeUTC : '';
  }

  /** Get last updated UTC of document from DocumentStationInformation based on type.
   *
   * @returns The Last Updated UTC.
   */
  get lastUpdatedUTC(): string {
    return 'lastUpdatedUTC' in this.documentInformation ? this.documentInformation.lastUpdatedUTC : '';
  }

  /** Get name of document from DocumentStationInformation based on type.
   *
   * @returns The Document Name.
   */
  get documentName(): string {
    return 'documentName' in this.documentInformation ? this.documentInformation.documentName : '';
  }
}
