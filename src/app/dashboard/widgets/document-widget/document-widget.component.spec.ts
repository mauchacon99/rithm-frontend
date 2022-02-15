import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { MockDashboardService, MockErrorService } from 'src/mocks';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

import { DocumentWidgetComponent } from './document-widget.component';
import { MockComponent } from 'ng-mocks';
import { LoadingWidgetComponent } from 'src/app/dashboard/widgets/loading-widget/loading-widget.component';

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
      ],
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

    expect(methodGetDocumentWidget).toHaveBeenCalledOnceWith(
      component.documentRithmId
    );
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

    expect(deleteCompanyDashboard).toHaveBeenCalledOnceWith(
      component.documentRithmId
    );
    expect(spyError).toHaveBeenCalled();
  });

  it('should call method getDocumentWidget', () => {
    const spyDocumentWidget = spyOn(
      TestBed.inject(DashboardService),
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
});
