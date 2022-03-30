import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { throwError } from 'rxjs';

import { DocumentWidgetDrawerComponent } from './document-widget-drawer.component';
import {
  MockDashboardService,
  MockDocumentService,
  MockErrorService,
} from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { DocumentService } from 'src/app/core/document.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import {
  WidgetType,
  EditDataWidget,
  QuestionFieldType,
  ColumnFieldsWidget,
  QuestionList,
} from 'src/models';
import { MockComponent } from 'ng-mocks';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';

describe('DocumentWidgetDrawerComponent', () => {
  let component: DocumentWidgetDrawerComponent;
  let fixture: ComponentFixture<DocumentWidgetDrawerComponent>;
  let sideNavService: SidenavDrawerService;
  const dataEditWidget: EditDataWidget = {
    widgetItem: {
      rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
      cols: 4,
      data: '{"documentRithmId":"1bda1a41-e86a-4031-b3f5-f2329e108db5","columns":[]}',
      maxItemCols: 0,
      maxItemRows: 0,
      minItemCols: 0,
      minItemRows: 0,
      rows: 2,
      widgetType: WidgetType.Document,
      x: 0,
      y: 0,
    },
    widgetIndex: 0,
    quantityElementsWidget: 2,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocumentWidgetDrawerComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: SidenavDrawerService, useClass: SidenavDrawerService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: DocumentService, useClass: MockDocumentService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentWidgetDrawerComponent);
    component = fixture.componentInstance;
    sideNavService = TestBed.inject(SidenavDrawerService);
    fixture.detectChanges();
    component.dataDrawerDocument = {
      widgetItem: {
        rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
        cols: 4,
        data: '{"documentRithmId":"1bda1a41-e86a-4031-b3f5-f2329e108db5","columns":[]}',
        maxItemCols: 0,
        maxItemRows: 0,
        minItemCols: 0,
        minItemRows: 0,
        rows: 2,
        widgetType: WidgetType.Document,
        x: 0,
        y: 0,
        profileImageId: '123132',
      },
      widgetIndex: 0,
      quantityElementsWidget: 2,
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should subscribe to SidenavDrawerService.drawerData$', () => {
    const dataWidget = JSON.parse(dataEditWidget.widgetItem.data);
    const spyEmit = spyOn(component.setWidgetIndex, 'emit').and.callThrough();
    sideNavService.drawerData$.next(dataEditWidget);
    expect(component.dataDrawerDocument.widgetIndex).toEqual(
      dataEditWidget.widgetIndex
    );
    expect(component.dataDrawerDocument.widgetItem).toEqual(
      dataEditWidget.widgetItem
    );
    expect(component.dataDrawerDocument.quantityElementsWidget).toEqual(
      dataEditWidget.quantityElementsWidget
    );
    expect(component.documentColumns).toEqual(dataWidget.columns);
    expect(component.documentRithmId).toEqual(dataWidget.documentRithmId);
    expect(spyEmit).toHaveBeenCalled();
  });

  it('should show loading indicator', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const body = fixture.nativeElement.querySelector(
      '#content-drawer-document-widget'
    );
    const loading = fixture.nativeElement.querySelector('#loading-indicator');
    expect(component.isLoading).toBeTrue();
    expect(body).toBeNull();
    expect(loading).toBeTruthy();
  });

  it('should call the method that returns the questions of the station.', () => {
    const getStationQuestions = spyOn(
      TestBed.inject(DocumentService),
      'getDocumentWidget'
    ).and.callThrough();

    component['getDocumentWidget']();
    expect(getStationQuestions).toHaveBeenCalledOnceWith(
      component.documentRithmId
    );
  });

  it('should show error message when request for questions of a station fails.', () => {
    spyOn(TestBed.inject(DocumentService), 'getDocumentWidget').and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component['getDocumentWidget']();
    expect(spyError).toHaveBeenCalled();
  });

  it('Should emit getWidgetItem', () => {
    sideNavService.drawerData$.next(dataEditWidget);
    const spySetWidgetType = spyOn(component.getWidgetItem, 'emit');
    component.ngOnInit();
    expect(spySetWidgetType).toHaveBeenCalledOnceWith(
      dataEditWidget.widgetItem
    );
  });

  describe('Test function loadColumnsSelect', () => {
    const questions: QuestionList[] = [
      {
        stationRithmId: '123132-123123-123123',
        questions: [
          {
            rithmId: '1020-654684304-05060708-090100',
            prompt: 'Instructions',
            questionType: QuestionFieldType.Instructions,
            isReadOnly: false,
            isRequired: true,
            isPrivate: false,
            children: [],
            answer: {
              questionRithmId: '',
              referAttribute: '',
              value: 'Some value.',
            },
          },
          {
            rithmId: '1020-65sdvsd4-05060708-090trhrth',
            prompt: 'Name your field',
            questionType: QuestionFieldType.ShortText,
            isReadOnly: false,
            isRequired: true,
            isPrivate: false,
            children: [],
            value: '',
          },
        ],
      },
    ];

    it('should load list in select when documentColumns is empty', () => {
      const expectDocumentFields: ColumnFieldsWidget[] = [
        {
          name: questions[0].questions[0].prompt,
          questionId: questions[0].questions[0].rithmId,
        },
        {
          name: questions[0].questions[1].prompt,
          questionId: questions[0].questions[1].rithmId,
        },
      ];
      const expectForm = [
        questions[0].questions[0].rithmId,
        questions[0].questions[1].rithmId,
      ];
      component.questions = questions;
      component.documentColumns = [];

      component['loadColumnsSelect']();

      expect(component.documentFields).toEqual(expectDocumentFields);
      expect(component.formColumns.value).toEqual(expectForm);
    });

    it('should load list in select when documentColumns have any column', () => {
      const expectDocumentFields: ColumnFieldsWidget[] = [
        {
          name: questions[0].questions[0].prompt,
          questionId: questions[0].questions[0].rithmId,
        },
        {
          name: questions[0].questions[1].prompt,
          questionId: questions[0].questions[1].rithmId,
        },
      ];
      const expectDocumentColumns: ColumnFieldsWidget[] = [
        {
          name: questions[0].questions[1].prompt,
          questionId: questions[0].questions[1].rithmId,
        },
      ];
      component.questions = questions;
      component.documentColumns = expectDocumentColumns;

      component['loadColumnsSelect']();

      expect(component.documentFields).toEqual(expectDocumentFields);
      expect(component.formColumns.value).toEqual([
        expectDocumentColumns[0].questionId,
      ]);
    });
  });

  it('should emit updateDataWidget$ to update widget', () => {
    component.formColumns.setValue(['1020-65sdvsd4-05060708-090trhrth']);
    component.questions = [];
    const expectData = {
      widgetItem: component.dataDrawerDocument.widgetItem,
      widgetIndex: component.dataDrawerDocument.widgetIndex,
      quantityElementsWidget:
        component.dataDrawerDocument.quantityElementsWidget,
    };
    const expectDocumentColumns = [
      {
        name: 'Question Document',
        questionId: component.formColumns.value[0],
      },
    ];
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'updateDashboardWidgets'
    ).and.callThrough();

    component['updateWidget']();
    expect(spyService).toHaveBeenCalledOnceWith(expectData);
    expect(component.documentColumns).toEqual(expectDocumentColumns);
  });

  it('should render message for show user this document not have questions assigned', () => {
    component.dataDrawerDocument.quantityElementsWidget = 0;
    component.isLoading = false;
    fixture.detectChanges();
    const renderMessage = fixture.debugElement.nativeElement.querySelector(
      '#message-not-question-assigned-to-document'
    );
    expect(renderMessage).toBeTruthy();
  });

  it('should no render message for show user this document not have questions assigned', () => {
    component.dataDrawerDocument.quantityElementsWidget = 1;
    component.isLoading = false;
    fixture.detectChanges();
    const renderMessage = fixture.debugElement.nativeElement.querySelector(
      '#message-not-question-assigned-to-document'
    );
    expect(renderMessage).toBeFalsy();
  });

  it('should show error message when the request fails', () => {
    const spyError = spyOn(
      TestBed.inject(DocumentService),
      'getDocumentWidget'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component['getDocumentWidget']();
    fixture.detectChanges();
    expect(component.failedLoadDrawer).toBeTrue();
    expect(component.isLoading).toBeFalse();
    const errorMessage = fixture.debugElement.nativeElement.querySelector(
      '#display-document-drawer-error'
    );
    expect(errorMessage).toBeTruthy();
    expect(spyError).toHaveBeenCalled();
  });

  it('should show error message when the document images request fails', () => {
    const spyError = spyOn(
      TestBed.inject(DocumentService),
      'getImagesDocuments'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    component.dataDrawerDocument.widgetItem.widgetType =
      WidgetType.ContainerProfileBanner;
    component.getImagesDocuments();
    fixture.detectChanges();
    const errorMessage = fixture.debugElement.nativeElement.querySelector(
      '#display-document-image-profile-drawer-error'
    );
    expect(errorMessage).toBeTruthy();
    expect(spyError).toHaveBeenCalled();
    expect(component.isLoadingProfileImage).toBeFalse();
  });

  it('should call method to get document images in service', () => {
    dataEditWidget.widgetItem.widgetType = WidgetType.ContainerProfileBanner;
    const spyError = spyOn(
      TestBed.inject(DocumentService),
      'getImagesDocuments'
    ).and.callThrough();
    sideNavService.drawerData$.next(dataEditWidget);
    expect(spyError).toHaveBeenCalled();
  });

  it('should call updateWidget when change Input image', () => {
    const image = {
      imageId: '123-456-789',
      imageName: 'Image name',
    };
    component.dataDrawerDocument.widgetItem = dataEditWidget.widgetItem;
    const spyMethod = spyOn(component, 'updateWidget');

    component.image = image;

    expect(spyMethod).toHaveBeenCalled();
    expect(component.dataDrawerDocument.widgetItem.imageId).toEqual(
      image.imageId
    );
    expect(component.dataDrawerDocument.widgetItem.imageName).toEqual(
      image.imageName
    );
  });

  it('should show  profile image loading indicator', () => {
    component.isLoadingProfileImage = true;
    component.dataDrawerDocument.widgetItem.widgetType =
      WidgetType.ContainerProfileBanner;
    fixture.detectChanges();
    const loading = fixture.debugElement.nativeElement.querySelector(
      '#loading-indicator-profile-image'
    );
    expect(component.isLoadingProfileImage).toBeTrue();
    expect(loading).toBeTruthy();
  });
});
