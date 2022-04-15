import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { PopupService } from 'src/app/core/popup.service';
import { StationService } from 'src/app/core/station.service';
import { Question } from 'src/models';

/** It renders field setting interface. */
@Component({
  selector: 'app-setting-fields[field][stationRithmId]',
  templateUrl: './setting-fields.component.html',
  styleUrls: ['./setting-fields.component.scss'],
})
export class SettingFieldsComponent {
  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** The field information for your setting. */
  @Input() field!: Question;

  /** The station id of the current station. */
  @Input() stationRithmId!: string;

  constructor(
    private stationService: StationService,
    private popupService: PopupService
  ) {}

  /**
   * Whether the current field belongs to a previous field or not.
   *
   * @returns Is boolean.
   */
  get isPrevious(): boolean {
    return this.field.originalStationRithmId !== this.stationRithmId;
  }

  /**
   * Shut off isRequired when isReadOnly is off and isPrevious = true.
   */
  public setReadOnlyFalse(): void {
    if (this.isPrevious) {
      this.field.isRequired = this.field.isReadOnly && this.field.isRequired;
    }
  }

  /**
   * Set the question title.
   */
  setQuestionTitle(): void {
    this.stationService.stationQuestionTitle$.next(this.field);
  }

  /**
   * Completes all subscriptions.
   *
   * @param questions The current questions to be deleted in field settings.
   */
  async deleteQuestion(questions: Question): Promise<void> {
    const response = await this.popupService.confirm({
      title: '',
      message: 'Are you sure you want to delete this field?',
      okButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      important: true,
    });
    if (response) {
      this.stationService.deleteStationQuestion$.next(questions);
    }
  }
}
