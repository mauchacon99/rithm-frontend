import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PopupService } from 'src/app/core/popup.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { StationService } from 'src/app/core/station.service';
import { MockStationService, MockPopupService } from 'src/mocks';
import { Question, QuestionFieldType } from 'src/models';

import { SettingFieldsComponent } from './setting-fields.component';

describe('SettingFieldsComponent', () => {
  let component: SettingFieldsComponent;
  let fixture: ComponentFixture<SettingFieldsComponent>;
  let service: StationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingFieldsComponent],
      imports: [
        MatInputModule,
        NoopAnimationsModule,
        FormsModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
        { provide: StationService, useClass: MockStationService },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
    service = TestBed.inject(StationService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingFieldsComponent);
    component = fixture.componentInstance;
    component.field = {
      prompt: 'Fake question 1',
      rithmId: '3j4k-3h2j-hj4j',
      questionType: QuestionFieldType.ShortText,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the question title to stationQuestionTitle observable', () => {
    component.setQuestionTitle();
    service.stationQuestionTitle$.subscribe((response) => {
      expect(response).toBe(component.field);
    });
  });

  it('should return false the method that modify isPrevious', () => {
    const spyProperty = spyOnProperty(
      component,
      'isPrevious',
      'get'
    ).and.returnValue(false);
    fixture.detectChanges();
    expect(spyProperty).toHaveBeenCalled();
  });

  it('should set isRequired as false due to isReadOnly is false (isPrevious only).', () => {
    component.field.isReadOnly = false;
    const setReadOnlySpy = spyOn(
      component,
      'setReadOnlyFalse'
    ).and.callThrough();
    component.setReadOnlyFalse();
    expect(setReadOnlySpy).toHaveBeenCalledOnceWith();
  });

  it('should display a confirmation Popup for delete filed', async () => {
    const questions: Question[] = [
      {
        prompt: 'Fake question 1',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
      {
        prompt: 'Fake question 2',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
    ];
    const deleteConfirmPopup = {
      title: '',
      message: 'Are you sure you want to delete this field?',
      okButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      important: true,
    };
    const popUpConfirmSpy = spyOn(
      TestBed.inject(PopupService),
      'confirm'
    ).and.callThrough();
    await component.deleteQuestion(questions[0]);
    expect(popUpConfirmSpy).toHaveBeenCalledOnceWith(deleteConfirmPopup);
    service.deleteStationQuestion$.subscribe((response) => {
      expect(response).toEqual(questions[0]);
    });
  });
});
