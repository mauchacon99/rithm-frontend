import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BodyTextWidgetComponent } from './body-text-widget.component';

describe('BodyTextWidgetComponent', () => {
  let component: BodyTextWidgetComponent;
  let fixture: ComponentFixture<BodyTextWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
});
