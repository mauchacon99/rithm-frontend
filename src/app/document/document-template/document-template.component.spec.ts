import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { DocumentFieldComponent } from '../document-field/document-field.component';

import { DocumentTemplateComponent } from './document-template.component';

describe('DocumentTemplateComponent', () => {
  let component: DocumentTemplateComponent;
  let fixture: ComponentFixture<DocumentTemplateComponent>;
  const formBuilder = new FormBuilder();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fn = function () {};
  const errorMessage = {
    invalidForm: {
      valid: false,
      message: 'User form is invalid',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocumentTemplateComponent,
        MockComponent(DocumentFieldComponent),
      ],
      imports: [ReactiveFormsModule],
      providers: [{ provide: FormBuilder, useValue: formBuilder }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register function with the `onTouched` event', () => {
    component.registerOnTouched(fn);
    expect(component.onTouched).toEqual(fn);
  });

  it('should return null when form is valid', () => {
    const error = component.validate();
    expect(error).toBe(null);
  });

  it('should return validation errors when form is invalid', () => {
    component.documentTemplateForm.setErrors({ valid: false });
    const error = component.validate();
    expect(error).toEqual(errorMessage);
  });
});
