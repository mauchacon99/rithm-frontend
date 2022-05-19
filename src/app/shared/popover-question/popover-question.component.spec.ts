import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverQuestionComponent } from './popover-question.component';

describe('PopoverQuestionComponent', () => {
  let component: PopoverQuestionComponent;
  let fixture: ComponentFixture<PopoverQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopoverQuestionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
