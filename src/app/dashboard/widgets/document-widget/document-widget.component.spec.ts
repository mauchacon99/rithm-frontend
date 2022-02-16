import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { MockDocumentService, MockErrorService } from 'src/mocks';

import { DocumentWidgetComponent } from './document-widget.component';
import { DocumentService } from 'src/app/core/document.service';

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
        { provide: DocumentService, useClass: MockDocumentService },
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

  it('should show error if the request getDocumentWidget fail', () => {
    const deleteCompanyDashboard = spyOn(
      TestBed.inject(DocumentService),
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
      TestBed.inject(DocumentService),
      'getDocumentWidget'
    ).and.callThrough();
    component.getDocumentWidget();
    expect(spyDocumentWidget).toHaveBeenCalledOnceWith(
      component.documentRithmId
    );
  });
});
