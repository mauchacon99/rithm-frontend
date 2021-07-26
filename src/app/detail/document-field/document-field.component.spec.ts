import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { AddressFieldComponent } from '../address-field/address-field.component';
import { CheckFieldComponent } from '../check-field/check-field.component';
import { DateFieldComponent } from '../date-field/date-field.component';
import { NumberFieldComponent } from '../number-field/number-field.component';
import { SelectFieldComponent } from '../select-field/select-field.component';
import { TextFieldComponent } from '../text-field/text-field.component';

import { DocumentFieldComponent } from './document-field.component';

describe('DocumentFieldComponent', () => {
  let component: DocumentFieldComponent;
  let fixture: ComponentFixture<DocumentFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocumentFieldComponent,
        MockComponent(TextFieldComponent),
        MockComponent(NumberFieldComponent),
        MockComponent(DateFieldComponent),
        MockComponent(AddressFieldComponent),
        MockComponent(SelectFieldComponent),
        MockComponent(CheckFieldComponent),
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
