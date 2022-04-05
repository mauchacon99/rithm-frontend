import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { QuestionFieldType, Question } from 'src/models';
import { StationService } from 'src/app/core/station.service';
import { Subject, takeUntil } from 'rxjs';

/**
 * Reusable component for displaying an input-frame-widget in station grid.
 */
@Component({
  selector: 'app-input-frame-widget',
  templateUrl: './input-frame-widget.component.html',
  styleUrls: ['./input-frame-widget.component.scss'],
})
export class InputFrameWidgetComponent implements OnDestroy {
  /** Questions to be displayed inside the widget. */
  @Input() fields: Question[] | undefined = [];

  /** The mode to display fields inside the widget. */
  @Input() widgetMode!: 'layout' | 'setting';

  /** Whether the station is in editMode or previewMode. */
  @Input() stationViewMode!: 'edit' | 'preview';

  /** Id of the current Gridster item. */
  @Input() id!: number;

  /** Station Rithm id. */
  @Input() stationRithmId = '';

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** The list of questionFieldTypes. */
  fieldTypes = QuestionFieldType;

  /** The list of questionFieldTypes. */
  tempTitle = '';

  /** Event Emitter will open a field setting drawer on the right side of the station. */
  @Output() openSettingDrawer: EventEmitter<Question> =
    new EventEmitter<Question>();

  constructor(private stationService: StationService) {
    this.stationService.stationQuestionTitle$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((questionTitle) => {
        if (
          questionTitle &&
          this.widgetMode === 'setting' &&
          this.fields &&
          this.fields.length > 0
        ) {
          const questionIndex = this.fields?.findIndex(
            (e) => e.rithmId === questionTitle.rithmId
          );
          if (
            questionTitle.value &&
            questionTitle.value?.length > 0 &&
            this.tempTitle === ''
          ) {
            this.tempTitle = this.fields[questionIndex].prompt.slice();
          }
          this.fields[questionIndex].prompt = questionTitle.value
            ? questionTitle.value
            : this.tempTitle;
        }
      });
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Add the element draggable to the questions field.
   *
   * @param event Receive the element draggable as DragDrop type for move it.
   */
  addElementDrag(event: CdkDragDrop<Question[]>): void {
    const fieldType =
      event.previousContainer.data[event.previousIndex].questionType;
    const prompt = event.previousContainer.data[event.previousIndex].prompt;
    const newQuestion: Question = {
      rithmId: this.randRithmId,
      prompt: prompt,
      questionType: fieldType,
      isReadOnly: false,
      isRequired: fieldType === QuestionFieldType.Instructions ? true : false,
      isPrivate: false,
      children:
        fieldType === QuestionFieldType.AddressLine
          ? this.addAddressChildren()
          : [],
      originalStationRithmId: this.stationRithmId,
    };
    if (
      fieldType === QuestionFieldType.CheckList ||
      fieldType === QuestionFieldType.Select ||
      fieldType === QuestionFieldType.MultiSelect
    ) {
      newQuestion.possibleAnswers = [];
    }
    if (event.container.id !== event.previousContainer.id) {
      copyArrayItem([newQuestion], event.container.data, 0, event.currentIndex);
    } else {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  /**
   * Generate a random rithmId to added fields.
   *
   * @returns Random RithmId.
   */
  private get randRithmId(): string {
    const genRanHex = (size: number) =>
      [...Array(size)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('');
    const rithmId = `${genRanHex(4)}-${genRanHex(4)}-${genRanHex(4)}`;
    return rithmId;
  }

  /**
   * Add the kind address.
   *
   * @returns Address children questions.
   */
  private addAddressChildren(): Question[] {
    const addressChildren: Question[] = [];
    const children = [
      {
        prompt: 'Address Line 1',
        type: QuestionFieldType.LongText,
        required: true,
      },
      {
        prompt: 'Address Line 2',
        type: QuestionFieldType.LongText,
        required: false,
      },
      { prompt: 'City', type: QuestionFieldType.City, required: true },
      { prompt: 'State', type: QuestionFieldType.State, required: true },
      { prompt: 'Zip', type: QuestionFieldType.Zip, required: true },
    ];
    children.forEach((element) => {
      const child: Question = {
        rithmId: this.randRithmId,
        prompt: element.prompt,
        questionType: element.type,
        isReadOnly: false,
        isRequired: element.required,
        isPrivate: false,
        children: [],
        originalStationRithmId: '21316c62-8a45-4e79-ba58-0927652569cc',
      };
      addressChildren.push(child);
    });
    return addressChildren;
  }

  /**
   * Open setting drawer.
   *
   * @param field The field for the setting drawer.
   */
  openFieldSettingDrawer(field: Question): void {
    if (this.widgetMode === 'setting') {
      this.tempTitle = '';
      this.openSettingDrawer.emit(field);
    }
  }
}
