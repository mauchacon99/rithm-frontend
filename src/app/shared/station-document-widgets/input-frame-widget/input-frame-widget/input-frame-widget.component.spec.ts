import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFrameWidgetComponent } from './input-frame-widget.component';

describe('InputFrameWidgetComponent', () => {
  let component: InputFrameWidgetComponent;
  let fixture: ComponentFixture<InputFrameWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
});
