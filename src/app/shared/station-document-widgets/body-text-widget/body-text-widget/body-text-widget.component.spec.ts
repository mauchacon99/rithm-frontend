import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyTextWidgetComponent } from './body-text-widget.component';

import {
  CdkDragDrop,
  DragDropModule,
  copyArrayItem,
} from '@angular/cdk/drag-drop';
import { Question, QuestionFieldType } from 'src/models';
import { of } from 'rxjs';

describe('BodyTextWidgetComponent', () => {
  let component: BodyTextWidgetComponent;
  let fixture: ComponentFixture<BodyTextWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragDropModule],
      declarations: [BodyTextWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyTextWidgetComponent);
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
