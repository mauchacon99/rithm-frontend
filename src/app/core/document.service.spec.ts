import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import {
  ForwardPreviousStationsDocument,
  StationDocuments,
  UserType,
  DocumentStationInformation,
  StandardStringJSON,
  DocumentAnswer,
  QuestionFieldType,
  DocumentName,
  StationRosterMember,
  Question,
  DocumentAutoFlow,
  MoveDocument,
  StationWidgetData,
  DocumentGenerationStatus,
  FlowLogicRule,
  OperandType,
  OperatorType,
  RuleType,
  DocumentEvent,
  DocumentWidget,
} from 'src/models';
import { DocumentService } from './document.service';

const MICROSERVICE_PATH = '/documentservice/api/document';
const user: StationRosterMember = {
  rithmId: '123132132',
  firstName: 'Demo',
  lastName: 'User',
  email: 'demo@demo.com',
  isWorker: true,
  isOwner: false,
};
describe('DocumentService', () => {
  let service: DocumentService;
  let httpTestingController: HttpTestingController;
  const stationId = 'E204F369-386F-4E41';
  const documentId = 'E204F369-386F-4E41';
  const flowLogicRule: FlowLogicRule = {
    stationRithmId: '3813442c-82c6-4035-893a-86fa9deca7c3',
    destinationStationRithmID: '73d47261-1932-4fcf-82bd-159eb1a7243f',
    flowRule: {
      ruleType: RuleType.Or,
      equations: [
        {
          leftOperand: {
            type: OperandType.Field,
            questionType: QuestionFieldType.ShortText,
            value: 'birthday',
            text: 'test',
          },
          operatorType: OperatorType.Before,
          rightOperand: {
            type: OperandType.Date,
            questionType: QuestionFieldType.ShortText,
            value: '5/27/1982',
            text: 'test',
          },
        },
      ],
      subRules: [],
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DocumentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of documents for a station', () => {
    const pageNum = 1;
    const expectedResponse: StationDocuments = {
      documents: [
        /* eslint-disable max-len */
        {
          documentName: 'Almond Flour',
          stationName: 'Dry Goods & Liquids',
          flowedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          priority: 2,
          userAssigned: '',
          isEscalated: true,
          updatedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          documentRithmId: '',
          stationRithmId: '',
        },
        {
          documentName: 'Apple Crisps',
          stationName: 'Dry Goods & Liquids',
          flowedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          priority: 7,
          userAssigned: 'John Doe',
          isEscalated: false,
          updatedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          documentRithmId: '',
          stationRithmId: '',
        },
        {
          documentName: 'Apple Sauce',
          stationName: 'Dry Goods & Liquids',
          flowedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          priority: 3,
          userAssigned: '',
          isEscalated: false,
          updatedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          documentRithmId: '',
          stationRithmId: '',
        },
        {
          documentName: 'Bagel Seasoning',
          stationName: 'Dry Goods & Liquids',
          flowedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          priority: 7,
          userAssigned: '',
          isEscalated: false,
          updatedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          documentRithmId: '',
          stationRithmId: '',
        },
        {
          documentName: 'Baking Soda',
          stationName: 'Dry Goods & Liquids',
          flowedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          priority: 9,
          userAssigned: 'John Doe',
          isEscalated: false,
          updatedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          documentRithmId: '',
          stationRithmId: '',
        },
        {
          documentName: 'Banana Crisps',
          stationName: 'Dry Goods & Liquids',
          flowedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          priority: 1,
          userAssigned: 'John Doe',
          isEscalated: true,
          updatedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          documentRithmId: '',
          stationRithmId: '',
        },
        {
          documentName: 'Black Pepper',
          stationName: 'Dry Goods & Liquids',
          flowedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          priority: 2,
          userAssigned: 'John Doe',
          isEscalated: false,
          updatedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          documentRithmId: '',
          stationRithmId: '',
        },
        {
          documentName: 'Borax',
          stationName: 'Dry Goods & Liquids',
          flowedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          priority: 1,
          userAssigned: '',
          isEscalated: false,
          updatedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          documentRithmId: '',
          stationRithmId: '',
        },
        {
          documentName: 'Bowtie Pasta',
          stationName: 'Dry Goods & Liquids',
          flowedTimeUTC: '',
          priority: 2,
          userAssigned: '',
          isEscalated: false,
          updatedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          documentRithmId: '',
          stationRithmId: '',
        },
        {
          documentName: 'Calcium',
          stationName: 'Dry Goods & Liquids',
          flowedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          priority: 3,
          userAssigned: 'John Doe',
          isEscalated: false,
          updatedTimeUTC: '2021-06-16T17:26:47.3506612Z',
          documentRithmId: '',
          stationRithmId: '',
        },
        /* eslint-enable max-len */
      ],
      totalDocuments: 40,
      userType: UserType.Admin,
    };
    service.getStationDocuments(stationId, pageNum).subscribe((response) => {
      expect(response.documents.length).toBeGreaterThanOrEqual(0);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/station-documents?stationId=${stationId}&pageNum=${pageNum}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toBeFalsy();

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return forward and previous stations for a specific document', () => {
    const expectedResponse: ForwardPreviousStationsDocument = {
      rithmId: '123-456-789',
      previousStations: [
        {
          rithmId: '789-654-321',
          name: 'Previous station 1',
          totalDocuments: 5,
        },
        {
          rithmId: '789-654-753',
          name: 'Previous station 2',
          totalDocuments: 2,
        },
      ],
      nextStations: [
        {
          rithmId: '852-963-741',
          name: 'Follow station 1',
          totalDocuments: 2,
        },
        {
          rithmId: '852-963-418',
          name: 'Follow station 2',
          totalDocuments: 1,
        },
      ],
    };

    service
      .getConnectedStationInfo(documentId, stationId)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/connected-station-info?documentId=${documentId}&stationId=${stationId}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toBeFalsy();

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return document and station information', () => {
    const expectedResponse: DocumentStationInformation = {
      documentName: 'Metroid Dread',
      documentPriority: 5,
      documentRithmId: 'E204F369-386F-4E41',
      currentAssignedUser: user,
      flowedTimeUTC: '1943827200000',
      lastUpdatedUTC: '1943827200000',
      stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      stationName: 'Development',
      stationPriority: 2,
      stationInstruction: 'This is an instruction',
      stationOwners: [],
      workers: [],
      questions: [],
      instructions: 'General instructions',
      isChained: false,
    };

    service.getDocumentInfo(stationId, documentId).subscribe((response) => {
      expect(response).toBeDefined();
    });

    // outgoing request
    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/document-info?documentId=${documentId}&stationId=${stationId}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toEqual(null);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('Should return the update of the new document name', () => {
    const documentName = 'Almond Flour';
    const expectDocumentName: StandardStringJSON = {
      data: documentName,
    };

    service
      .updateDocumentName(documentId, documentName)
      .subscribe((newDocumentName) => {
        expect(newDocumentName).toEqual(documentName);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/name?rithmId=${documentId}`
    );
    expect(req.request.method).toEqual('PUT');

    expect(req.request.body).toEqual(expectDocumentName);
    req.flush(expectDocumentName);
    httpTestingController.verify();
  });

  it('should return document name', () => {
    const documentName: DocumentName = {
      baseName: 'Metroid Dread',
      appendedName: '',
    };

    service.getDocumentName(documentId).subscribe((response) => {
      expect(response).toEqual(documentName);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/name?documentRithmId=${documentId}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('documentRithmId')).toBe(documentId);
    req.flush(documentName);
    httpTestingController.verify();
  });

  it('should make request to save document answer', () => {
    const expectedAnswers: DocumentAnswer[] = [
      {
        questionRithmId: 'Dev 1',
        documentRithmId: '123-654-789',
        stationRithmId: '741-951-753',
        value: 'Answer Dev',
        file: 'dev.txt',
        filename: 'dev',
        type: QuestionFieldType.Email,
        questionUpdated: true,
      },
      {
        questionRithmId: 'Dev 2',
        documentRithmId: '123-654-789-856',
        stationRithmId: '741-951-753-741',
        value: 'Answer Dev2',
        file: 'dev2.txt',
        filename: 'dev2',
        type: QuestionFieldType.City,
        questionUpdated: false,
      },
    ];

    const formData = new FormData();
    expectedAnswers.forEach((element, index) => {
      formData.append(
        `answers[${index}].questionRithmId`,
        element.questionRithmId
      );
      formData.append(
        `answers[${index}].documentRithmId`,
        element.documentRithmId
      );
      formData.append(
        `answers[${index}].stationRithmId`,
        element.stationRithmId
      );
      formData.append(
        `answers[${index}].value`,
        element.type !== QuestionFieldType.Phone
          ? element.value
          : element.value.replace(/\s/g, '')
      );
      formData.append(`answers[${index}].type`, element.type);
      formData.append(`answers[${index}].questionUpdated`, 'true');
    });

    service
      .saveDocumentAnswer(documentId, expectedAnswers)
      .subscribe((response) => {
        expect(response).toEqual(expectedAnswers);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/answers?documentRithmId=${documentId}`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(formData);

    req.flush(expectedAnswers);
    httpTestingController.verify();
  });

  it('should return updated date from a specific document', () => {
    const expectedResponse: StandardStringJSON = {
      data: '2021-12-09T17:26:47.3506612Z',
    };

    service.getLastUpdated(documentId).subscribe((response) => {
      expect(response).toEqual(expectedResponse.data);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/last-updated?documentRithmId=${documentId}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('documentRithmId')).toBe(documentId);
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return held time in station for document', () => {
    const expectedResponse: StandardStringJSON = {
      data: '2021-12-09T17:26:47.3506612Z',
    };

    service
      .getDocumentTimeInStation(documentId, stationId)
      .subscribe((documentTimeInStation) => {
        expect(documentTimeInStation).toEqual(expectedResponse.data);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/flowed-time?documentRithmId=${documentId}&stationRithmId=${stationId}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('documentRithmId')).toBe(documentId);
    expect(req.request.params.get('stationRithmId')).toBe(stationId);
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return previous questions', () => {
    const expectPreviousQuestions: Question[] = [
      {
        rithmId: '',
        questionType: QuestionFieldType.City,
        prompt: 'string',
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
              value: 'string',
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

    const getPrivate = true;

    service
      .getDocumentPreviousQuestions(documentId, stationId, getPrivate)
      .subscribe((responsePreviousQuestion) => {
        expect(responsePreviousQuestion).toEqual(expectPreviousQuestions);
      });

    const req = httpTestingController.expectOne(
      // eslint-disable-next-line max-len
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/previous-questions?documentRithmId=${documentId}&stationRithmId=${stationId}&getPrivate=${getPrivate}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('documentRithmId')).toBe(documentId);
    expect(req.request.params.get('stationRithmId')).toBe(stationId);
    expect(Boolean(req.request.params.get('getPrivate'))).toBeTrue();

    req.flush(expectPreviousQuestions);
    httpTestingController.verify();
  });

  it('should delete a document', () => {
    service.deleteDocument(documentId).subscribe((response) => {
      expect(response).toBeFalsy();
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/${documentId}`
    );
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
    httpTestingController.verify();
  });

  it('should return the user assigned to the document', () => {
    const expectedResponse: StationRosterMember[] = [
      {
        rithmId: '789-321-456-789',
        firstName: 'John',
        lastName: 'Christopher',
        email: 'johnny.depp@gmail.com',
        isAssigned: true,
      },
    ];

    service
      .getAssignedUserToDocument(documentId, stationId, true)
      .subscribe((documentTimeInStation) => {
        expect(documentTimeInStation).toEqual(expectedResponse);
      });

    const req = httpTestingController.expectOne(
      // eslint-disable-next-line max-len
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/assigned-user?documentId=${documentId}&stationId=${stationId}&getOnlyCurrentStation=true`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('documentId')).toBe(documentId);
    expect(req.request.params.get('stationId')).toBe(stationId);
    expect(Boolean(req.request.params.get('getOnlyCurrentStation'))).toBeTrue();
    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should flow a document', () => {
    const expectedData: DocumentAutoFlow = {
      stationRithmId: stationId,
      documentRithmId: documentId,
      testMode: true,
    };

    service.autoFlowDocument(expectedData).subscribe((response) => {
      expect(response).toBeFalsy();
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/auto-flow`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(expectedData);
    req.flush(null);
    httpTestingController.verify();
  });

  it('should flow a document to previous stations', () => {
    const dataExpect: MoveDocument = {
      fromStationRithmId: stationId,
      toStationRithmIds: ['123-654-789', '222-654-789', '321-456-987'],
      documentRithmId: documentId,
    };

    service.flowDocumentToPreviousStation(dataExpect).subscribe((response) => {
      expect(response).toBeFalsy();
    });
    const router = `${environment.baseApiUrl}${MICROSERVICE_PATH}/flow-station-to-station`;
    const req = httpTestingController.expectOne(router);

    expect(req.request.method).toEqual('POST');
    expect(req.request.url).toEqual(router);
    expect(req.request.body).toEqual(dataExpect);
    req.flush(null);
    httpTestingController.verify();
  });

  it('should unassign a user to document via API', () => {
    const stationRithmId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
    const documentRithmId = 'E204F369-386F-4E41';
    const requestObject = {
      documentRithmId: documentRithmId,
      stationRithmId: stationRithmId,
    };
    service
      .unassignUserToDocument(documentRithmId, stationRithmId)
      .subscribe((response) => {
        expect(response).toBeFalsy();
      });
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/assign-user`
    );
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.body).toEqual(requestObject);
    req.flush(null);
    httpTestingController.verify();
  });

  it('should move the document from a station to another', () => {
    const dataExpect: MoveDocument = {
      fromStationRithmId: stationId,
      toStationRithmIds: ['123-654-789'],
      documentRithmId: documentId,
    };

    service.moveDocument(dataExpect).subscribe((response) => {
      expect(response).toBeFalsy();
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/flow-station-to-station`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(dataExpect);
    req.flush(null);
    httpTestingController.verify();
  });

  it('should assign an user to a document', () => {
    const userRithmId = '123-984-657';
    service
      .assignUserToDocument(userRithmId, stationId, documentId)
      .subscribe((response) => {
        expect(response).toBeFalsy();
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/assign-user`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({
      userRithmId,
      stationRithmId: stationId,
      documentRithmId: documentId,
    });

    req.flush(null);
    httpTestingController.verify();
  });

  it('should create a new document', () => {
    const expectedResponse = {
      /** Document Rithm Id. */ rithmId: '78DF8E53-549E-44CD-8056-A2CBA055F32F',
    };

    const nameDocument = 'The name of Document';
    const priorityDocument = 0;
    const expectedRequestBody = {
      name: nameDocument,
      priority: priorityDocument,
    };

    service
      .createNewDocument(nameDocument, priorityDocument, stationId)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse.rithmId);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}?stationRithmId=${stationId}`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(expectedRequestBody);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return data station widget', () => {
    const columns = { data: ['123-654-798', '753-951-789'] };
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
          questions: [],
        },
        {
          rithmId: '321-123-123',
          name: 'Almond',
          priority: 3,
          flowedTimeUTC: '2022-01-15T16:43:57.901Z',
          lastUpdatedUTC: '2022-01-15T16:43:57.901Z',
          assignedUser: {
            rithmId: '321-123-123',
            firstName: 'Pablo',
            lastName: 'Santos',
            email: 'Jaime@mundo2.com',
            isAssigned: true,
          },
          questions: [],
        },
      ],
    };
    service
      .getStationWidgetDocuments(stationId, columns.data)
      .subscribe((response) => {
        expect(response).toEqual(dataWidgetStation);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/documents-at-station?stationRithmId=${stationId}`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(columns);
    req.flush(dataWidgetStation);
    httpTestingController.verify();
  });

  it('should return the Station flow logic rule', () => {
    const stationRithmId = '3813442c-82c6-4035-893a-86fa9deca7c3';

    const expectStationFlowLogic: FlowLogicRule[] = [flowLogicRule];

    service
      .getStationFlowLogicRule(stationRithmId)
      .subscribe((stationFlowLogic) => {
        expect(stationFlowLogic).toEqual(expectStationFlowLogic);
      });
    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/flow-logic?stationRithmId=${stationRithmId}`
    );
    expect(req.request.params.get('stationRithmId')).toEqual(stationRithmId);
    req.flush(expectStationFlowLogic);
    httpTestingController.verify();
  });

  it('should return events for document', () => {
    const documentRithmId = documentId;
    const expectedEventsResponse: DocumentEvent[] = [
      {
        eventTimeUTC: '2022-01-18T22:13:05.871Z',
        description: 'Event Document #1',
        user: {
          rithmId: '123',
          firstName: 'Testy',
          lastName: 'Test',
          email: 'test@test.com',
          isEmailVerified: true,
          notificationSettings: null,
          createdDate: '1/2/34',
          role: null,
          organization: 'kdjfkd-kjdkfjd-jkjdfkdjk',
        },
      },
    ];
    service.getDocumentEvents(documentRithmId).subscribe((response) => {
      expect(response).toEqual(expectedEventsResponse);
    });
  });

  it('should return array of events for the document history', () => {
    const documentRithmId = documentId;
    const expectedEventsResponse: DocumentEvent[] = [
      {
        eventTimeUTC: '2022-01-18T22:13:05.871Z',
        description: 'Event Document #1',
        user: {
          rithmId: '123',
          firstName: 'Testy',
          lastName: 'Test',
          email: 'test@test.com',
          isEmailVerified: true,
          notificationSettings: null,
          createdDate: '1/2/34',
          role: null,
          organization: 'kdjfkd-kjdkfjd-jkjdfkdjk',
        },
      },
    ];
    service.getDocumentEvents(documentRithmId).subscribe((response) => {
      expect(response).toEqual(expectedEventsResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/history?documentRithmId=${documentRithmId}`
    );
    expect(req.request.params.get('documentRithmId')).toBe(
      'E204F369-386F-4E41'
    );
    expect(req.request.method).toEqual('GET');
    req.flush(expectedEventsResponse);
    httpTestingController.verify();
  });

  it('should make request to save station flow logic', () => {
    const parametersBody = [flowLogicRule];

    service.saveStationFlowLogic(parametersBody).subscribe((response) => {
      expect(response).toBeFalsy();
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/flow-logic`
    );
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(parametersBody);

    req.flush(null);
    httpTestingController.verify();
  });

  it('should call method getDocumentWidget', () => {
    const documentRithm = 'CDB317AA-A5FE-431D-B003-784A578B3FC2';
    const expectedResponse: DocumentWidget = {
      documentName: 'Untitled Document',
      documentRithmId: documentRithm,
      questions: [
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
      ],
      stations: [
        {
          stationRithmId: '431D-B003-784A578B3FC2-CDB317AA-A5FE',
          stationName: 'New station',
        },
      ],
    };

    service.getDocumentWidget(documentRithm).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/document-widget?documentRithmId=${documentRithm}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('documentRithmId')).toEqual(documentRithm);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should update each station flow rules', () => {
    service
      .updateStationFlowLogicRule([flowLogicRule])
      .subscribe((response) => {
        expect(response).toBeFalsy();
      });
  });

  it('should make request to delete station flow logic rule', () => {
    const bodyParameters: FlowLogicRule[] = [flowLogicRule];

    service
      .deleteRuleFromStationFlowLogic(bodyParameters)
      .subscribe((response) => {
        expect(response).toBeFalsy();
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/flow-logic`
    );
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(bodyParameters);

    req.flush(null);
    httpTestingController.verify();
  });
});
