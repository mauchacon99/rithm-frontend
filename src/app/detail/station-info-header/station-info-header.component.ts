import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { StationService } from 'src/app/core/station.service';
import { UserService } from 'src/app/core/user.service';
import { DocumentStationInformation, Question, QuestionFieldType, StationInformation } from 'src/models';
import { StationInfoDrawerData } from '../../../models/station-info-drawer-data';

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

  /** Send Loading in station component */
  @Output() stationLoadingParent = new EventEmitter<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private sidenavDrawerService: SidenavDrawerService,
    private stationService: StationService,
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
      instructions: '',
      questionType: QuestionFieldType.ShortText,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    };
    this.stationNameForm.controls['name'].setValue(this.stationName);
  }

  /** Get name of station from StationInformation based on type.
   *
   * @returns The Station Name.
   */
  get stationName(): string {
    return 'stationName' in this.stationInformation ? this.stationInformation.stationName : this.stationInformation.name;
  }

  /** Get the priority from StationInformation model.
   *
   * @returns The Priority of station.
   */
  get priority(): number | null {
    return 'priority' in this.stationInformation ? this.stationInformation.priority : null;
  }

  /**
   * Toggles the open state of the drawer for station info.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'stationInfo'): void {
    const dataInformationDrawer: StationInfoDrawerData = {
      stationInformation: this.stationInformation as StationInformation,
      stationName: this.stationName,
      isWorker: false,
      editMode: this.stationEditMode
    };
    console.log(dataInformationDrawer);

    this.sidenavDrawerService.toggleDrawer(drawerItem, dataInformationDrawer);
  }

  /**
   * Update the Station Name.
   *
   * @param station The new station information to be updated.
   */
  updateStation(): void {
    let stationLoading = false;
    const station = this.stationInformation as StationInformation;
    station.name = this.stationNameForm.value.name;
    stationLoading = true;
    this.sendLoadingParent(stationLoading);
    this.stationService.updateStation(station)
      .pipe(first())
      .subscribe((stationUpdated) => {
        if (stationUpdated) {
          this.stationInformation = stationUpdated;
        }
        stationLoading = false;
        this.sendLoadingParent(stationLoading);
      }, (error: unknown) => {
        stationLoading = false;
        this.sendLoadingParent(stationLoading);
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }

  /**
   * Send param show or hidden loading.
   *
   * @param showLoading Show or hidden loading in parent component.
   */
  sendLoadingParent(showLoading: boolean = false): void {
    this.stationLoadingParent.emit(showLoading);
  }

}
