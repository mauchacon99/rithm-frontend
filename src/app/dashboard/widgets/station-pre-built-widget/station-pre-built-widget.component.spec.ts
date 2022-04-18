import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationPreBuiltWidgetComponent } from './station-pre-built-widget.component';

describe('StationPreBuiltWidgetComponent', () => {
  let component: StationPreBuiltWidgetComponent;
  let fixture: ComponentFixture<StationPreBuiltWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StationPreBuiltWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationPreBuiltWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
