import { ComponentFixture, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import {
  MockDocumentService,
  MockErrorService,
  MockSplitService,
  MockUserService,
} from 'src/mocks';
import { DocumentWidgetComponent } from './document-widget.component';
import { DocumentService } from 'src/app/core/document.service';
import { MockComponent } from 'ng-mocks';
import { LoadingWidgetComponent } from 'src/app/dashboard/widgets/loading-widget/loading-widget.component';
import { ErrorWidgetComponent } from 'src/app/dashboard/widgets/error-widget/error-widget.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { SplitService } from 'src/app/core/split.service';
import { UserService } from 'src/app/core/user.service';

describe('DocumentWidgetComponent', () => {
  let component: DocumentWidgetComponent;
  let fixture: ComponentFixture<DocumentWidgetComponent>;
  const dataWidget =
    '{"documentRithmId":"8263330A-BCAA-40DB-8C06-D4C111D5C9DA","columns":[{"name":"Test","questionId":"45454-54545-45454"}]}';
  const documentRithmId = '8263330A-BCAA-40DB-8C06-D4C111D5C9DA';

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
        { provide: UserService, useClass: MockUserService },
        { provide: SplitService, useClass: MockSplitService },
      ],
      imports: [MatMenuModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentWidgetComponent);
    component = fixture.componentInstance;
    component.dataWidget = dataWidget;
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
      documentRithmId,
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
      ['/', 'document', documentRithmId],
      {
        queryParams: {
          documentId: documentRithmId,
          stationId: component.dataDocumentWidget.stations[0].stationRithmId,
        },
      }
    );
  });

  it('should show a gear icon in edit mode', () => {
    component.showButtonSetting = true;
    component.dataDocumentWidget = {
      documentName: 'Untitled Document',
      documentRithmId,
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
    component.editMode = true;
    fixture.detectChanges();
    const gearIcon = fixture.debugElement.nativeElement.querySelector(
      '#gear-icon-document'
    );
    expect(gearIcon).toBeTruthy();
  });

  describe('Testing sidenavDrawerService', () => {
    let sidenavDrawer: SidenavDrawerService;
    beforeEach(() => {
      sidenavDrawer = TestBed.inject(SidenavDrawerService);
    });

    it('should receive the drawer context for the component', () => {
      expect(component.drawerContext).not.toBe('stationWidget');
      sidenavDrawer.drawerContext$.next('stationWidget');
      sidenavDrawer.drawerContext$.subscribe((data) => {
        expect(component.drawerContext).toBe(data);
      });
    });

    it('should click edit button and emit toggleDrawer', () => {
      component.isLoading = false;
      component.failedLoadWidget = false;
      component.editMode = true;
      component.showButtonSetting = true;

      component.dataDocumentWidget = {
        documentName: 'Untitled Document',
        documentRithmId,
        questions: [],
        stations: [
          {
            stationRithmId: '431D-B003-784A578B3FC2-CDB317AA-A5FE',
            stationName: 'New station',
          },
        ],
      };

      fixture.detectChanges();
      spyOn(component.toggleDrawer, 'emit');
      spyOn(component, 'toggleEditDocument').and.callThrough();

      const btnEdit = fixture.debugElement.nativeElement.querySelector(
        '#toggle-edit-document'
      );

      expect(btnEdit).toBeTruthy();
      btnEdit.disabled = false;
      btnEdit.click();
      expect(component.toggleEditDocument).toHaveBeenCalled();
      expect(component.toggleDrawer.emit).toHaveBeenCalled();
    });
  });

  it('should be parse dataWidget', () => {
    const expectDataWidget = JSON.parse(dataWidget);
    component['parseDataColumnsWidget']();
    expect(component.documentRithmId).toEqual(expectDataWidget.documentRithmId);
    expect(component.documentColumns).toEqual(expectDataWidget.columns);
  });

  it('should call split service', () => {
    spyOn(TestBed.inject(SplitService), 'initSdk').and.callThrough();
    const splitConfigWidgets = spyOn(
      TestBed.inject(SplitService),
      'getConfigWidgetsTreatment'
    ).and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector(
      '#toggle-edit-document'
    );
    component.ngOnInit();
    expect(button).toBeNull();
    component['split']();
    expect(button).toBeDefined();
    expect(splitConfigWidgets).toHaveBeenCalled();
  });
});
