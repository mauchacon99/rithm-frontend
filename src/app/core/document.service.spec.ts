import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
// eslint-disable-next-line max-len
import { ForwardPreviousStationsDocument, StationDocuments, UserType, DocumentStationInformation, StandardStringJSON, DocumentAnswer, QuestionFieldType } from 'src/models';
import { DocumentService } from './document.service';

const MICROSERVICE_PATH = '/documentservice/api/document';

describe('DocumentService', () => {
  let service: DocumentService;
  let httpTestingController: HttpTestingController;
  const stationId = 'E204F369-386F-4E41';
  const documentId = 'E204F369-386F-4E41';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
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
        { documentName: 'Almond Flour', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: '', isEscalated: true, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Apple Crisps', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 7, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Apple Sauce', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 3, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Bagel Seasoning', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 7, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Baking Soda', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 9, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Banana Crisps', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 1, userAssigned: 'John Doe', isEscalated: true, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Black Pepper', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Borax', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 1, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Bowtie Pasta', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '', priority: 2, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Calcium', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 3, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        /* eslint-enable max-len */
      ],
      totalDocuments: 40, userType: UserType.Admin
    };
    service.getStationDocuments(stationId, pageNum)
      .subscribe((response) => {
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
          totalDocuments: 5
        },
        {
          rithmId: '789-654-753',
          name: 'Previous station 2',
          totalDocuments: 2
        }
      ],
      nextStations: [
        {
          rithmId: '852-963-741',
          name: 'Follow station 1',
          totalDocuments: 2
        },
        {
          rithmId: '852-963-418',
          name: 'Follow station 2',
          totalDocuments: 1
        }
      ]
    };

    service.getConnectedStationInfo(documentId, stationId)
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
      currentAssignedUser: 'NS',
      flowedTimeUTC: '1943827200000',
      lastUpdatedUTC: '1943827200000',
      stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      stationName: 'Development',
      stationPriority: 2,
      stationInstruction: 'This is an instruction',
      stationOwners: [],
      workers: [],
      questions: [],
      instructions: 'General instructions'
    };

    service.getDocumentInfo(stationId, documentId)
      .subscribe((response) => {
        expect(response).toBeDefined();
      });

    // outgoing request
    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/document-info?documentId=${documentId}&stationId=${stationId}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toEqual(null);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('Should return the update of the new document name', () => {
    const documentName = 'Almond Flour';

    service.updateDocumentName(documentId, documentName)
      .subscribe((newDocumentName) => {
        expect(newDocumentName).toEqual(documentName);
      });

    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/name?rithmId=${documentId}`);
    expect(req.request.method).toEqual('PUT');

    const newDocumentName: StandardStringJSON = {
      data: documentName
    };
    expect(req.request.body).toEqual(newDocumentName);
    req.flush(newDocumentName);
    httpTestingController.verify();
  });

  it('should return document name', () => {
    const documentName: StandardStringJSON = {
      data: 'Metroid Dread'
    };


    service.getDocumentName(documentId)
      .subscribe((response) => {
        expect(response).toEqual(documentName.data);
      });

    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/name?documentRithmId=${documentId}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('documentRithmId')).toBe(documentId);
    req.flush(documentName);
    httpTestingController.verify();

  });


  it('should make request to save document answer', () => {
    const expectedAnswers: DocumentAnswer[] = [{
      questionRithmId: 'Dev 1',
      documentRithmId: '123-654-789',
      stationRithmId: '741-951-753',
      value: 'Answer Dev',
      file: 'dev.txt',
      filename: 'dev',
      type: QuestionFieldType.Email,
      rithmId: '789-321-456',
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
      rithmId: '789-321-456-789',
      questionUpdated: false,
    }];

    service.saveAnswerToDocument(documentId, expectedAnswers)
      .subscribe((response) => {
        expect(response).toEqual(expectedAnswers);
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/answers?documentRithmId=${documentId}`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(expectedAnswers);

    req.flush(expectedAnswers);
    httpTestingController.verify();
  });
});
