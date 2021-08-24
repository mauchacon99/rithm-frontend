import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/core/user.service';
import { DocumentStationInformation, Question, QuestionFieldType, StationInformation, User } from 'src/models';

/**
 * Reusable component for the station information header.
 */
@Component({
  selector: 'app-station-info-header',
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

  /** User object. */
  user: User;

  /** Station name form. */
  stationNameForm: FormGroup;

  /** Field to change station name. */
  nameField!: Question;

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

  /** Get name of station from StationInformation based on type.
   *
   * @returns The Station Name.
   */
  get stationId(): string {
    return 'stationId' in this.stationInformation ? this.stationInformation.stationName : this.stationInformation.name;
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.user = this.userService.user;
    if (this.user.role === 'admin') {
      this.type = this.user.role;
    } else {
      this.type = 'worker';
    }
    this.stationNameForm = this.fb.group({
      name: ['']
    });
  }
}
