import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressFieldComponent } from './address-field.component';

describe('AddressFieldComponent', () => {
  let component: AddressFieldComponent;
  let fixture: ComponentFixture<AddressFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //TODO: enable address field test.
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
