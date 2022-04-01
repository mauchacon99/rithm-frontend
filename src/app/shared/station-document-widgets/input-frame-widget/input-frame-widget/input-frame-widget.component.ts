import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { QuestionFieldType, Question } from 'src/models';

/**
 * Reusable component for displaying an input-frame-widget in station grid.
 */
@Component({
  selector: 'app-input-frame-widget',
  templateUrl: './input-frame-widget.component.html',
  styleUrls: ['./input-frame-widget.component.scss'],
})
export class InputFrameWidgetComponent {
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

  /** If there are many elements in the widget, the height will be modified. */
  @Output() widgetRowAdjustment: EventEmitter<number> = new EventEmitter();

  /** Event Emitter will open a field setting drawer on the right side of the station. */
  @Output() openSettingDrawer: EventEmitter<Question> =
    new EventEmitter<Question>();

  /**
   * Add the element draggable to the questions field.
   *
   * @param event Receive the element draggable as DragDrop type for move it.
   */
  addElementDrag(event: CdkDragDrop<Question[]>): void {
    const questionInfo = event.previousContainer.data[event.previousIndex];

    const newQuestion: Question = questionInfo.rithmId
      ? questionInfo
      : {
          rithmId: this.randRithmId,
          prompt: questionInfo.prompt,
          questionType: questionInfo.questionType,
          isReadOnly: false,
          isRequired: false,
          isPrivate: false,
          children:
            questionInfo.questionType === QuestionFieldType.AddressLine
              ? this.addAddressChildren()
              : [],
          originalStationRithmId: this.stationRithmId,
          possibleAnswers: [],
        };

    if (event.container.id !== event.previousContainer.id) {
      copyArrayItem([newQuestion], event.container.data, 0, event.currentIndex);
      if (this.fields && this.fields.length > 4) {
        this.widgetRowAdjustment.emit(this.fields.length);
      }
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
        originalStationRithmId: this.stationRithmId,
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
      this.openSettingDrawer.emit(field);
    }
  }
}
