import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleImageWidgetComponent } from './circle-image-widget.component';

describe('CircleImageWidgetComponent', () => {
  let component: CircleImageWidgetComponent;
  let fixture: ComponentFixture<CircleImageWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CircleImageWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleImageWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
