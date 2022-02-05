import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import {
  MockDocumentService,
  MockErrorService,
  MockPopupService,
} from 'src/mocks';
import { DocumentGenerationStatus, StationWidgetData } from 'src/models';
import { StationWidgetComponent } from './station-widget.component';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { MockComponent } from 'ng-mocks';
import { UserAvatarComponent } from 'src/app/shared/user-avatar/user-avatar.component';
import { DocumentComponent } from 'src/app/document/document/document.component';
import { PopupService } from 'src/app/core/popup.service';

describe('StationWidgetComponent', () => {
  let component: StationWidgetComponent;
  let fixture: ComponentFixture<StationWidgetComponent>;
  const stationRithmId =
    '{"stationRithmId":"247cf568-27a4-4968-9338-046ccfee24f3"}';
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationWidgetComponent,
        MockComponent(LoadingIndicatorComponent),
        MockComponent(UserAvatarComponent),
        MockComponent(DocumentComponent),
      ],
      providers: [
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: PopupService, useClass: MockPopupService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationWidgetComponent);
    component = fixture.componentInstance;
    component.stationRithmId = stationRithmId;
    component.dataStationWidget = {
      stationName: 'Station Name',
      documentGeneratorStatus: DocumentGenerationStatus.Manual,
      documents: [
        {
          rithmId: '123-123-',
          name: 'Document Name',
          priority: 0,
          lastUpdatedUTC: '2022-01-17T15:03:26.371Z',
          flowedTimeUTC: '2022-01-17T15:03:26.371Z',
          assignedUser: {
            rithmId: 'string',
            firstName: 'string',
            lastName: 'string',
            email: 'string',
            isAssigned: true,
          },
        },
      ],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service that return station widget data', () => {
    const spyService = spyOn(
      TestBed.inject(DocumentService),
      'getStationWidgetDocuments'
    ).and.callThrough();
    component.stationRithmId = stationRithmId;
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith(component.stationRithmId);
  });

  it('should show error message when request station widget document  data', () => {
    spyOn(
      TestBed.inject(DocumentService),
      'getStationWidgetDocuments'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyService = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component.stationRithmId = stationRithmId;
    component.ngOnInit();
    expect(spyService).toHaveBeenCalled();
  });

  it('should try request again  listing documents if fails', () => {
    component.failedLoadWidget = true;
    fixture.detectChanges();

    const card =
      fixture.debugElement.nativeElement.querySelector('#card-error');
    expect(card).toBeTruthy();

    const methodCalled = spyOn(component, 'getStationWidgetDocuments');
    const tryAgain =
      fixture.debugElement.nativeElement.querySelector('#try-again');
    expect(tryAgain).toBeTruthy();
    tryAgain.click();
    expect(methodCalled).toHaveBeenCalled();
  });

  it('should show button if station is manual', () => {
    component.stationRithmId = stationRithmId;
    const dataWidgetStation: StationWidgetData = {
      stationName: 'Dev1',
      documentGeneratorStatus: DocumentGenerationStatus.Manual,
      documents: [
        {
          rithmId: '123-123-123',
          name: 'Granola',
          priority: 1,
          flowedTimeUTC: '2022-01-13T16:43:57.901Z',
          lastUpdatedUTC: '2022-01-13T16:43:57.901Z',
          assignedUser: {
            rithmId: '123-123-123',
            firstName: 'Pedro',
            lastName: 'Jeria',
            email: 'pablo@mundo.com',
            isAssigned: true,
          },
        },
      ],
    };

    spyOn(
      TestBed.inject(DocumentService),
      'getStationWidgetDocuments'
    ).and.returnValue(of(dataWidgetStation));

    component.ngOnInit();
    fixture.detectChanges();
    expect(component.dataStationWidget.documentGeneratorStatus).toBe(
      DocumentGenerationStatus.Manual
    );
    const button = fixture.debugElement.nativeElement.querySelector(
      '#create-new-document'
    );
    expect(button).toBeTruthy();
  });

  it('should no show button if station is different to manual', () => {
    component.stationRithmId = stationRithmId;
    const dataWidgetStation: StationWidgetData = {
      stationName: 'Dev1',
      documentGeneratorStatus: DocumentGenerationStatus.None,
      documents: [
        {
          rithmId: '123-123-123',
          name: 'Granola',
          priority: 1,
          flowedTimeUTC: '2022-01-13T16:43:57.901Z',
          lastUpdatedUTC: '2022-01-13T16:43:57.901Z',
          assignedUser: {
            rithmId: '123-123-123',
            firstName: 'Pedro',
            lastName: 'Jeria',
            email: 'pablo@mundo.com',
            isAssigned: true,
          },
        },
      ],
    };

    spyOn(
      TestBed.inject(DocumentService),
      'getStationWidgetDocuments'
    ).and.returnValue(of(dataWidgetStation));

    component.ngOnInit();
    fixture.detectChanges();
    expect(component.dataStationWidget.documentGeneratorStatus).not.toBe(
      DocumentGenerationStatus.Manual
    );
    const button = fixture.debugElement.nativeElement.querySelector(
      '#create-new-document'
    );
    expect(button).toBeFalsy();
  });
  it('should create new document on widget', () => {
    const expectDocumentRithmId = '22671B47-D338-4D8F-A8D2-59AC48196FF1';
    component.isLoading = false;
    fixture.detectChanges();
    const spyMethodComponent = spyOn(
      component,
      'createNewDocument'
    ).and.callThrough();
    const spyMethodService = spyOn(
      TestBed.inject(DocumentService),
      'createNewDocument'
    ).and.returnValue(of(expectDocumentRithmId));

    const notifyMethodService = spyOn(
      TestBed.inject(PopupService),
      'notify'
    ).and.callThrough();

    const buttonNewDocument = fixture.debugElement.nativeElement.querySelector(
      '#create-new-document'
    );
    expect(buttonNewDocument).toBeTruthy();
    buttonNewDocument.click();
    expect(spyMethodComponent).toHaveBeenCalled();
    expect(component.documentIdSelected).toBe(expectDocumentRithmId);
    expect(component.isDocument).toBeTrue();
    expect(spyMethodService).toHaveBeenCalledWith(
      '',
      0,
      component.stationRithmId
    );
    expect(notifyMethodService).toHaveBeenCalled();
  });

  describe('Loading documents', () => {
    it('should be to show loading-indicator', () => {
      component.isLoading = true;
      fixture.detectChanges();
      const loadingDocs =
        fixture.debugElement.nativeElement.querySelector('#loading-docs');
      const showDocs =
        fixture.debugElement.nativeElement.querySelector('#show-docs');
      const loadingIndicator = fixture.debugElement.nativeElement.querySelector(
        'app-loading-indicator'
      );

      expect(loadingDocs).toBeTruthy();
      expect(loadingIndicator).toBeTruthy();
      expect(showDocs).toBeNull();
    });

    it('should not be to show loading-indicator', () => {
      component.isLoading = false;
      fixture.detectChanges();
      const loadingDocs =
        fixture.debugElement.nativeElement.querySelector('#loading-docs');
      const showDocs =
        fixture.debugElement.nativeElement.querySelector('#show-docs');
      const loadingIndicator = fixture.debugElement.nativeElement.querySelector(
        'app-loading-indicator'
      );

      expect(loadingDocs).toBeNull();
      expect(loadingIndicator).toBeNull();
      expect(showDocs).toBeTruthy();
    });
  });

  it('should return the time in a string', () => {
    const time = component.getElapsedTime(
      component.dataStationWidget.documents[0].flowedTimeUTC
    );
    expect(time).toBeTruthy();
  });

  describe('Display detail of the document', () => {
    it('should show detail of the document', () => {
      const spyMethod = spyOn(component, 'viewDocument').and.callThrough();
      component.isLoading = false;
      fixture.detectChanges();
      const btnDisplayDocument =
        fixture.debugElement.nativeElement.querySelector(
          '#show-document-widget'
        );
      btnDisplayDocument.click();
      fixture.detectChanges();
      const documentDetail =
        fixture.debugElement.nativeElement.querySelector('#document-detail');
      const showDocs =
        fixture.debugElement.nativeElement.querySelector('#show-docs');

      expect(documentDetail).toBeTruthy();
      expect(showDocs).toBeNull();
      expect(component.documentIdSelected).toBe(
        component.dataStationWidget.documents[0].rithmId
      );
      expect(spyMethod).toHaveBeenCalledWith(
        component.dataStationWidget.documents[0].rithmId
      );
    });

    it('should return of list the documents', () => {
      const spyMethod = spyOn(component, 'viewDocument').and.callThrough();
      component.isDocument = true;
      component.isLoading = false;
      fixture.detectChanges();
      const btnReturnDocuments =
        fixture.debugElement.nativeElement.querySelector(
          '#return-list-documents'
        );
      btnReturnDocuments.click();
      fixture.detectChanges();
      const documentDetail =
        fixture.debugElement.nativeElement.querySelector('#document-detail');
      const showDocs =
        fixture.debugElement.nativeElement.querySelector('#show-docs');

      expect(documentDetail).toBeNull();
      expect(showDocs).toBeTruthy();
      expect(component.documentIdSelected).toBe('');
      expect(spyMethod).toHaveBeenCalledWith('');
    });
  });
});
