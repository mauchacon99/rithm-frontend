import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFrameWidgetComponent } from './input-frame-widget.component';

import {
  CdkDragDrop,
  DragDropModule,
  copyArrayItem,
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
    it('should call the method addElementDrag', async () => {
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
  });
});
