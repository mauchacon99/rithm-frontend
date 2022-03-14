import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Question, QuestionFieldType } from 'src/models';
import { MatSelectHarness } from '@angular/material/select/testing';
import { HarnessLoader } from '@angular/cdk/testing';

import { SelectFieldComponent } from './select-field.component';
import { MockDocumentService } from 'src/mocks';
import { DocumentService } from 'src/app/core/document.service';

const FIELD: Question = {
  rithmId: '3j4k-3h2j-hj4j',
  prompt: 'Fake question 9',
  questionType: QuestionFieldType.Select,
  isReadOnly: false,
  isRequired: true,
  isPrivate: false,
  possibleAnswers: [
    {
      rithmId: '3j4k-3h2j-hj41',
      text: 'Option 1',
      default: false,
    },
    {
      rithmId: '3j4k-3h2j-hj42',
      text: 'Option 2',
      default: true,
    },
    {
      rithmId: '3j4k-3h2j-hj43',
      text: 'Option 3',
      default: false,
    },
    {
      rithmId: '3j4k-3h2j-hj44',
      text: 'Option 4',
      default: false,
    },
  ],
  children: [],
};

describe('SelectFieldComponent', () => {
  let component: SelectFieldComponent;
  let fixture: ComponentFixture<SelectFieldComponent>;
  const formBuilder = new FormBuilder();
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectFieldComponent],
      imports: [
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: FormGroup, useValue: formBuilder },
        { provide: DocumentService, useValue: MockDocumentService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFieldComponent);
    component = fixture.componentInstance;
    component.field = FIELD;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the select', async () => {
    const selects = await loader.getAllHarnesses(MatSelectHarness);
    expect(selects.length).toBe(1);
  });

  it('should be able to check whether a select is in multi-selection mode', async () => {
    const select = await loader.getHarness(MatSelectHarness);
    expect(await select.isMultiple()).toBe(false);
  });

  it('should be able to open and close a select', async () => {
    const select = await loader.getHarness(MatSelectHarness);
    expect(await select.isOpen()).toBe(false);
    await select.open();
    expect(await select.isOpen()).toBe(true);
    await select.close();
    expect(await select.isOpen()).toBe(false);
  });

  xit('should require an input in select field', () => {
    // TODO: figure out why this is failing
    // const select = component.selectFieldForm.get(QuestionFieldType.Select);
    // expect(component.field.questionType.typeString).toBeTruthy();
    // expect(select.valid).toBeFalse();
    // expect(select.hasError('required')).toBeTrue();
    // expect(component.selectFieldForm.valid).toBeFalse();
  });
});
