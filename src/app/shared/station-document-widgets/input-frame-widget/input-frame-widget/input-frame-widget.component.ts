import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
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
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { RandomIdGenerator } from 'src/helpers';

/**
 * Reusable component for displaying an input-frame-widget in station grid.
 */
@Component({
  selector: 'app-input-frame-widget',
  templateUrl: './input-frame-widget.component.html',
  styleUrls: ['./input-frame-widget.component.scss'],
})
export class InputFrameWidgetComponent implements OnInit, OnDestroy {
  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

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

  /** Emit an event to adjust its heigth when its number of children overpass its number of rows. */
  @Output() widgetRowAdjustment: EventEmitter<number> = new EventEmitter();

  /** Event Emitter will open a field setting drawer on the right side of the station. */
  @Output() openSettingDrawer: EventEmitter<Question> =
    new EventEmitter<Question>();

  /** Helper class for random id generator. */
  private randomIdGenerator: RandomIdGenerator;

  /** The list of questionFieldTypes. */
  fieldTypes = QuestionFieldType;

  /** The list of questionFieldTypes. */
  tempTitle = '';

  constructor(
    private stationService: StationService,
    private sidenavDrawerService: SidenavDrawerService
  ) {
    this.randomIdGenerator = new RandomIdGenerator();
  }

  /**
   * Listen the deleteStationQuestions Service.
   */
  private subscribeDeleteStationQuestion(): void {
    this.stationService.deleteStationQuestion$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((questions) => {
        if (questions && this.widgetMode === 'setting') {
          this.fields = this.fields?.filter(
            (e) => e.rithmId !== questions.rithmId
          );
          this.sidenavDrawerService.closeDrawer();
        }
      });
  }

  /**
   * Listen the stationQuestionTitle Service.
   */
  private stationQuestionTitle$(): void {
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
          if (!this.tempTitle) {
            this.tempTitle = this.fields[questionIndex].prompt.slice();
          }
          this.fields[questionIndex].prompt =
            questionTitle.value || this.tempTitle;
        }
      });
  }

  /**
   * Set up deleteStationQuestions subscriptions.
   */
  ngOnInit(): void {
    this.subscribeDeleteStationQuestion();
    this.stationQuestionTitle$();
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
    const questionInfo = event.previousContainer.data[event.previousIndex];

    const newQuestion: Question = questionInfo.rithmId
      ? questionInfo
      : {
          rithmId: this.randomIdGenerator.getRandRithmId(4),
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
        rithmId: this.randomIdGenerator.getRandRithmId(4),
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
      this.tempTitle = '';
      this.openSettingDrawer.emit(field);
    }
  }
}
