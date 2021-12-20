import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { UserService } from 'src/app/core/user.service';
import { DocumentStationInformation, Question, QuestionFieldType, StationInformation, StationInfoDrawerData } from 'src/models';
import { StationService } from 'src/app/core/station.service';
import { ErrorService } from 'src/app/core/error.service';

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
    private stationService: StationService,
    private sidenavDrawerService: SidenavDrawerService,
    private errorService: ErrorService,
  ) {
    this.type = this.userService.user.role === 'admin' ? this.userService.user.role : 'worker';

    this.stationNameForm = this.fb.group({
      name: ['']
    });
  }

  /** Set this.info. */
  ngOnInit(): void {

    this.nameField = {
      rithmId: '3j4k-3h2j-hj4j',
      prompt: this.stationName,
      questionType: QuestionFieldType.ShortText,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    };
    this.stationNameForm.controls['name'].setValue(this.stationName);
  }

  /**
   * Get name of station from StationInformation based on type.
   *
   * @returns The Station Name.
   */
  get stationName(): string {
    return 'stationName' in this.stationInformation ? this.stationInformation.stationName : this.stationInformation.name;
  }

  /**
   * Get the priority from StationInformation model.
   *
   * @returns The Priority of station.
   */
  get priority(): number | null {
    return 'priority' in this.stationInformation ? this.stationInformation.priority : null;
  }

  /**
   * The id of the station or document.
   *
   * @returns The id of the station or document.
   */
   get stationRithmId(): string {
    return 'rithmId' in this.stationInformation ? this.stationInformation.rithmId : this.stationInformation.stationRithmId;
  }

  /**
   * Toggles the open state of the drawer for station info.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'stationInfo'): void {
    const dataInformationDrawer: StationInfoDrawerData = {
      stationRithmId: this.stationRithmId,
      stationName: this.stationName,
      editMode: this.stationEditMode,
      openedFromMap: false
    };
    this.sidenavDrawerService.toggleDrawer(drawerItem, dataInformationDrawer);
    this.updateStationInfoDrawerName();
  }

  /**
   * Update InfoDrawer Station Name.
   */
  updateStationInfoDrawerName(): void {
    this.stationService.updatedStationNameText(this.stationNameForm.controls.name.value);
  }

}
