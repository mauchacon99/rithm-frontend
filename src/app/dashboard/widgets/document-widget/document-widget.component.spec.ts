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
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import {
  DashboardItem,
  DocumentWidget,
  Question,
  QuestionFieldType,
  WidgetType,
} from 'src/models';

describe('DocumentWidgetComponent', () => {
  let component: DocumentWidgetComponent;
  let fixture: ComponentFixture<DocumentWidgetComponent>;
  let errorService: ErrorService;
  let documentService: DocumentService;
  const dataWidget =
    '{"documentRithmId":"8263330A-BCAA-40DB-8C06-D4C111D5C9DA","columns":[{"name":"Test","questionId":"45454-54545-45454"}]}';
  const documentRithmId = '8263330A-BCAA-40DB-8C06-D4C111D5C9DA';

  const widgetItem: DashboardItem = {
    rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
    cols: 4,
    rows: 1,
    x: 0,
    y: 0,
    widgetType: WidgetType.Document,
    data: '{"documentRithmId":"247cf568-27a4-4968-9338-046ccfee24f3","columns":[]}',
    minItemCols: 4,
    minItemRows: 4,
    maxItemCols: 12,
    maxItemRows: 12,
  };

  const questions: Question[] = [
    {
      rithmId: '',
      questionType: QuestionFieldType.CheckList,
      prompt: 'checklist',
      isPrivate: true,
      isEncrypted: true,
      isReadOnly: true,
      isRequired: true,
      possibleAnswers: [
        {
          rithmId: 'string',
          text: 'string',
          default: true,
        },
      ],
      answer: {
        questionRithmId: 'string',
        referAttribute: 'string',
        asArray: [
          {
            value: 'dev1',
            isChecked: true,
          },
        ],
        asInt: 0,
        asDecimal: 0,
        asString: 'string',
        asDate: '2021-12-14T14:10:31.030Z',
        value: 'string',
      },
      children: [],
    },
    {
      rithmId: '',
      questionType: QuestionFieldType.CheckList,
      prompt: 'checklist',
      isPrivate: true,
      isEncrypted: true,
      isReadOnly: true,
      isRequired: true,
      possibleAnswers: [
        {
          rithmId: 'string',
          text: 'string',
          default: true,
        },
      ],
      answer: {
        questionRithmId: 'string',
        referAttribute: 'string',
        asInt: 0,
        asDecimal: 0,
        asString: 'string',
        asDate: '2021-12-14T14:10:31.030Z',
        value: 'string',
      },
      children: [],
    },
    {
      rithmId: '',
      questionType: QuestionFieldType.Select,
      prompt: 'checklist',
      isPrivate: true,
      isEncrypted: true,
      isReadOnly: true,
      isRequired: true,
      possibleAnswers: [
        {
          rithmId: 'string',
          text: 'string',
          default: true,
        },
      ],
      answer: {
        questionRithmId: 'string',
        referAttribute: 'string',
        asArray: [
          {
            value: 'dev1',
            isChecked: false,
          },
        ],
        asInt: 0,
        asDecimal: 0,
        asString: 'string',
        asDate: '2021-12-14T14:10:31.030Z',
        value: 'string',
      },
      children: [],
    },
    {
      rithmId: '',
      questionType: QuestionFieldType.CheckList,
      prompt: 'checklist',
      isPrivate: true,
      isEncrypted: true,
      isReadOnly: true,
      isRequired: true,
      possibleAnswers: [
        {
          rithmId: 'string',
          text: 'string',
          default: true,
        },
      ],
      answer: {
        questionRithmId: 'string',
        referAttribute: 'string',
        asArray: [
          {
            value: 'dev1',
            isChecked: false,
          },
        ],
        asInt: 0,
        asDecimal: 0,
        asString: 'string',
        asDate: '2021-12-14T14:10:31.030Z',
        value: 'string',
      },
      children: [],
    },
  ];
  const documents: DocumentWidget = {
    documentName: 'Untitled Document',
    documentRithmId: '123-123-123',
    questions: [
      {
        stationRithmId: '123132-123123-123123',
        questions: questions,
      },
    ],
    stations: [
      {
        stationRithmId: '431D-B003-784A578B3FC2-CDB317AA-A5FE',
        stationName: 'New station',
      },
    ],
  };

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
    errorService = TestBed.inject(ErrorService);
    documentService = TestBed.inject(DocumentService);
    fixture = TestBed.createComponent(DocumentWidgetComponent);
    component = fixture.componentInstance;
    component.dataWidget = dataWidget;
    component.widgetItem = widgetItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call method getDocumentWidget', () => {
    const methodGetDocumentWidget = spyOn(
      documentService,
      'getDocumentWidget'
    ).and.callThrough();

    component.getDocumentWidget();

    expect(methodGetDocumentWidget).toHaveBeenCalledOnceWith(
      component.documentRithmId
    );
  });

  it('should show error if the request getDocumentWidget fail', () => {
    const deleteCompanyDashboard = spyOn(
      documentService,
      'getDocumentWidget'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );

    const spyError = spyOn(errorService, 'logError').and.callThrough();

    component.getDocumentWidget();

    expect(deleteCompanyDashboard).toHaveBeenCalledOnceWith(
      component.documentRithmId
    );
    expect(spyError).toHaveBeenCalled();
  });

  it('should call method getDocumentWidget', () => {
    const spyDocumentWidget = spyOn(
      documentService,
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
      const expectData = 'widgetDashboard';
      expect(component.drawerContext).not.toBe(expectData);
      sidenavDrawer.drawerContext$.next(expectData);
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

  describe('getValueQuestion', () => {
    beforeEach(() => {
      component.dataDocumentWidget = documents;
    });

    it('should return [] if question dont exist', () => {
      expect(component.getValueQuestions).toEqual([]);
    });

    it('should getHTMLQuestionValue', () => {
      expect(component.getValueQuestions).toEqual([]);
      const emptyQuestions = component['getHTMLQuestionValue'](questions[1]);
      expect(emptyQuestions).toBeNull();
      const oneCheckedOption = component['getHTMLQuestionValue'](questions[0]);
      expect(oneCheckedOption).toEqual(
        '<i class="fas fa-check-square text-accent-500"></i> dev1'
      );
      const noOption = component['getHTMLQuestionValue'](questions[2]);
      expect(noOption).toEqual('---');
      const oneNoCheckedOptionselected = component['getHTMLQuestionValue'](
        questions[3]
      );
      expect(oneNoCheckedOptionselected).toEqual(
        '<i class="fas fa-square text-secondary-500"></i> dev1'
      );
    });

    it('should call getDocumentWidget when stationFlow change', () => {
      const spyMethod = spyOn(component, 'getDocumentWidget').and.callThrough();
      component.documentRithmId = '333-333-333';
      component.stationFlow = {
        stationFlow: ['123-456-789'],
        currentStation: '222-222-222',
        documentFlow: '333-333-333',
      };
      expect(spyMethod).toHaveBeenCalled();
    });
  });
});
