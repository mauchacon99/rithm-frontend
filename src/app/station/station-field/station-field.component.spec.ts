import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationFieldComponent } from './station-field.component';

describe('StationFieldComponent', () => {
  let component: StationFieldComponent;
  let fixture: ComponentFixture<StationFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
