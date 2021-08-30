import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/core/user.service';
import { DocumentStationInformation, Question, QuestionFieldType, StationInformation } from 'src/models';

/**
 * Reusable component for the station information header.
 */
@Component({
  selector: 'app-station-info-header[stationInformation][stationEditMode]',
  templateUrl: './station-info-header.component.html',
  styleUrls: ['./station-info-header.component.scss']
})
export class StationInfoHeaderComponent implements OnInit {
  /** Is component viewed in station edit mode? */
  @Input() stationEditMode!: boolean;

  /** Station information object passed from parent.*/
  @Input() stationInformation!: StationInformation | DocumentStationInformation;

  /** Type of user looking at a document. */
  type: 'admin' | 'super' | 'worker';

  /** Station name form. */
  stationNameForm: FormGroup;

  /** Field to change station name. */
  nameField!: Question;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.type = this.userService.user.role === 'admin' ? this.userService.user.role : 'worker';

    this.stationNameForm = this.fb.group({
      name: ['']
    });
  }

  /** Set this.info. */
  ngOnInit(): void {

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

}
