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
  ColumnsDocumentInfo,
  DocumentGenerationStatus,
  QuestionFieldType,
  StationWidgetData,
} from 'src/models';
import { StationWidgetComponent } from './station-widget.component';
import { MockComponent } from 'ng-mocks';
import { UserAvatarComponent } from 'src/app/shared/user-avatar/user-avatar.component';
import { DocumentComponent } from 'src/app/document/document/document.component';
import { PopupService } from 'src/app/core/popup.service';
import { LoadingWidgetComponent } from 'src/app/dashboard/widgets/loading-widget/loading-widget.component';
import { ErrorWidgetComponent } from 'src/app/dashboard/widgets/error-widget/error-widget.component';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { MatTableModule } from '@angular/material/table';
import { UserService } from 'src/app/core/user.service';

describe('StationWidgetComponent', () => {
  let component: StationWidgetComponent;
  let fixture: ComponentFixture<StationWidgetComponent>;
  const dataWidget =
    // eslint-disable-next-line max-len
    '{"stationRithmId":"4fb462ec-0772-49dc-8cfb-3849d70ad168", "columns": [{"name": "name"}, {"name":"Test QuestionId","questionId":"37534-453543-453453"}]}';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationWidgetComponent,
        MockComponent(LoadingWidgetComponent),
        MockComponent(UserAvatarComponent),
        MockComponent(DocumentComponent),
        MockComponent(ErrorWidgetComponent),
      ],
      imports: [MatTableModule],
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
    fixture = TestBed.createComponent(StationWidgetComponent);
    component = fixture.componentInstance;
    component.dataWidget = dataWidget;
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
                {
                  answer: undefined,
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
      ],
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
      TestBed.inject(DocumentService),
      'getStationWidgetDocuments'
    ).and.callThrough();
    component.ngOnInit();
    expect(spyService).toHaveBeenCalledOnceWith(
      component.stationRithmId,
      component.columnsFieldPetition
    );
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
      const spyMethod = spyOn(component, 'viewDocument').and.callThrough();
      component.failedLoadWidget = false;
      component.isDocument = true;
      component.isLoading = false;
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
      expect(spyMethod).toHaveBeenCalledOnceWith('');
    });
  });

  it('should show error under the new document button', () => {
    spyOn(TestBed.inject(DocumentService), 'createNewDocument').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.createNewDocument();
    fixture.detectChanges();
    const errorMessage = fixture.debugElement.nativeElement.querySelector(
      '#create-document-error'
    );
    expect(component.displayDocumentError).toBeTrue();
    expect(errorMessage).toBeTruthy();
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

  it('should get name of the column', () => {
    expect(component.getColumnBasicName(ColumnsDocumentInfo.Name)).toEqual(
      'Document'
    );
  });

  it('should be parse data of the columns widget', () => {
    spyOnProperty(component, 'dataWidget').and.returnValue(dataWidget);
    const expectColumnsWidget = JSON.parse(dataWidget)?.columns;
    component.parseDataColumnsWidget();
    expect(component.columnsAllField).toEqual(expectColumnsWidget);
    expect(component.columnsFieldPetition).toEqual([
      expectColumnsWidget[1]?.questionId,
    ]);
    expect(component.columnsToDisplayTable).toEqual([
      expectColumnsWidget[0]?.name,
      expectColumnsWidget[1]?.questionId,
      'viewDocument',
    ]);
  });

  it('should be parse data of the columns widget when columns is empty', () => {
    const jsonStringData =
      '{"stationRithmId":"4fb462ec-0772-49dc-8cfb-3849d70ad168", "columns": []}';
    spyOnProperty(component, 'dataWidget').and.returnValue(jsonStringData);
    component.parseDataColumnsWidget();
    expect(component.columnsFieldPetition.length).toEqual(0);
    expect(component.columnsAllField.length).toEqual(0);
    expect(component.columnsToDisplayTable).toEqual(['name', 'viewDocument']);
  });

  it('should get name of question to table column when questionType id instructions', () => {
    const expectDataValue = 'Instruction';
    const expectDataReturn = component.getColumnQuestionPrompt({
      name: 'Value Test',
      questionId:
        component.dataStationWidget.documents[0].questions[0].questions[0]
          .rithmId,
    });
    expect(expectDataReturn).toEqual(expectDataValue);
  });

  it('should get name of question to table column when not found questionId', () => {
    const expectDataValue = 'Value Test';
    const expectDataReturn = component.getColumnQuestionPrompt({
      name: expectDataValue,
      questionId: '5f652ab1-6870-4b78-881-b5e4a6e2818',
    });
    expect(expectDataReturn).toEqual(expectDataValue);
  });

  it('should get name of question to table column when found questionId and its different to instructions', () => {
    const expectDataValue =
      component.dataStationWidget.documents[0].questions[0].questions[1].prompt;
    const expectDataReturn = component.getColumnQuestionPrompt({
      name: expectDataValue,
      questionId:
        component.dataStationWidget.documents[0].questions[0].questions[1]
          .rithmId,
    });
    expect(expectDataReturn).toEqual(expectDataValue);
  });

  it('should be reloadDocumentList true when call widgetReloadListDocuments', () => {
    component.widgetReloadListDocuments(false, true);
    expect(component.reloadDocumentList).toBeTrue();
  });

  it('should return list of documents and reload list', () => {
    const spyMethod = spyOn(component, 'viewDocument').and.callThrough();
    component.widgetReloadListDocuments(true, false);
    expect(component.reloadDocumentList).toBeFalse();
    expect(spyMethod).toHaveBeenCalledOnceWith('', true);
  });
});
