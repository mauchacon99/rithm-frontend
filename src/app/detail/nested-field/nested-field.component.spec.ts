import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedFieldComponent } from './nested-field.component';

describe('NestedFieldComponent', () => {
  let component: NestedFieldComponent;
  let fixture: ComponentFixture<NestedFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NestedFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
