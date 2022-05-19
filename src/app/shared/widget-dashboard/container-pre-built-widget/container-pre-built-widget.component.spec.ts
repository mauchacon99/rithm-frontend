import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { throwError } from 'rxjs';
import { MatSortModule } from '@angular/material/sort';
import { DocumentService } from 'src/app/core/document.service';
import { MockDocumentService } from 'src/mocks';

import { ContainerPreBuiltWidgetComponent } from './container-pre-built-widget.component';
import { RosterModule } from 'src/app/shared/roster/roster.module';
import { DocumentComponent } from 'src/app/document/document/document.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { ContainerWidgetPreBuilt } from 'src/models';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingWidgetComponent } from 'src/app/shared/widget-dashboard/loading-widget/loading-widget.component';
import { ErrorWidgetComponent } from 'src/app/shared/widget-dashboard/error-widget/error-widget.component';

describe('ContainerPreBuiltWidgetComponent', () => {
  let component: ContainerPreBuiltWidgetComponent;
  let fixture: ComponentFixture<ContainerPreBuiltWidgetComponent>;
  let documentService: DocumentService;
  let sidenavDrawerService: SidenavDrawerService;
  const containers: ContainerWidgetPreBuilt[] = [
    {
      documentRithmId: '3265442c-82d6-4035-893w-86ga9de5a7e3',
      documentName: 'Document name 2',
      stationRithmId: '3813442c-82c6-4035-893a-86fa9deca7c3',
      stationName: 'Station name 2',
      timeInStation: '2022-05-02T23:38:03.183Z',
      stationOwners: [],
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
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    documentService = TestBed.inject(DocumentService);
    sidenavDrawerService = TestBed.inject(SidenavDrawerService);
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
    component.ngOnInit();
    fixture.detectChanges();
    const errorComponent = fixture.nativeElement.querySelector(
      '#error-load-widget-container-pre-built'
    );
    expect(errorComponent).toBeTruthy();
    expect(spyError).toHaveBeenCalled();
    expect(spyMethod).toHaveBeenCalled();
  });

  it('should return the time in a string', () => {
    const time = component.getElapsedTime(
      component.containers[0].timeInStation
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
    component.widgetReloadListDocuments(false, true, []);
    expect(component.reloadDocumentList).toBeTrue();
  });

  it('should return list of documents and reload list', () => {
    const spyMethod = spyOn(component, 'viewDocument').and.callThrough();
    component.widgetReloadListDocuments(true, false, []);
    expect(component.reloadDocumentList).toBeFalse();
    expect(spyMethod).toHaveBeenCalledOnceWith(null, true);
  });

  it('should call and emit toggleDrawer', () => {
    component.isLoading = false;
    component.failedGetContainers = false;
    component.editMode = true;
    component.showButtonSetting = true;
    spyOn(component.toggleDrawer, 'emit');
    spyOn(component, 'toggleEditStation').and.callThrough();
    component.toggleEditStation();
    expect(component.toggleEditStation).toHaveBeenCalled();
    expect(component.toggleDrawer.emit).toHaveBeenCalled();
  });

  it('should call drawer context and compare this context', () => {
    const drawerContext = 'widgetDashboard';
    const spySidenavDrawer = spyOn(
      sidenavDrawerService.drawerContext$,
      'next'
    ).and.callThrough();
    sidenavDrawerService.drawerContext$.next(drawerContext);
    component.ngOnInit();
    expect(component.drawerContext).toBe(drawerContext);
    expect(spySidenavDrawer).toHaveBeenCalled();
  });

  it('should obtain value in isDrawerOpen in sidenavDrawerService', () => {
    const spyMethod = spyOnProperty(
      sidenavDrawerService,
      'isDrawerOpen'
    ).and.returnValue(true);
    component.isDrawerOpen;
    expect(spyMethod).toHaveBeenCalled();
    expect(component.isDrawerOpen).toBeTrue();
  });

  it('should emit reloadStationsFlow', () => {
    component.documentSelected = component.containers[0];
    const stationFlow = ['123-456-789'];
    const spyEmit = spyOn(
      component.reloadStationsFlow,
      'emit'
    ).and.callThrough();

    component.widgetReloadListDocuments(true, true, stationFlow);

    expect(spyEmit).toHaveBeenCalledOnceWith({
      stationFlow,
      currentStation: component.documentSelected.stationRithmId,
      documentFlow: component.documentSelected.documentRithmId,
    });
  });

  it('should call getContainerWidgetPreBuilt when stationFlow change', () => {
    const spyMethod = spyOn(
      component,
      'getContainerWidgetPreBuilt'
    ).and.callThrough();
    component.isDocument = false;
    component.stationFlow = {
      stationFlow: ['123-456-789'],
      currentStation: '222-222-222',
      documentFlow: containers[0].documentRithmId,
    };
    expect(spyMethod).toHaveBeenCalled();
  });

  it('should set reloadDocumentList to true when stationFlow change', () => {
    component.reloadDocumentList = false;
    component.isDocument = true;
    component.documentSelected = {
      documentRithmId: '123-456-789',
      documentName: 'Document name 2',
      stationRithmId: '3813442c-82c6-4035-893a-86fa9deca7c3',
      stationName: 'Station name 2',
      timeInStation: '2022-05-02T23:38:03.183Z',
      stationOwners: [],
    };
    component.stationFlow = {
      stationFlow: ['123-456-789'],
      currentStation: '222-222-222',
      documentFlow: containers[0].documentRithmId,
    };
    expect(component.reloadDocumentList).toBeTrue();
  });

  it('should call viewDocument when stationFlow change and its the same document', () => {
    const spyMethod = spyOn(component, 'viewDocument').and.callThrough();
    component.isDocument = true;
    component.documentSelected = containers[0];
    component.stationFlow = {
      stationFlow: ['123-456-789'],
      currentStation: '222-222-222',
      documentFlow: containers[0].documentRithmId,
    };
    expect(spyMethod).toHaveBeenCalledOnceWith(null, true);
  });

  it("should catch error when user don't have permissions", () => {
    spyOn(documentService, 'getContainerWidgetPreBuilt').and.returnValue(
      throwError(() => {
        throw new HttpErrorResponse({ error: 'any error', status: 403 });
      })
    );

    component.getContainerWidgetPreBuilt();

    expect(component.permissionError).toBeFalse();
  });

  it('should catch error when the widget has been deleted', () => {
    spyOn(documentService, 'getContainerWidgetPreBuilt').and.returnValue(
      throwError(() => {
        throw new HttpErrorResponse({ error: 'any error', status: 400 });
      })
    );

    component.getContainerWidgetPreBuilt();

    expect(component.widgetDeleted).toBeTrue();
  });

  it('should call removeWidget', () => {
    const spyDeteleWidget = spyOn(
      component.deleteWidget,
      'emit'
    ).and.callThrough();
    const spyDrawer = spyOn(component.toggleDrawer, 'emit').and.callThrough();
    component.removeWidget();
    expect(spyDeteleWidget).toHaveBeenCalled();
    expect(spyDrawer).toHaveBeenCalledOnceWith(0);
  });
});
