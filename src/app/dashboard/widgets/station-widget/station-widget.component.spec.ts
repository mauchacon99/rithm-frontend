import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import {
  MockDashboardService,
  MockDocumentService,
  MockErrorService,
  MockPopupService,
  MockUserService,
} from 'src/mocks';
import {
  ColumnFieldsWidget,
  ColumnsDocumentInfo,
  DocumentGenerationStatus,
  Question,
  QuestionFieldType,
  StationRosterMember,
  StationWidgetData,
  WidgetDocument,
  WidgetType,
} from 'src/models';
import { StationWidgetComponent } from './station-widget.component';
import { MockComponent } from 'ng-mocks';
import { DocumentComponent } from 'src/app/document/document/document.component';
import { PopupService } from 'src/app/core/popup.service';
import { LoadingWidgetComponent } from 'src/app/dashboard/widgets/loading-widget/loading-widget.component';
import { ErrorWidgetComponent } from 'src/app/dashboard/widgets/error-widget/error-widget.component';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BannerImageWidgetComponent } from 'src/app/dashboard/widgets/banner-image-widget/banner-image-widget.component';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';
import { UserService } from 'src/app/core/user.service';

/** Represents data of columns. */
interface DataTableValues {
  /** RithmId of the document. */
  rithmId: string;
  /** Key reference of field column basic or questionRithmId. */
  [key: string]: string | number | StationRosterMember | null;
}

/** Represents data of columns. */
interface ColumnsSpecificOfWidget {
  /** Key reference of field column basic or questionRithmId. */
  keyReference: string;
  /** Header title. */
  headerTitle: string;
  /** Type of value. */
  type: 'basic' | 'question';
  /** Enum of questions types. */
  typeQuestion?: QuestionFieldType;
}

