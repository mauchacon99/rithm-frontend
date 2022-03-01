import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { LoadingIndicatorComponent } from '../../../shared/loading-indicator/loading-indicator.component';

describe('DocumentWidgetDrawerComponent', () => {
  let component: DocumentWidgetDrawerComponent;
  let fixture: ComponentFixture<DocumentWidgetDrawerComponent>;
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
        BrowserAnimationsModule,
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
    component.quantityElementsWidget = 2;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should subscribe to SidenavDrawerService.drawerData$', () => {
    const dataWidget = JSON.parse(dataEditWidget.widgetItem.data);
    const spyEmit = spyOn(component.setWidgetIndex, 'emit').and.callThrough();

    TestBed.inject(SidenavDrawerService).drawerData$.next(dataEditWidget);
    expect(component.widgetIndex).toEqual(dataEditWidget.widgetIndex);
    expect(component.widgetItem).toEqual(dataEditWidget.widgetItem);
    expect(component.quantityElementsWidget).toEqual(
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
      component.questions = questions;
      component.documentColumns = [];

      component['loadColumnsSelect']();

      expect(component.documentFields).toEqual(expectDocumentFields);
      expect(component.formColumns.value).toEqual(expectDocumentFields);
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
      expect(component.formColumns.value).toEqual(expectDocumentColumns);
    });
  });

  it('should emit updateDataWidget$ to update widget', () => {
    component.widgetItem = dataEditWidget.widgetItem;
    component.widgetIndex = dataEditWidget.widgetIndex;
    component.quantityElementsWidget = dataEditWidget.quantityElementsWidget;
    component.formColumns.setValue([
      {
        name: 'Test',
        questionId: '1020-65sdvsd4-05060708-090trhrth',
      },
    ]);
    const expectData = {
      widgetItem: component.widgetItem,
      widgetIndex: component.widgetIndex,
      quantityElementsWidget: component.quantityElementsWidget,
    };
    const spyService = spyOn(
      TestBed.inject(DashboardService),
      'updateDashboardWidgets'
    ).and.callThrough();

    component['updateWidget']();
    expect(spyService).toHaveBeenCalledOnceWith(expectData);
    expect(component.documentColumns).toEqual(component.formColumns.value);
  });
});
