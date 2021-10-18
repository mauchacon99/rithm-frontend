import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFieldsComponent } from './all-fields.component';
import { MatCardModule } from '@angular/material/card';

describe('AllFieldsComponent', () => {
  let component: AllFieldsComponent;
  let fixture: ComponentFixture<AllFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllFieldsComponent ],
      imports: [
        MatCardModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
