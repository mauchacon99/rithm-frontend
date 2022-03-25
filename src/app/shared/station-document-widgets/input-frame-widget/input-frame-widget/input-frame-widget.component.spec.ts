import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFrameWidgetComponent } from './input-frame-widget.component';

import {
  CdkDragDrop,
  DragDropModule,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Question, QuestionFieldType } from 'src/models';
import { of } from 'rxjs';

describe('InputFrameWidgetComponent', () => {
  let component: InputFrameWidgetComponent;
  let fixture: ComponentFixture<InputFrameWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragDropModule],
      declarations: [InputFrameWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFrameWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('TestDragDropElements', () => {
    it('should call the method that copy the new inputs in widget', async () => {
      const secondList: Question[] = [];
      const firstList: Question[] = [
        {
          prompt: 'Fake question 1',
          rithmId: '3j4k-3h2j-hj4j',
          questionType: QuestionFieldType.Number,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
      ];

      const cdkEvent = {
        container: { data: firstList, id: 'form-inputs' },
        previousContainer: { data: secondList, id: 'input-widget' },
      } as CdkDragDrop<Question[]>;

      const spyDrag = spyOn(component, 'addElementDrag').and.callFake(() =>
        of(cdkEvent)
      );
      component.addElementDrag(cdkEvent);
      fixture.detectChanges();

      expect(cdkEvent.container).not.toEqual(cdkEvent.previousContainer);
      expect(cdkEvent.container.data).toEqual(firstList);
      expect(cdkEvent.previousContainer.data).toEqual(secondList);

      copyArrayItem(firstList, secondList, 0, 0);
      expect(secondList).toEqual(firstList);
      expect(spyDrag).toHaveBeenCalledOnceWith(cdkEvent);
    });

    it('should call the method that move the current inputs in widget', async () => {
      const questionFields: Question[] = [
        {
          prompt: 'Fake question 1',
          rithmId: '3j4k-3h2j-hj4j',
          questionType: QuestionFieldType.Number,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
        {
          prompt: 'Fake question 2',
          rithmId: '3j4k-3h2j-hj4j',
          questionType: QuestionFieldType.Number,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
        {
          prompt: 'Fake question 3',
          rithmId: '3j4k-3h2j-hj4j',
          questionType: QuestionFieldType.Number,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
      ];

      const cdkEvent = {
        container: { data: questionFields, id: 'input-widget' },
        previousContainer: { data: questionFields, id: 'input-widget' },
        previousIndex: 1,
        currentIndex: 2,
      } as CdkDragDrop<Question[]>;

      const spyDrop = spyOn(component, 'addElementDrag').and.callFake(() =>
        of(cdkEvent)
      );
      component.addElementDrag(cdkEvent);
      fixture.detectChanges();

      expect(cdkEvent.container.id).toEqual(cdkEvent.previousContainer.id);

      moveItemInArray(questionFields, 1, 2);
      fixture.detectChanges();

      expect(cdkEvent.container.data).toEqual(questionFields);
      expect(spyDrop).toHaveBeenCalled();
    });
  });

  it('should emit event toggleRightDrawer', () => {
    const spyEmit = spyOn(component.toggleRightDrawer, 'emit');
    component.openSettingDrawer();
    expect(spyEmit).toHaveBeenCalled();
  });
});
