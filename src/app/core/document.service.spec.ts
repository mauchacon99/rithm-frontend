import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
// eslint-disable-next-line max-len
import { DocumentNameField, ForwardPreviousStationsDocument, StationDocuments, UserType, DocumentStationInformation, StandardStringJSON } from 'src/models';
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
      followingStations: [
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

  it('should return appended fields to document', () => {
    const expectData: DocumentNameField[] = [
      {
        prompt: 'Address',
        rithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a'
      },
      {
        prompt: '/',
        rithmId: ''
      },
      {
        prompt: 'Which is best?',
        rithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a'
      },
    ];

    service.getAppendedFieldsOnDocumentName(stationId)
      .subscribe((response) => {
        expect(response).toEqual(expectData);
      });
  });

  it('should return updated appended fields to document', () => {
    const appendedFields: DocumentNameField[] = [
      {
        prompt: 'Address',
        rithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a'
      },
      {
        prompt: '/',
        rithmId: ''
      },
      {
        prompt: 'Which is best?',
        rithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a'
      },
    ];

    service.updateDocumentAppendedFields(stationId, appendedFields)
      .subscribe((response) => {
        expect(response).toEqual(appendedFields);
      });
  });

  it('should return document name', () => {
    const documentName: StandardStringJSON = {
      data: 'Metroid Dread'
    };

    service.getDocumentName(documentId)
      .subscribe((response) => {
        expect(response).toEqual(documentName);
      });
  });

});
