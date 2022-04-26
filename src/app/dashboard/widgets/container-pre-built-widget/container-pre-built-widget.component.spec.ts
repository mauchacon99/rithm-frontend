import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { throwError } from 'rxjs';
import { MatSortModule } from '@angular/material/sort';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { MockErrorService, MockDocumentService } from 'src/mocks';
import { LoadingWidgetComponent } from 'src/app/dashboard/widgets/loading-widget/loading-widget.component';

import { ContainerPreBuiltWidgetComponent } from './container-pre-built-widget.component';
import { ErrorWidgetComponent } from 'src/app/dashboard/widgets/error-widget/error-widget.component';
import { RosterModule } from 'src/app/shared/roster/roster.module';
import { DocumentComponent } from 'src/app/document/document/document.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ContainerPreBuiltWidgetComponent', () => {
  let component: ContainerPreBuiltWidgetComponent;
  let fixture: ComponentFixture<ContainerPreBuiltWidgetComponent>;
  let errorService: ErrorService;
  let documentService: DocumentService;

  const containers = [
    {
      flowedTimeUTC: '2022-04-05T17:24:01.0115021',
      nameContainer: 'Container name',
      containerRithmId: '1365442c-82d6-4035-893w-86ga9de5a7e3',
      stationName: 'Station name',
      stationRithmId: '3813442c-82c6-4035-893a-86fa9deca7c3',
      stationOwners: [
        {
          rithmId: '4813442c-12c6-4021-673a-86fa9deca7c9',
          firstName: 'Testy',
          lastName: 'Testy',
          email: 'Testy@Rithm.com',
        },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ContainerPreBuiltWidgetComponent,
        MockComponent(LoadingWidgetComponent),
        MockComponent(ErrorWidgetComponent),
        MockComponent(DocumentComponent),
      ],
      imports: [
        RosterModule,
        MatSortModule,
        MatTableModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DocumentService, useClass: MockDocumentService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    errorService = TestBed.inject(ErrorService);
    documentService = TestBed.inject(DocumentService);
    fixture = TestBed.createComponent(ContainerPreBuiltWidgetComponent);
    component = fixture.componentInstance;
    component.containers = containers;
    component.dataSourceTable = new MatTableDataSource(containers);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getContainerWidgetPreBuilt', () => {
    const spyGetContainerWidgetPreBuilt = spyOn(
      documentService,
      'getContainerWidgetPreBuilt'
    ).and.callThrough();

    const spyMethod = spyOn(
      component,
      'getContainerWidgetPreBuilt'
    ).and.callThrough();

    component.ngOnInit();
    expect(spyGetContainerWidgetPreBuilt).toHaveBeenCalled();
    expect(spyMethod).toHaveBeenCalled();
  });

  it('should catch an error if the request getContainerWidgetPreBuilt fails', () => {
    const spyError = spyOn(
      documentService,
      'getContainerWidgetPreBuilt'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.ngOnInit();
    expect(spyError).toHaveBeenCalled();
  });

  it('should show loading while get containers', () => {
    const spyMethod = spyOn(
      component,
      'getContainerWidgetPreBuilt'
    ).and.callThrough();

    component.ngOnInit();
    expect(spyMethod).toHaveBeenCalled();

    const loading = fixture.nativeElement.querySelector(
      '#app-loading-indicator-container-pre-built'
    );
    expect(loading).toBeTruthy();
  });

  it('should show message error and try again', () => {
    const spyMethod = spyOn(
      component,
      'getContainerWidgetPreBuilt'
    ).and.callThrough();

    const spyError = spyOn(
      documentService,
      'getContainerWidgetPreBuilt'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyMethodError = spyOn(errorService, 'logError').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    const errorComponent = fixture.nativeElement.querySelector(
      '#error-load-widget-container-pre-built'
    );
    expect(errorComponent).toBeTruthy();
    expect(spyMethodError).toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
    expect(spyMethod).toHaveBeenCalled();
  });

  it('should return the time in a string', () => {
    const time = component.getElapsedTime(
      component.containers[0].flowedTimeUTC
    );
    expect(time).toBeTruthy();
  });

  describe('Display detail of the document', () => {
    it('should expand widget', () => {
      component.isExpandWidget = false;
      component.failedGetContainers = false;
      component.isDocument = true;
      component.isLoading = false;
      fixture.detectChanges();
      component.expandWidget.subscribe((isExpandWidget) => {
        expect(isExpandWidget).toBeTrue();
      });

      const btnExpandWidget =
        fixture.debugElement.nativeElement.querySelector('#expand-document');
      expect(btnExpandWidget).toBeTruthy();
      btnExpandWidget.click();
    });

    it('should show detail of the document', () => {
      const spyMethod = spyOn(component, 'viewDocument').and.callThrough();
      component.isLoading = false;
      component.viewDocument(component.containers[0]);
      fixture.detectChanges();
      const documentDetail =
        fixture.debugElement.nativeElement.querySelector('#document-detail');
      const showDocs =
        fixture.debugElement.nativeElement.querySelector('#show-docs');

      expect(documentDetail).toBeTruthy();
      expect(showDocs).toBeNull();
      expect(component.documentSelected).toBe(component.containers[0]);
      expect(spyMethod).toHaveBeenCalledWith(component.containers[0]);
    });

    it('should return of list the documents', () => {
      const spyMethodViewDocument = spyOn(
        component,
        'viewDocument'
      ).and.callThrough();
      const spyMethodToggleExpandWidget = spyOn(
        component,
        'toggleExpandWidget'
      ).and.callThrough();
      component.failedGetContainers = false;
      component.isDocument = true;
      component.isLoading = false;
      component.isExpandWidget = true;
      fixture.detectChanges();

      const btnReturnDocuments =
        fixture.debugElement.nativeElement.querySelector(
          '#return-list-documents'
        );
      btnReturnDocuments.disabled = false;
      btnReturnDocuments.click();

      component.failedGetContainers = false;
      component.isLoading = false;
      fixture.detectChanges();

      const documentDetail =
        fixture.debugElement.nativeElement.querySelector('#document-detail');
      const showDocs =
        fixture.debugElement.nativeElement.querySelector('#show-containers');

      expect(documentDetail).toBeNull();
      expect(showDocs).toBeTruthy();
      expect(component.documentSelected).toBe(null);
      expect(spyMethodViewDocument).toHaveBeenCalledOnceWith(null);
      expect(spyMethodToggleExpandWidget).toHaveBeenCalled();
    });
  });

  it('should be reloadDocumentList true when call widgetReloadListDocuments', () => {
    component.widgetReloadListDocuments(false, true);
    expect(component.reloadDocumentList).toBeTrue();
  });

  it('should return list of documents and reload list', () => {
    const spyMethod = spyOn(component, 'viewDocument').and.callThrough();
    component.widgetReloadListDocuments(true, false);
    expect(component.reloadDocumentList).toBeFalse();
    expect(spyMethod).toHaveBeenCalledOnceWith(null, true);
  });
});
