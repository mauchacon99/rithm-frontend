import { Component, Input, OnInit } from '@angular/core';
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
export class DocumentInfoHeaderComponent implements OnInit {
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

  /** Document priority for document info modal. */
  documentPriority = 0;

  /** The time at which this document was most recently flowed as an ISO string date. */
  flowedTimeUTC = '';

  /** The time at which this document was last updated as an ISO string date. */
  lastUpdatedUTC = '';

  /** Name of the header. */
  name = '';

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
   * Gets info about the initial values.
   */
  ngOnInit(): void {
    this.documentPriority = this.getDocumentPriority(this.documentInformation);
    this.flowedTimeUTC = this.getFlowedTimeUTC(this.documentInformation);
    this.lastUpdatedUTC = this.getLastUpdatedUTC(this.documentInformation);
    this.name = this.getName(this.documentInformation);
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

  /**
   * Get document priority from document modal and 0 if station modal.
   *
   * @param obj Object set from document or station modal.
   * @returns Priority of the document.
   */
  private getDocumentPriority(obj: DocumentStationInformation | StationInformation): number {
    if ((obj as DocumentStationInformation).documentPriority) {
      return (obj as DocumentStationInformation).documentPriority;
    }
    return 0;
  }

  /**
   * Get FlowedTime in UTC from document modal.
   *
   * @param obj Object set from document or station modal.
   * @returns FlowedTime to display.
   */
   private getFlowedTimeUTC(obj: DocumentStationInformation | StationInformation): string {
    if ((obj as DocumentStationInformation).flowedTimeUTC) {
      return (obj as DocumentStationInformation).flowedTimeUTC;
    }
    return '';
  }

  /**
   * Get lastUpdated time in UTC from document modal.
   *
   * @param obj Object set from document or station modal.
   * @returns FlowedTime to display.
   */
   private getLastUpdatedUTC(obj: DocumentStationInformation | StationInformation): string {
    if ((obj as DocumentStationInformation).lastUpdatedUTC) {
      return (obj as DocumentStationInformation).lastUpdatedUTC;
    }
    return '';
  }

  /**
   * Get name from document and station info modal.
   *
   * @param obj Object set from document or station modal.
   * @returns Name to display in header.
   */
   private getName(obj: DocumentStationInformation | StationInformation): string {
    if ((obj as DocumentStationInformation).documentName) {
      return (obj as DocumentStationInformation).documentName;
    }
    return '';
  }
}
