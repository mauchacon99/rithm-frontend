import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckFieldComponent } from './check-field.component';

describe('CheckFieldComponent', () => {
  let component: CheckFieldComponent;
  let fixture: ComponentFixture<CheckFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