describe('StationWidgetComponent', () => {
  let component: StationWidgetComponent;
  let fixture: ComponentFixture<StationWidgetComponent>;
  let documentService: DocumentService;
  let errorService: ErrorService;
  let popupService: PopupService;
  const dataWidget =
    // eslint-disable-next-line max-len
    '{"stationRithmId":"4fb462ec-0772-49dc-8cfb-3849d70ad168", "columns": [{"name": "name"}, {"name":"Test QuestionId","questionId":"37534-453543-453453"}]}';

  const documents: WidgetDocument[] = [
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
      questions: [
        {
          questions: [
            {
              answer: {
                questionRithmId: '',
                referAttribute: '',
                value: 'Value 1',
              },
              children: [],
              isEncrypted: false,
              isPrivate: false,
              isReadOnly: false,
              isRequired: false,
              possibleAnswers: [],
              prompt: 'value instruccions dev 1',
              questionType: QuestionFieldType.Instructions,
              rithmId: '5f652ab1-6870-4b78-8e81-b5e4a6e28184',
            },
            {
              answer: {
                questionRithmId: '',
                referAttribute: '',
                value: 'Value 2',
              },
              children: [],
              isEncrypted: false,
              isPrivate: false,
              isReadOnly: false,
              isRequired: false,
              possibleAnswers: [],
              prompt: 'value instruccions dev 1',
              questionType: QuestionFieldType.Number,
              rithmId: '5f652ab1-6870-4b78-8e81-b5e4a6e28186',
            },
          ],
          stationRithmId: '4fb462ec-0772-49dc-8cfb-3849d70ad168',
        },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationWidgetComponent,
        MockComponent(LoadingWidgetComponent),
        MockComponent(DocumentComponent),
        MockComponent(ErrorWidgetComponent),
        MockComponent(BannerImageWidgetComponent),
      ],
      imports: [
        MatTableModule,
        RouterTestingModule,
        MatSortModule,
        BrowserAnimationsModule,
        UserAvatarModule,
      ],
      providers: [
        { provide: DocumentService, useClass: MockDocumentService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: PopupService, useClass: MockPopupService },
        { provide: UserService, useClass: MockUserService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    documentService = TestBed.inject(DocumentService);
    errorService = TestBed.inject(ErrorService);
    popupService = TestBed.inject(PopupService);
    fixture = TestBed.createComponent(StationWidgetComponent);
    component = fixture.componentInstance;
    component.dataWidget = dataWidget;
    component.dataStationWidget = {
      stationName: 'Station Name',
      documentGeneratorStatus: DocumentGenerationStatus.Manual,
      documents,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service that return station widget data', () => {
    const columns = ['756-789-953'];
    component.columnsFieldPetition = columns;
    const spyService = spyOn(
      documentService,
      'getStationWidgetDocuments'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith(
      component.stationRithmId,
      component.columnsFieldPetition
    );
  });

  it('should show error message when request station widget document  data', () => {
    spyOn(documentService, 'getStationWidgetDocuments').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyService = spyOn(errorService, 'logError').and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalled();
  });

  it('should show button if station is manual', () => {
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
          questions: [
            {
              questions: [
                {
                  answer: undefined,
                  children: [],
                  isEncrypted: false,
                  isPrivate: false,
                  isReadOnly: false,
                  isRequired: false,
                  possibleAnswers: [],
                  prompt: 'value instruccions dev 1',
                  questionType: QuestionFieldType.Instructions,
                  rithmId: '5f652ab1-6870-4b78-8e81-b5e4a6e28184',
                },
              ],
              stationRithmId: '4fb462ec-0772-49dc-8cfb-3849d70ad168',
            },
          ],
        },
      ],
    };

    spyOn(documentService, 'getStationWidgetDocuments').and.returnValue(
      of(dataWidgetStation)
    );

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
          questions: [
            {
              questions: [
                {
                  answer: undefined,
                  children: [],
                  isEncrypted: false,
                  isPrivate: false,
                  isReadOnly: false,
                  isRequired: false,
                  possibleAnswers: [],
                  prompt: 'value instruccions dev 1',
                  questionType: QuestionFieldType.Instructions,
                  rithmId: '5f652ab1-6870-4b78-8e81-b5e4a6e28184',
                },
              ],
              stationRithmId: '4fb462ec-0772-49dc-8cfb-3849d70ad168',
            },
          ],
        },
      ],
    };

    spyOn(documentService, 'getStationWidgetDocuments').and.returnValue(
      of(dataWidgetStation)
    );

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
      documentService,
      'createNewDocument'
    ).and.returnValue(of(expectDocumentRithmId));

    const notifyMethodService = spyOn(popupService, 'notify').and.callThrough();

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
      const loadingDocs = fixture.debugElement.nativeElement.querySelector(
        '#app-loading-indicator'
      );
      const showDocs =
        fixture.debugElement.nativeElement.querySelector('#show-docs');

      expect(loadingDocs).toBeTruthy();
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
        '#app-loading-indicator'
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
    it('should expand widget', () => {
      component.isExpandWidget = false;
      component.failedLoadWidget = false;
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
      component.viewDocument(component.dataStationWidget.documents[0].rithmId);
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
      const spyMethodViewDocument = spyOn(
        component,
        'viewDocument'
      ).and.callThrough();
      const spyMethodToggleExpandWidget = spyOn(
        component,
        'toggleExpandWidget'
      ).and.callThrough();
      component.failedLoadWidget = false;
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
      component.failedLoadWidget = false;
      component.isLoading = false;
      fixture.detectChanges();
      const documentDetail =
        fixture.debugElement.nativeElement.querySelector('#document-detail');
      const showDocs =
        fixture.debugElement.nativeElement.querySelector('#show-docs');
      fixture.detectChanges();
      expect(documentDetail).toBeNull();
      expect(showDocs).toBeTruthy();
      expect(component.documentIdSelected).toBe('');
      expect(spyMethodViewDocument).toHaveBeenCalledOnceWith('');
      expect(spyMethodToggleExpandWidget).toHaveBeenCalled();
    });
  });

  it('should show error under the new document button', () => {
    spyOn(documentService, 'createNewDocument').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(errorService, 'displayError').and.callThrough();
    component.createNewDocument();
    fixture.detectChanges();
    const errorMessage = fixture.debugElement.nativeElement.querySelector(
      '#create-document-error'
    );
    expect(component.displayDocumentError).toBeTrue();
    expect(spyError).toHaveBeenCalled();
    expect(errorMessage).toBeTruthy();
  });

  it('should call viewDocument when  create document and widgetType is station type table', () => {
    const expectDocumentRithmId = '22671B47-D338-4D8F-A8D2-59AC48196FF1';
    component.widgetType = WidgetType.Station;
    const spyService = spyOn(
      documentService,
      'createNewDocument'
    ).and.returnValue(of(expectDocumentRithmId));
    const spyMethodViewDocument = spyOn(
      component,
      'viewDocument'
    ).and.callThrough();
    component.createNewDocument();

    expect(spyMethodViewDocument).toHaveBeenCalledOnceWith(
      expectDocumentRithmId
    );
    expect(spyService).toHaveBeenCalled();
    expect(component.reloadDocumentList).toBeTrue();
  });

  it('should call getStationWidgetDocuments when create document and widgetType is station type list', () => {
    const expectDocumentRithmId = '22671B47-D338-4D8F-A8D2-59AC48196FF1';
    component.widgetType = WidgetType.StationMultiline;
    const spyService = spyOn(
      documentService,
      'createNewDocument'
    ).and.returnValue(of(expectDocumentRithmId));
    const spyMethodGetStationWidgetDocuments = spyOn(
      component,
      'getStationWidgetDocuments'
    ).and.callThrough();
    component.createNewDocument();

    expect(spyMethodGetStationWidgetDocuments).toHaveBeenCalled();
    expect(spyService).toHaveBeenCalled();
  });

  it('should not display a message when there are documents', () => {
    const noDocsMessage =
      fixture.debugElement.nativeElement.querySelector('#no-docs-message');
    expect(noDocsMessage).toBeFalsy();
  });

  it('should show a gear icon in edit mode', () => {
    component.showButtonSetting = true;
    component.isLoading = false;
    component.failedLoadWidget = false;
    component.isDocument = false;
    component.editMode = true;
    fixture.detectChanges();
    const gearIcon =
      fixture.debugElement.nativeElement.querySelector('#gear-icon');
    expect(gearIcon).toBeTruthy();
  });

  it('should show error-widget in station-widget', () => {
    component.failedLoadWidget = true;
    fixture.detectChanges();
    const errorWidget =
      fixture.debugElement.nativeElement.querySelector('#error-load-widget');
    expect(errorWidget).toBeTruthy();
  });

  it('should click edit button and emit toggleDrawer', () => {
    component.isLoading = false;
    component.failedLoadWidget = false;
    component.isDocument = false;
    component.editMode = true;
    component.showButtonSetting = true;
    fixture.detectChanges();
    spyOn(component.toggleDrawer, 'emit');
    spyOn(component, 'toggleEditStation').and.callThrough();

    const btnEdit = fixture.debugElement.nativeElement.querySelector(
      '#toggle-edit-station'
    );

    expect(btnEdit).toBeTruthy();
    btnEdit.disabled = false;
    btnEdit.click();
    expect(component.toggleEditStation).toHaveBeenCalled();
    expect(component.toggleDrawer.emit).toHaveBeenCalled();
  });

  it('should be parse data of the columns widget', () => {
    component.columnsAllField = [];
    spyOnProperty(component, 'dataWidget').and.returnValue(dataWidget);
    const expectColumnsWidget = JSON.parse(dataWidget)?.columns;
    const spyGroupColumns = spyOn(
      TestBed.inject(DashboardService),
      'groupColumnsStationWidget'
    ).and.callThrough();

    component.parseDataColumnsWidget();

    expect(component.columnsAllField).toEqual(expectColumnsWidget);
    expect(component.columnsFieldPetition).toEqual([
      expectColumnsWidget[1]?.questionId,
    ]);
    expect(spyGroupColumns).toHaveBeenCalled();
  });

  it('should be parse data of the columns widget when columns is empty', () => {
    component.columnsFieldPetition = [];
    component.columnsAllField = [];
    const jsonStringData =
      '{"stationRithmId":"4fb462ec-0772-49dc-8cfb-3849d70ad168", "columns": []}';
    spyOnProperty(component, 'dataWidget').and.returnValue(jsonStringData);
    component.parseDataColumnsWidget();
    expect(component.columnsFieldPetition.length).toEqual(0);
    expect(component.columnsAllField.length).toEqual(0);
  });

  it('should be reloadDocumentList true when call widgetReloadListDocuments', () => {
    component.widgetReloadListDocuments(false, true, []);
    expect(component.reloadDocumentList).toBeTrue();
  });

  it('should return list of documents and reload list', () => {
    const spyMethod = spyOn(component, 'viewDocument').and.callThrough();
    component.widgetReloadListDocuments(true, false, []);
    expect(component.reloadDocumentList).toBeFalse();
    expect(spyMethod).toHaveBeenCalledOnceWith('', true);
  });

  it('should redirect to document page', () => {
    component.isLoading = false;
    component.failedLoadWidget = false;
    component.columnsSpecificOfWidget = [
      {
        keyReference: ColumnsDocumentInfo.Name,
        type: 'basic',
        headerTitle: ColumnsDocumentInfo.Name,
      },
      {
        keyReference: ColumnsDocumentInfo.LastUpdated,
        type: 'basic',
        headerTitle: ColumnsDocumentInfo.LastUpdated,
      },
      {
        keyReference: ColumnsDocumentInfo.AssignedUser,
        type: 'basic',
        headerTitle: ColumnsDocumentInfo.AssignedUser,
      },
    ];
    component.widgetType = WidgetType.StationMultilineBanner;
    component.dataSourceTable = new MatTableDataSource([
      {
        rithmId: component.dataStationWidget.documents[0].rithmId,
        name: component.dataStationWidget.documents[0].name,
      },
    ] as DataTableValues[]);
    const navigateSpy = spyOn(component, 'goToDocument').and.callThrough();
    const spyRoute = spyOn(
      TestBed.inject(Router),
      'navigate'
    ).and.callThrough();
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector(
      '#link-document-button-' +
        component.dataStationWidget.documents[0].rithmId
    );
    expect(button).toBeTruthy();
    button.click();
    expect(navigateSpy).toHaveBeenCalled();
    expect(spyRoute).toHaveBeenCalledOnceWith(
      ['/', 'document', component.dataStationWidget.documents[0].rithmId],
      {
        queryParams: {
          documentId: component.dataStationWidget.documents[0].rithmId,
          stationId: component.stationRithmId,
        },
      }
    );
  });

  describe('Structure to set data on dataTableSource', () => {
    const columnsQuestion: ColumnFieldsWidget[] = [
      {
        name: documents[0].questions[0].questions[0].prompt,
        questionId: documents[0].questions[0].questions[0].rithmId,
      },
    ];
    const columnsBasic: ColumnFieldsWidget[] = [
      {
        name: ColumnsDocumentInfo.Name,
      },
    ];

    beforeEach(() => {
      component.dataStationWidget.documents = documents;
    });

    it('should get column basic name', () => {
      expect(component['getColumnBasicName'](ColumnsDocumentInfo.Name)).toEqual(
        'Container'
      );
    });

    describe('generateDataTable', () => {
      beforeEach(() => {
        component.dataStationWidget.documents = documents;
      });

      it('should generate data table when column have questionId', () => {
        component.columnsAllField = columnsQuestion;

        const spyMapColumnsAllField = spyOn(
          component.columnsAllField,
          'map'
        ).and.callThrough();
        const spyMapDataStationWidgetDocuments = spyOn(
          component.dataStationWidget.documents,
          'map'
        ).and.callThrough();

        const expectColumnsSpecificOfWidget: ColumnsSpecificOfWidget[] = [
          {
            headerTitle:
              documents[0].questions[0].questions[0].prompt ||
              columnsQuestion[0].name,
            keyReference:
              documents[0].questions[0].questions[0].rithmId ||
              (columnsQuestion[0].questionId as string),
            type: 'question',
            typeQuestion: documents[0].questions[0].questions[0].questionType,
          },
        ];
        const expectColumnsToDisplayTable = [
          documents[0].questions[0].questions[0].rithmId ||
            (columnsQuestion[0].questionId as string),
        ];

        component['returnDataTableParsed']();

        expect(spyMapColumnsAllField).toHaveBeenCalled();
        expect(spyMapDataStationWidgetDocuments).toHaveBeenCalled();
        expect(component.columnsSpecificOfWidget).toEqual(
          expectColumnsSpecificOfWidget
        );
        expect(component.columnsToDisplayTable).toEqual(
          expectColumnsToDisplayTable
        );
      });

      it('should generate data table when column dont have questionId', () => {
        component.columnsAllField = columnsBasic;

        const spyMapColumnsAllField = spyOn(
          component.columnsAllField,
          'map'
        ).and.callThrough();
        const spyMapDataStationWidgetDocuments = spyOn(
          component.dataStationWidget.documents,
          'map'
        ).and.callThrough();

        const expectColumnsSpecificOfWidget: ColumnsSpecificOfWidget[] = [
          {
            headerTitle: component['getColumnBasicName'](
              ColumnsDocumentInfo.Name
            ),
            keyReference: ColumnsDocumentInfo.Name,
            type: 'basic',
            typeQuestion: undefined,
          },
        ];
        const expectColumnsToDisplayTable = [ColumnsDocumentInfo.Name];

        component['returnDataTableParsed']();

        expect(spyMapColumnsAllField).toHaveBeenCalled();
        expect(spyMapDataStationWidgetDocuments).toHaveBeenCalled();
        expect(component.columnsSpecificOfWidget).toEqual(
          expectColumnsSpecificOfWidget
        );
        expect(component.columnsToDisplayTable).toEqual(
          expectColumnsToDisplayTable
        );
      });

      it('should generate data table when columnsAllField is empty', () => {
        component.columnsAllField = [];

        component['generateDataTable']();

        expect(component.columnsAllField).toEqual([
          {
            name: ColumnsDocumentInfo.Name,
          },
        ]);
      });

      it('should generate data table when columnsAllField is empty and widgetType is multiline', () => {
        component.columnsAllField = [];
        component.widgetType = WidgetType.StationMultiline;

        component['generateDataTable']();

        expect(component.columnsAllField).toEqual([
          {
            name: ColumnsDocumentInfo.Name,
          },
          {
            name: ColumnsDocumentInfo.LastUpdated,
          },
          {
            name: ColumnsDocumentInfo.AssignedUser,
          },
        ]);
      });
    });

    describe('getValueQuestion', () => {
      beforeEach(() => {
        component.dataStationWidget.documents = documents;
      });

      it('should return null if question dont exist', () => {
        expect(
          component['getValueQuestion']('23423423', documents[0])
        ).toBeNull();
      });

      it('should return value of answer', () => {
        const question = documents[0].questions[0].questions[1];
        expect(
          component['getValueQuestion'](question.rithmId, documents[0])
        ).toEqual(question.answer?.value || null);
      });

      it('should return value of prompt when questionType is instruction', () => {
        const question = documents[0].questions[0].questions[0];
        expect(
          component['getValueQuestion'](question.rithmId, documents[0])
        ).toEqual(question.prompt || null);
      });

      it('should return null when questionType is check or select and dont have answers', () => {
        const question: Question = {
          answer: {
            questionRithmId: '',
            referAttribute: '',
            value: 'Value 2',
          },
          children: [],
          isEncrypted: false,
          isPrivate: false,
          isReadOnly: false,
          isRequired: false,
          possibleAnswers: [],
          prompt: 'question select',
          questionType: QuestionFieldType.Select,
          rithmId: '5f652ab1-6870-4b78-8e81-questionselect',
        };

        component.dataStationWidget.documents[0].questions[0].questions = [
          ...component.dataStationWidget.documents[0].questions[0].questions,
          question,
        ];
        expect(
          component['getValueQuestion'](question.rithmId, documents[0])
        ).toBeNull();
      });

      it('should return values of questionType check or select', () => {
        const question: Question = {
          answer: {
            questionRithmId: '',
            referAttribute: '',
            value: 'Value 2',
            asArray: [
              {
                value: 'value 1',
                isChecked: true,
              },
            ],
          },
          children: [],
          isEncrypted: false,
          isPrivate: false,
          isReadOnly: false,
          isRequired: false,
          possibleAnswers: [],
          prompt: 'question check',
          questionType: QuestionFieldType.CheckList,
          rithmId: '5f652ab1-6870-4b78-8e81-questioncheck',
        };

        component.dataStationWidget.documents[0].questions[0].questions = [
          ...component.dataStationWidget.documents[0].questions[0].questions,
          question,
        ];

        expect(
          component['getValueQuestion'](question.rithmId, documents[0])
        ).toEqual('value 1');
      });

      it("should return '---' when questionType is check or select and dont have checked value", () => {
        const question: Question = {
          answer: {
            questionRithmId: '',
            referAttribute: '',
            value: 'Value 2',
            asArray: [
              {
                value: 'value 1',
                isChecked: false,
              },
            ],
          },
          children: [],
          isEncrypted: false,
          isPrivate: false,
          isReadOnly: false,
          isRequired: false,
          possibleAnswers: [],
          prompt: 'question check',
          questionType: QuestionFieldType.MultiSelect,
          rithmId: '5f652ab1-6870-4b78-8e81-questionmultiselect',
        };

        component.dataStationWidget.documents[0].questions[0].questions = [
          ...component.dataStationWidget.documents[0].questions[0].questions,
          question,
        ];

        expect(
          component['getValueQuestion'](question.rithmId, documents[0])
        ).toEqual('---');
      });
    });

    it('should get question when call getColumnQuestion', () => {
      const question: Question = documents[0].questions[0].questions[0];

      expect(component['getColumnQuestion'](question.rithmId)).toEqual(
        question
      );
    });
  });

  it('should emit reloadStationsFlow', () => {
    component.documentIdSelected = '333-333-333';
    const stationFlow = ['123-456-789'];
    const spyEmit = spyOn(
      component.reloadStationsFlow,
      'emit'
    ).and.callThrough();

    component.widgetReloadListDocuments(true, true, stationFlow);

    expect(spyEmit).toHaveBeenCalledOnceWith({
      stationFlow,
      currentStation: component.stationRithmId,
      documentFlow: component.documentIdSelected,
    });
  });

  it('should call getStationWidgetDocuments when stationFlow change', () => {
    const spyMethod = spyOn(
      component,
      'getStationWidgetDocuments'
    ).and.callThrough();
    component.isDocument = false;
    component.stationRithmId = '123-456-789';
    component.stationFlow = {
      stationFlow: ['123-456-789'],
      currentStation: '222-222-222',
      documentFlow: '333-333-333',
    };
    expect(spyMethod).toHaveBeenCalled();
  });

  it('should set reloadDocumentList to true when stationFlow change', () => {
    component.reloadDocumentList = false;
    component.isDocument = true;
    component.documentIdSelected = '234-234234-6666';
    component.stationRithmId = '222-222-222';
    component.stationFlow = {
      stationFlow: ['123-456-789'],
      currentStation: '222-222-222',
      documentFlow: '333-333-333',
    };
    expect(component.reloadDocumentList).toBeTrue();
  });

  it('should call viewDocument when stationFlow change', () => {
    component.documentIdSelected = '333-333-333';
    component.isDocument = true;
    component.stationRithmId = '222-222-222';
    const spyMethod = spyOn(component, 'viewDocument').and.callThrough();
    component.stationFlow = {
      stationFlow: ['123-456-789'],
      currentStation: '222-222-222',
      documentFlow: '333-333-333',
    };
    expect(spyMethod).toHaveBeenCalledWith('', true);
  });

  it('should set reloadDocumentList to true when a document was saved', () => {
    component.reloadDocumentList = false;
    component.isDocument = true;
    component.documentIdSelected = '333-333-333';
    component.stationRithmId = '222-222-222';
    component.stationFlow = {
      stationFlow: ['rithmIdTempOnlySave'],
      currentStation: '222-222-222',
      documentFlow: '333-333-333',
    };
    expect(component.reloadDocumentList).toBeTrue();
  });
});
