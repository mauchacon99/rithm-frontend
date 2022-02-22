import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { MockDocumentService, MockErrorService } from 'src/mocks';

import { DocumentWidgetComponent } from './document-widget.component';
import { DocumentService } from 'src/app/core/document.service';
import { MockComponent } from 'ng-mocks';
import { LoadingWidgetComponent } from 'src/app/dashboard/widgets/loading-widget/loading-widget.component';
import { ErrorWidgetComponent } from 'src/app/dashboard/widgets/error-widget/error-widget.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

describe('DocumentWidgetComponent', () => {
  let component: DocumentWidgetComponent;
  let fixture: ComponentFixture<DocumentWidgetComponent>;
  const documentRithmId =
    '{"documentRithmId":"8263330A-BCAA-40DB-8C06-D4C111D5C9DA"}';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocumentWidgetComponent,
        MockComponent(LoadingWidgetComponent),
        MockComponent(ErrorWidgetComponent),
      ],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DocumentService, useClass: MockDocumentService },
      ],
      imports: [MatMenuModule, RouterTestingModule],
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
      TestBed.inject(DocumentService),
      'getDocumentWidget'
    ).and.callThrough();

    component.getDocumentWidget();

    expect(methodGetDocumentWidget).toHaveBeenCalledOnceWith(
      component.documentRithmId
    );
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

    expect(deleteCompanyDashboard).toHaveBeenCalledOnceWith(
      component.documentRithmId
    );
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

  it('should rendered component loading for widget', () => {
    component.isLoading = true;
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();
    const loadingIndicator = fixture.debugElement.nativeElement.querySelector(
      '#app-loading-indicator'
    );
    expect(loadingIndicator).toBeTruthy();
  });

  it('should show error-widget in document-widget', () => {
    component.failedLoadWidget = true;
    fixture.detectChanges();
    const errorWidget =
      fixture.debugElement.nativeElement.querySelector('#error-load-widget');
    expect(errorWidget).toBeTruthy();
  });

  it('should redirect to document page', () => {
    component.dataDocumentWidget = {
      documentName: 'Untitled Document',
      documentRithmId: JSON.parse(documentRithmId).documentRithmId,
      questions: [],
      stations: [
        {
          stationRithmId: '431D-B003-784A578B3FC2-CDB317AA-A5FE',
          stationName: 'New station',
        },
      ],
    };
    component.isLoading = false;
    component.failedLoadWidget = false;
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector(
      '#go-to-document-page-single'
    );
    const navigateSpy = spyOn(component, 'goToDocument').and.callThrough();
    const spyRoute = spyOn(
      TestBed.inject(Router),
      'navigate'
    ).and.callThrough();
    expect(button).toBeTruthy();
    button.click(component.dataDocumentWidget.stations[0].stationRithmId);
    expect(navigateSpy).toHaveBeenCalled();
    expect(spyRoute).toHaveBeenCalledOnceWith(
      ['/', 'document', JSON.parse(documentRithmId).documentRithmId],
      {
        queryParams: {
          documentId: JSON.parse(documentRithmId).documentRithmId,
          stationId: component.dataDocumentWidget.stations[0].stationRithmId,
        },
      }
    );
  });
});
