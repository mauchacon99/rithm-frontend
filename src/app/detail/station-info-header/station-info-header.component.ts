import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  /** Station information object passed from parent.*/
  @Input() stationInformation!: StationInformation | DocumentStationInformation;

  /** Station name form. */
  stationNameForm: FormGroup;

  /** Field to change station name. */
  nameField!: Question;

  /** Set this.info. */
  ngOnInit(): void {
    this.type = 'admin';

    this.nameField = {
      prompt: this.stationName,
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

  /** Get name of station from StationInformation based on type.
   *
   * @returns The Station Name.
   */
  get stationName(): string {
    return 'stationName' in this.stationInformation ? this.stationInformation.stationName : this.stationInformation.name;
  }

  /** Get name of station from StationInformation based on type.
   *
   * @returns The Station Name.
   */
  get stationId(): string {
    return 'stationId' in this.stationInformation ? this.stationInformation.stationName : this.stationInformation.name;
  }

  constructor(
    private fb: FormBuilder,
  ) {
    this.stationNameForm = this.fb.group({
      name: ['']
    });
  }
}
