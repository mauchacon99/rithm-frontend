import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { MockDashboardService, MockErrorService } from 'src/mocks';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

import { DocumentWidgetComponent } from './document-widget.component';
import { QuestionFieldType } from 'src/models';

describe('DocumentWidgetComponent', () => {
  let component: DocumentWidgetComponent;
  let fixture: ComponentFixture<DocumentWidgetComponent>;
  const documentRithmId =
    '{"documentRithmId":"8263330A-BCAA-40DB-8C06-D4C111D5C9DA"}';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentWidgetComponent],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DashboardService, useClass: MockDashboardService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentWidgetComponent);
    component = fixture.componentInstance;
    component.documentRithmId = documentRithmId;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call method getDocumentWidget', () => {
    const methodGetDocumentWidget = spyOn(
      TestBed.inject(DashboardService),
      'getDocumentWidget'
    ).and.callThrough();

    component.getDocumentWidget();

    expect(methodGetDocumentWidget).toHaveBeenCalled();
  });

  it('should show error if the request getDocumentWidget fail', () => {
    const deleteCompanyDashboard = spyOn(
      TestBed.inject(DashboardService),
      'getDocumentWidget'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();

    component.getDocumentWidget();

    expect(deleteCompanyDashboard).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  it('should call method getDocumentWidget', () => {
    const spyDocumentWidget = spyOn(
      TestBed.inject(DashboardService),
      'getDocumentWidget'
    ).and.callThrough();
    component.getDocumentWidget();
    expect(spyDocumentWidget).toHaveBeenCalled();
  });

  it("should get true isEmptyQuestions, if questions don't have value", () => {
    component.dataDocumentWidget = {
      documentName: 'Untitled Dashboard',
      documentRithmId: 'CDB317AA-A5FE-431D-B003-784A578B3FC2',
      questions: [
        {
          rithmId: '',
          prompt: 'Instructions',
          questionType: QuestionFieldType.Instructions,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
          value: '',
        },
      ],
    };
    expect(component.isEmptyQuestions).toBeTrue();
  });

  it('should get false isEmptyQuestions, if questions have some value', () => {
    component.dataDocumentWidget = {
      documentName: 'Untitled Dashboard',
      documentRithmId: 'CDB317AA-A5FE-431D-B003-784A578B3FC2',
      questions: [
        {
          rithmId: '',
          prompt: 'Instructions',
          questionType: QuestionFieldType.Instructions,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
          value: 'Some value.',
        },
      ],
    };
    expect(component.isEmptyQuestions).toBeFalse();
  });
});
