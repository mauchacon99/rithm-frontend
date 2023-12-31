import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectModule } from '@angular/material/select';

import { StationWidgetDrawerComponent } from './station-widget-drawer.component';
import {
  ColumnsDocumentInfo,
  OptionsSelectWidgetDrawer,
  Question,
  QuestionFieldType,
  WidgetType,
} from 'src/models';
import { MockComponent } from 'ng-mocks';
import { LoadingIndicatorComponent } from 'src/app/shared/loading-indicator/loading-indicator.component';
import { StationService } from 'src/app/core/station.service';
import {
  MockDashboardService,
  MockErrorService,
  MockStationService,
} from 'src/mocks';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('StationWidgetDrawerComponent', () => {
  let component: StationWidgetDrawerComponent;
  let fixture: ComponentFixture<StationWidgetDrawerComponent>;
  const dataEditWidget = {
    widgetItem: {
      rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
      cols: 4,
      // eslint-disable-next-line max-len
      data: '{"stationRithmId":"9897ba11-9f11-4fcf-ab3f-f74a75b9d5a1","columns": [{"name": "name"}, {"name": "name", "questionId": "d17f6f7a-9642-45e0-8221-e48045d3c97e"}]}',
      maxItemCols: 0,
      maxItemRows: 0,
      minItemCols: 0,
      minItemRows: 0,
      rows: 2,
      widgetType: WidgetType.Station,
      x: 0,
      y: 0,
      profileImageId: '123132',
    },
    widgetIndex: 0,
    isCloseDrawer: false,
  };
  const dataWidget = JSON.parse(dataEditWidget.widgetItem.data);
  const questions: Question[] = [
    {
      prompt: 'Fake question 1',
      rithmId: '3j4k-3h2j-hj4j',
      questionType: QuestionFieldType.Number,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
      value: '1',
    },
    {
      prompt: 'Fake question 2',
      rithmId: '3j4k-3h2j-hj4j',
      questionType: QuestionFieldType.Number,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
      value: '2',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        StationWidgetDrawerComponent,
        MockComponent(LoadingIndicatorComponent),
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: StationService, useClass: MockStationService },
        { provide: ErrorService, useClass: MockErrorService },
        { provide: DashboardService, useClass: MockDashboardService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationWidgetDrawerComponent);
    component = fixture.componentInstance;
    component.questions = questions;
    component.dataDrawer = {
      widgetItem: {
        rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
        cols: 4,
        data: '{"documentRithmId":"1bda1a41-e86a-4031-b3f5-f2329e108db5","columns":[]}',
        maxItemCols: 0,
        maxItemRows: 0,
        minItemCols: 0,
        minItemRows: 0,
        rows: 2,
        widgetType: WidgetType.Station,
        x: 0,
        y: 0,
      },
      widgetIndex: 0,
      quantityElementsWidget: 2,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading indicator', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const body = fixture.nativeElement.querySelector(
      '#content-drawer-station-widget'
    );
    const loading = fixture.nativeElement.querySelector('#loading-indicator');

    expect(component.isLoading).toBeTrue();
    expect(body).toBeNull();
    expect(loading).toBeTruthy();
  });

  it('should call the method that returns the questions of the station.', () => {
    const getStationQuestions = spyOn(
      TestBed.inject(StationService),
      'getStationQuestions'
    ).and.callThrough();
    component['getDocumentFields']();
    expect(getStationQuestions).toHaveBeenCalledOnceWith(
      component.stationRithmId
    );
  });

  it('should show error message when request for questions of a station fails.', () => {
    spyOn(
      TestBed.inject(StationService),
      'getStationQuestions'
    ).and.returnValue(
      throwError(() => {
        throw new Error();
      })
    );
    const spyError = spyOn(
      TestBed.inject(ErrorService),
      'displayError'
    ).and.callThrough();
    component['getDocumentFields']();
    expect(spyError).toHaveBeenCalled();
  });

  describe('Functionality of the columns', () => {
    beforeEach(() => {
      component.isLoading = false;
      component.failedLoadDrawer = false;
      component.stationRithmId = dataWidget.stationRithmId;
      component.stationColumns = [
        {
          name: 'name',
        },
        {
          name: 'name',
          questionId: 'd17f6f7a-9642-45e0-8221-e48045d3c97e',
        },
      ];
      component.dataDrawer = {
        widgetItem: {
          rithmId: '147cf568-27a4-4968-5628-046ccfee24fd',
          cols: 4,
          data: '{"documentRithmId":"1bda1a41-e86a-4031-b3f5-f2329e108db5","columns":[]}',
          maxItemCols: 0,
          maxItemRows: 0,
          minItemCols: 0,
          minItemRows: 0,
          rows: 2,
          widgetType: WidgetType.Station,
          x: 0,
          y: 0,
        },
        widgetIndex: 0,
        quantityElementsWidget: 2,
      };
      component.dataDrawer.widgetIndex = dataEditWidget.widgetIndex;
      component.dataDrawer.widgetItem = JSON.parse(
        JSON.stringify(dataEditWidget.widgetItem)
      );
      component.questions = questions;
    });

    it('should set documentInfo', () => {
      const documentInfo: OptionsSelectWidgetDrawer[] = [];
      TestBed.inject(DashboardService).columnsDocumentInfo.map((column) => {
        documentInfo.push({
          name: column.name,
          disabled: component['checkExistColumn'](column.key, 'name'),
          value: column.key,
        });
      });
      component['setDocumentInfo']();
      expect(component.documentInfo).toEqual(documentInfo);
    });

    it('should set documentFields', () => {
      const documentFields: OptionsSelectWidgetDrawer[] = [];
      questions.map((question) => {
        documentFields.push({
          name: question.prompt,
          value: question.rithmId,
          disabled: component['checkExistColumn'](
            question.rithmId,
            'questionId'
          ),
          questionId: question.rithmId,
        });
      });
      component['setDocumentFields']();
      expect(component.documentFields).toEqual(documentFields);
    });

    it('should check if document already has been select', () => {
      // Return true when check questionId of stationColumns equal to value documentFields
      expect(
        component['checkExistColumn'](
          'd17f6f7a-9642-45e0-8221-e48045d3c97e',
          'questionId'
        )
      ).toBeTrue();
      // Return false when check questionId of stationColumns equal to value documentFields
      expect(
        component['checkExistColumn'](
          'd17f6f7a-9642-45e0-8221-e48045d3c97',
          'questionId'
        )
      ).toBeFalse();

      // Return true when check name of stationColumns equal to value documentInfo
      expect(component['checkExistColumn']('name', 'name')).toBeTrue();
      // Return false when check name of stationColumns equal to value documentInfo
      expect(component['checkExistColumn']('priority', 'name')).toBeFalse();
    });

    it('should load data of the columns with stationColumns', () => {
      const spyMethod = spyOn(component, 'addNewColumn').and.callThrough();
      component['loadColumnsSelect']();
      expect(spyMethod).toHaveBeenCalledTimes(2);
    });

    it('should load data of the columns with stationColumns empty', () => {
      const spyMethod = spyOn(component, 'addNewColumn').and.callThrough();
      component.stationColumns = [];
      component['loadColumnsSelect']();
      expect(spyMethod).toHaveBeenCalledTimes(1);
    });

    it('should add new column', () => {
      component.dataDrawer.quantityElementsWidget = 1;
      fixture.detectChanges();
      const spyMethod = spyOn(component, 'addNewColumn').and.callThrough();
      const btnNewColumn =
        fixture.nativeElement.querySelector('#add-new-column');
      expect(btnNewColumn).toBeTruthy();
      btnNewColumn.disabled = false;
      btnNewColumn.click();
      expect(spyMethod).toHaveBeenCalled();
      expect(component.getFormColumns.controls.length).toEqual(1);
    });

    it('should disable add new column', () => {
      component.dataDrawer.quantityElementsWidget = 1;
      fixture.detectChanges();
      spyOnProperty(component, 'disabledNewColumn').and.returnValue(true);
      const btnNewColumn =
        fixture.nativeElement.querySelector('#add-new-column');
      expect(btnNewColumn).toBeTruthy();
      expect(btnNewColumn.disabled).toBeTrue();
    });

    it('should return true to disabled add new column', () => {
      component.documentInfo = [
        {
          name: 'test',
          value: 'test',
          disabled: true,
        },
      ];
      component.documentFields = [
        {
          name: 'test',
          value: 'test',
          disabled: true,
          questionId: 'test',
        },
      ];

      expect(component.disabledNewColumn).toBeTrue();
    });

    it('should return true to disabled add new column when form is invalid', () => {
      component.addNewColumn();

      expect(component.disabledNewColumn).toBeTrue();
    });

    it('should return false to disabled add new column when is valid generate new column', () => {
      component.documentInfo = [
        {
          name: 'test',
          value: 'test',
          disabled: true,
        },
      ];
      component.documentFields = [
        {
          name: 'test',
          value: 'test',
          disabled: false,
          questionId: 'test',
        },
      ];

      expect(component.disabledNewColumn).toBeFalse();
    });

    it('should disable add new column when maximum limit of columns is reached', () => {
      spyOnProperty(component, 'isStationMultiline').and.returnValue(false);
      component.dataDrawer.quantityElementsWidget = 1;
      for (
        let index = 0;
        index <= component.MAXIMUM_COLUMNS_ALLOWED + 1;
        index++
      ) {
        component.addNewColumn();
      }
      fixture.detectChanges();
      const message = fixture.nativeElement.querySelector('#message-limited');
      expect(message).toBeTruthy();
      expect(component.limitedColumnsReached).toBeTrue();
      expect(component.disabledNewColumn).toBeTrue();
    });

    it('should delete a column', () => {
      const spyMethod = spyOn(component, 'deleteColumn').and.callThrough();
      component['loadColumnsSelect']();
      fixture.detectChanges();
      const btnDelete = fixture.nativeElement.querySelector('#delete-column-1');
      expect(btnDelete).toBeTruthy();
      btnDelete.click();
      expect(spyMethod).toHaveBeenCalledOnceWith(1);
      expect(component.stationColumns.length).toEqual(1);
      expect(component.getFormColumns.controls.length).toEqual(1);
    });

    it('should select option only with name and push column to update columns widget', () => {
      const optionSelected: OptionsSelectWidgetDrawer = {
        name: 'Document',
        disabled: false,
        value: 'name',
      };
      const expectStationColumn = [
        ...component.stationColumns,
        {
          name: optionSelected.value,
        },
      ];
      component['optionSelected'](optionSelected, 2);
      expect(component.stationColumns).toEqual(expectStationColumn);
    });

    it('should select option only with name and update column to update columns widget', () => {
      const optionSelected: OptionsSelectWidgetDrawer = {
        name: 'Test',
        disabled: false,
        value: 'test',
        questionId: 'test',
      };
      const expectStationColumn = [
        component.stationColumns[0],
        {
          name: optionSelected.name,
          questionId: optionSelected.questionId,
        },
      ];
      component['optionSelected'](optionSelected, 1);
      expect(component.stationColumns).toEqual(expectStationColumn);
    });

    it('should emit updateDataWidget$ to update widget', () => {
      const expectData = {
        widgetItem: component.dataDrawer.widgetItem,
        widgetIndex: component.dataDrawer.widgetIndex,
        quantityElementsWidget: 2,
      };
      const spyService = spyOn(
        TestBed.inject(DashboardService),
        'updateDashboardWidgets'
      ).and.callThrough();

      component['updateWidget']();
      expect(spyService).toHaveBeenCalledOnceWith(expectData);
    });

    it('should check  if stationColumns questionId exists in question.rithmId.', () => {
      component.stationColumns = [
        {
          name: 'name',
        },
        {
          name: 'name',
          questionId: 'd17f6f7a-9642-45e0-8221-e48045d3c97e',
        },
        {
          name: 'name',
          questionId: 'd17f6f7a-9642-45e0-8221-e482436rfhbhrte',
        },
      ];
      component.questions = [
        {
          prompt: 'Fake question 1',
          rithmId: 'd17f6f7a-9642-45e0-8221-e48045d3c97e',
          questionType: QuestionFieldType.Number,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
          value: '1',
        },
        {
          prompt: 'Fake question 2',
          rithmId: '3j4k-3h2j-hj4j',
          questionType: QuestionFieldType.Number,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
          value: '2',
        },
      ];
      component['checkStationColumns']();
      expect(component.stationColumns.length).toEqual(2);
    });

    it('should show error in getStationQuestions', () => {
      const spyError = spyOn(
        TestBed.inject(StationService),
        'getStationQuestions'
      ).and.returnValue(
        throwError(() => {
          throw new Error();
        })
      );
      component['getDocumentFields']();
      fixture.detectChanges();
      expect(component.failedLoadDrawer).toBeTrue();
      const error = fixture.debugElement.nativeElement.querySelector(
        '#error-loading-columns'
      );
      expect(error).toBeTruthy();
      expect(spyError).toHaveBeenCalled();
    });
    it('should render message for show user this station not documents assigned', () => {
      component.dataDrawer.quantityElementsWidget = 0;
      component.questions = [];
      fixture.detectChanges();
      const renderMessage = fixture.debugElement.nativeElement.querySelector(
        '#message-not-documents-assigned-to-station'
      );
      expect(renderMessage).toBeTruthy();
    });

    it('should no render message for show user this station not documents assigned', () => {
      component.dataDrawer.quantityElementsWidget = 1;
      fixture.detectChanges();
      const renderMessage = fixture.debugElement.nativeElement.querySelector(
        '#message-not-documents-assigned-to-station'
      );
      expect(renderMessage).toBeFalsy();
    });

    it('should call updateWidget when change Input image', () => {
      const image = {
        imageId: '123-456-789',
        imageName: 'Image name',
      };
      component.dataDrawer.widgetItem = dataEditWidget.widgetItem;

      component.image = image;

      expect(component.dataDrawer.widgetItem.imageId).toEqual(image.imageId);
      expect(component.dataDrawer.widgetItem.imageName).toEqual(
        image.imageName
      );
    });
  });

  it('should set default columns if station columns are empty and station is type multiline', () => {
    component.dataDrawer.widgetItem.widgetType = WidgetType.StationMultiline;
    component.stationColumns = [];
    const dataExpected = [
      { name: ColumnsDocumentInfo.Name },
      { name: ColumnsDocumentInfo.LastUpdated },
      { name: ColumnsDocumentInfo.AssignedUser },
    ];

    component['setDefaultColumnsStationMultiline']();

    expect(component.stationColumns).toEqual(dataExpected);
  });

  it('should not set default columns when stationColumns have columns and station is type multiline', () => {
    const dataExpected = [
      { name: ColumnsDocumentInfo.Name },
      { name: 'Question', questionId: '123-456-789' },
      { name: ColumnsDocumentInfo.TimeInStation },
    ];
    component.dataDrawer.widgetItem.widgetType = WidgetType.StationMultiline;
    component.stationColumns = dataExpected;

    component['setDefaultColumnsStationMultiline']();

    expect(component.stationColumns).toEqual(dataExpected);
  });

  it('should return false when check type question not able and station multiline', () => {
    component.dataDrawer.widgetItem.widgetType = WidgetType.StationMultiline;
    const question: Question = {
      prompt: 'Fake question 2',
      rithmId: '3j4k-3h2j-hj4j',
      questionType: QuestionFieldType.Number,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
      value: '2',
    };

    const response = component['checkTypeQuestionAndStation'](question);
    expect(response).toBeFalse();
  });

  it('should return true when check type question able and station multiline', () => {
    component.dataDrawer.widgetItem.widgetType = WidgetType.StationMultiline;
    const question: Question = {
      prompt: 'Fake question 2',
      rithmId: '3j4k-3h2j-hj4j',
      questionType: QuestionFieldType.LongText,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
      value: '2',
    };

    const response = component['checkTypeQuestionAndStation'](question);
    expect(response).toBeTrue();
  });

  it('should return false when check type question able and station multiline and its third select', () => {
    component.dataDrawer.widgetItem.widgetType = WidgetType.StationMultiline;
    const question: Question = {
      prompt: 'Fake question 2',
      rithmId: '3j4k-3h2j-hj4j',
      questionType: QuestionFieldType.LongText,
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      children: [],
      value: '2',
    };

    const response = component['checkTypeQuestionAndStation'](question, true);
    expect(response).toBeFalse();
  });
});
