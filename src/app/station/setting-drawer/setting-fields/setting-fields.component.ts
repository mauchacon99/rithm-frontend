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
    if (!this.field.prompt || !this.field.prompt?.length) {
      this.field.prompt = this.inputTextTag;
    }
  }

  /**
   * Return a normalized label tag for the current question.
   *
   * @returns String.
   */
  get inputTextTag(): string {
    const result = this.field.questionType.replace(/([A-Z])/g, ' $1');
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
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
  deleteExtraSpaces(): void {
    if (this.field.prompt && this.field.prompt.length) {
      this.field.prompt = this.field.prompt.replace(/\s+/g, ' ').trim();
    }
    if (!this.field.prompt || !this.field.prompt?.length) {
      this.field.prompt = this.inputTextTag;
    }
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
