import { Component, Input, OnInit } from '@angular/core';
import { DocumentStationInformation, Question, QuestionFieldType, StationInformation } from 'src/models';

/**
 * Reusable component for the station information header.
 */
@Component({
  selector: 'app-station-info-header',
  templateUrl: './station-info-header.component.html',
  styleUrls: ['./station-info-header.component.scss']
})
export class StationInfoHeaderComponent implements OnInit {
  /** Type of user looking at a document. */
  @Input() type!: 'admin' | 'super' | 'worker';

  /** Is component viewed in station edit mode? */
  @Input() stationEditMode!: boolean;

  /** Document information object passed from parent. */
  @Input() documentInformation!: DocumentStationInformation;

  /** Station information object passed from parent.*/
  @Input() stationInformation!: StationInformation;

  /** Unify info. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: any;

  /** Field to change station name. */
  nameField!: Question;

  /** Set this.info. */
  ngOnInit(): void {
    this.type = 'admin';

    this.info = {
      id: this.documentInformation ? this.documentInformation.stationId : this.stationInformation.rithmId,
      name: this.documentInformation ? this.documentInformation.stationName : this.stationInformation.name,
      supervisorRoster: this.documentInformation ? this.documentInformation.supervisorRoster : this.stationInformation.supervisors,
      supervisorRosterSize: this.documentInformation ?
        this.documentInformation.supervisorRoster.length :
        this.stationInformation.supervisors.length,
      workerRoster: this.documentInformation ? this.documentInformation.workerRoster : this.stationInformation.workers,
      workerRosterSize: this.documentInformation ? this.documentInformation.workerRoster.length : this.stationInformation.workers.length,
    };

    this.nameField = {
      prompt: this.info.name,
      instructions: '',
      questionType: {
        rithmId: '',
        typeString: QuestionFieldType.ShortText,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: true,
      isPrivate: false
    };
  }
}
