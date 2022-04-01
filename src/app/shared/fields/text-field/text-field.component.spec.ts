import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogOptions, Question, QuestionFieldType } from 'src/models';

import { TextFieldComponent } from './text-field.component';
import { StationService } from 'src/app/core/station.service';
import {
  MockDocumentService,
  MockPopupService,
  MockStationService,
} from 'src/mocks';
import { DocumentService } from 'src/app/core/document.service';
import { PopupService } from 'src/app/core/popup.service';

const FIELDS: Question[] = [
  {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Fake question 1',
    questionType: QuestionFieldType.ShortText,
    isReadOnly: false,
    isRequired: true,
    isPrivate: false,
    children: [],
  },
  {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Fake question 2',
    questionType: QuestionFieldType.LongText,
    isReadOnly: false,
    isRequired: false,
    isPrivate: false,
    children: [],
  },
  {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Fake question 3',
    questionType: QuestionFieldType.URL,
    isReadOnly: false,
    isRequired: false,
    isPrivate: false,
    children: [],
  },
  {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Fake question 4',
    questionType: QuestionFieldType.Email,
    isReadOnly: false,
    isRequired: true,
    isPrivate: false,
    children: [],
  },
  {
    rithmId: '3j4k-3h2j-hj4j',
    prompt: 'Fake question 5',
    questionType: QuestionFieldType.File,
    isReadOnly: false,
    isRequired: false,
    isPrivate: false,
    children: [],
  },
];

describe('TextFieldComponent', () => {
  let component: TextFieldComponent;
  let fixture: ComponentFixture<TextFieldComponent>;
  const formBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextFieldComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        { provide: StationService, useClass: MockStationService },
        { provide: DocumentService, useValue: MockDocumentService },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextFieldComponent);
    component = fixture.componentInstance;
    component.field = FIELDS[1];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the stationQuestion Bsubject ', () => {
    const stationSpy = spyOn(
      TestBed.inject(StationService),
      'updateStationQuestionInTemplate'
    );
    component.updateFieldPrompt();
    expect(stationSpy).toHaveBeenCalledOnceWith(component.field);
  });

  describe('should require fields when is in Station', () => {
    describe('shortText field', () => {
      beforeEach(() => {
        component.field = FIELDS[0];
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should require an input in short text field', () => {
        const shortText = component.textFieldForm.controls['shortText'];
        expect(component.field.questionType).toBeTruthy();
        expect(shortText.valid).toBeFalse();
        expect(shortText.hasError('required')).toBeTrue();
        expect(component.textFieldForm.valid).toBeFalse();
      });
    });

    describe('longText field', () => {
      beforeEach(() => {
        component.field = FIELDS[1];
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should require an input in long text field', () => {
        const longText = component.textFieldForm.controls['longText'];
        expect(component.field.questionType).toBeTruthy();
        expect(longText.valid).toBeFalse();
        expect(longText.hasError('required')).toBeTrue();
        expect(component.textFieldForm.valid).toBeFalse();
      });
    });

    describe('url field', () => {
      beforeEach(() => {
        component.field = FIELDS[2];
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should require an input in url field', () => {
        const url = component.textFieldForm.controls['url'];
        expect(component.field.questionType).toBeTruthy();
        expect(url.valid).toBeFalse();
        expect(url.hasError('required')).toBeTrue();
        expect(component.textFieldForm.valid).toBeFalse();
      });
    });

    describe('email field', () => {
      beforeEach(() => {
        component.field = FIELDS[3];
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should require an input in email field', () => {
        const email = component.textFieldForm.controls['email'];
        expect(component.field.questionType).toBeTruthy();
        expect(email.valid).toBeFalse();
        expect(email.hasError('required')).toBeTrue();
        expect(component.textFieldForm.valid).toBeFalse();
      });
    });
  });

  describe('shortText field when is not a station', () => {
    beforeEach(() => {
      component.field = FIELDS[0];
      component.isStation = false;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should require an input in short text field', () => {
      const shortText = component.textFieldForm.controls['shortText'];
      expect(component.field.questionType).toBeTruthy();
      expect(shortText.valid).toBeFalse();
      expect(shortText.hasError('required')).toBeTrue();
      expect(component.textFieldForm.valid).toBeFalse();
    });
  });

  describe('longText field when is not a station', () => {
    beforeEach(() => {
      component.field = FIELDS[1];
      component.field.isRequired = false;
      component.isStation = false;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not require an input in long text field', () => {
      const longText = component.textFieldForm.controls['longText'];
      expect(longText.valid).toBeTrue();
      expect(longText.hasError('required')).toBeFalse();
      expect(component.textFieldForm.valid).toBeTrue();
    });
  });

  describe('url field when is not a station', () => {
    beforeEach(() => {
      component.field = FIELDS[2];
      component.isStation = false;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not require an input in url field', () => {
      const url = component.textFieldForm.controls['url'];
      expect(url.valid).toBeTrue();
      expect(url.hasError('required')).toBeFalse();
      expect(component.textFieldForm.valid).toBeTrue();
    });

    it('should require a valid url', () => {
      const url = component.textFieldForm.controls['url'];
      url.setValue('test.com');
      expect(url.valid).toBeFalse();
      expect(url.hasError('urlIncorrect')).toBeTrue();
      expect(component.textFieldForm.valid).toBeFalse();
    });
  });

  describe('file field when is not a station', () => {
    beforeEach(() => {
      component.field = FIELDS[4];
      component.isStation = false;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not require an input in file field', () => {
      const file = component.textFieldForm.controls['fileType'];
      expect(file.valid).toBeTrue();
      expect(file.hasError('required')).toBeFalse();
      expect(component.textFieldForm.valid).toBeTrue();
    });
  });

  describe('email field when is not a station', () => {
    beforeEach(() => {
      component.field = FIELDS[3];
      component.isStation = false;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should require an input in email field', () => {
      const email = component.textFieldForm.controls['email'];
      expect(email.valid).toBeFalse();
      expect(email.hasError('required')).toBeTrue();
      expect(component.textFieldForm.valid).toBeFalse();
    });

    it('should require a valid email', () => {
      const email = component.textFieldForm.controls['email'];
      email.setValue('test.com');
      expect(email.valid).toBeFalse();
      expect(email.hasError('email')).toBeTrue();
      expect(component.textFieldForm.valid).toBeFalse();
    });
  });

  it('should open a confirmation pop up on click of delete station field', async () => {
    const dialogExpectData: DialogOptions = {
      title: 'Remove Field',
      message: `Are you sure you want to remove this field?`,
      okButtonText: 'Remove',
      cancelButtonText: 'Close',
      important: true,
    };
    const popupSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();
    await component.removeFieldStation(component.field);
    expect(popupSpy).toHaveBeenCalledOnceWith(dialogExpectData);
  });

  it('should call function that remove field of station', () => {
    const removeFieldSpy = spyOn(component, 'removeField').and.callThrough();
    component.removeField(component.field);
    expect(removeFieldSpy).toHaveBeenCalledOnceWith(component.field);
  });
});
