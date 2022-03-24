import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadlineWidgetComponent } from './headline-widget.component';

describe('HeadlineWidgetComponent', () => {
  let component: HeadlineWidgetComponent;
  let fixture: ComponentFixture<HeadlineWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeadlineWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadlineWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
