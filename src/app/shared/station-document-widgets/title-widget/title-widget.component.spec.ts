import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleWidgetComponent } from './title-widget.component';

describe('TitleWidgetComponent', () => {
  let component: TitleWidgetComponent;
  let fixture: ComponentFixture<TitleWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TitleWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
