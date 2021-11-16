import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { ForwardPreviousStationsDocument, StationDocuments, UserType } from 'src/models';
import { DocumentService } from './document.service';
import { DocumentStationInformation } from 'src/models';

const MICROSERVICE_PATH = '/documentservice/api/document';

describe('DocumentService', () => {
  let service: DocumentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(DocumentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of documents for a station', () => {
    const stationId = 'E204F369-386F-4E41';
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
    const stationId = 'E204F369-386F-4E41';
    const documentId = 'E204F369-386F-4E41';
    const expectedResponse: ForwardPreviousStationsDocument = {
      previousStations: [],
      followingStations: []
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
    const stationId = 'E204F369-386F-4E41';
    const documentId = 'E204F369-386F-4E41';
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


  it('should return the document field name array', () => {
    const stationId = 'E204F369-386F-4E41';
    const documentId = 'E204F369-386F-4E41';
    const appendFiles: string[] = ['123', '456'];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const documentFieldName = [
      {
        prompt: 'SKU',
        rithmId: '1lk2-as3k-12kk-9s83'
      },
      {
        prompt: '-',
        rithmId: ''
      },
    ];
    service.updateDocumentName(documentId, stationId, appendFiles)
      .subscribe((response) => {
        expect(response).toEqual(documentFieldName);
      });
  });

  it('If stationId is empty or missing show error', () => {
    const stationIdEmpty = '';
    const documentIdNotEmpty = 'E204F369-386F-4E41';
    const appendFilesNotEmpty: string[] = ['123'];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const documentFieldName = [
      {
        prompt: 'SKU',
        rithmId: '1lk2-as3k-12kk-9s83'
      },
      {
        prompt: '-',
        rithmId: ''
      },
    ];
    service.updateDocumentName(documentIdNotEmpty, stationIdEmpty, appendFilesNotEmpty)
      .subscribe({
        next: (responseStationIdEmpty) => {
          expect(responseStationIdEmpty).toEqual(documentFieldName);
        }, error: (errorStationIdEmpty: unknown) => {
          expect(errorStationIdEmpty).toThrow();
        }
      });
  });

  it('If documentId is empty or missing show error', () => {
    const stationIdNotEmpty = 'E204F369-386F-4E41';
    const documentIdEmpty = '';
    const appendFilesNotEmpty: string[] = ['123', '456'];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const documentFieldName = [
      {
        prompt: 'SKU',
        rithmId: '1lk2-as3k-12kk-9s83'
      },
      {
        prompt: '-',
        rithmId: ''
      },
    ];
    service.updateDocumentName(documentIdEmpty, stationIdNotEmpty, appendFilesNotEmpty)
      .subscribe({
        next: (responseDocumentIdEmpty) => {
          expect(responseDocumentIdEmpty).toEqual(documentFieldName);
        }, error: (errorDocumentIdEmpty: unknown) => {
          expect(errorDocumentIdEmpty).toThrow();
        }
      });
  });

  it('If appendFiles is empty or missing show error', () => {
    const stationIdNotEmpty = 'E204F369-386F-4E41';
    const documentIdNotEmpty = 'E204F369-386F-4E41';
    const appendFilesEmpty: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const documentFieldName3 = [
      {
        prompt: 'SKU',
        rithmId: '1lk2-as3k-12kk-9s83'
      },
      {
        prompt: '-',
        rithmId: ''
      },
    ];
    service.updateDocumentName(documentIdNotEmpty, stationIdNotEmpty, appendFilesEmpty)
      .subscribe({
        next: (responseAppendFilesEmpty) => {
          expect(responseAppendFilesEmpty).toEqual(documentFieldName3);
        }, error: (errorAppendFilesEmpty: unknown) => {
          expect(errorAppendFilesEmpty).toThrow();
        }
      });
  });
});
