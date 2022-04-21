import { Component, Input, OnInit } from '@angular/core';
import { PopupService } from 'src/app/core/popup.service';
import { StationService } from 'src/app/core/station.service';
import { Question } from 'src/models';

/** It renders field setting interface. */
@Component({
  selector: 'app-setting-fields[field][stationRithmId]',
  templateUrl: './setting-fields.component.html',
  styleUrls: ['./setting-fields.component.scss'],
})
export class SettingFieldsComponent implements OnInit {

  /** The field information for your setting. */
  @Input() field!: Question;

  /** The station id of the current station. */
  @Input() stationRithmId!: string;

  constructor(
    private stationService: StationService,
    private popupService: PopupService
  ) {}

  /** Init method. */
  ngOnInit(): void {
    if (!this.field.value || !this.field.value?.length){
      this.field.value = 'Unnamed Field';
      this.setQuestionTitle();
    }
  }

  /**
   * Whether the current field belongs to a previous field or not.
   *
   * @returns Is boolean.
   */
  get isPrevious(): boolean {
    return this.field.originalStationRithmId !== this.stationRithmId;
  }

  /**
   * Delete space the text to be evaluated to remove excess space.
   *
   */
   deleteSpace(): void {
    if (this.field.value && this.field.value.length){
      this.field.value.replace(/\s+/g, ' ').trim();
    }
    if (!this.field.value || !this.field.value?.length){
      this.field.value = 'Unnamed Field';
    }
    this.setQuestionTitle();
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
      title: 'Are you sure?',
      message: 'You are about to remove this field from the widget.',
      okButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      important: true,
    });
    if (response) {
      this.stationService.deleteStationQuestion$.next(questions);
    }
  }
}
