import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerPreBuiltWidgetComponent } from './container-pre-built-widget.component';

describe('ContainerPreBuiltWidgetComponent', () => {
  let component: ContainerPreBuiltWidgetComponent;
  let fixture: ComponentFixture<ContainerPreBuiltWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContainerPreBuiltWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerPreBuiltWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
