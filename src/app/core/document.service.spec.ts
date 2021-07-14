/* eslint-disable max-len */
/* eslint-disable rxjs/no-ignored-error */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { ForwardPreviousStationsDocument, StationDocumentsResponse } from 'src/models';
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
    const expectedResponse: StationDocumentsResponse = {
      documentList: [
        { rithmId: '1', documentName: 'Almond Flour', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: '', isEscalated: true, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', userRithmId: '', documentRithmId: '', stationRithmId: '', id: 1 },
        { rithmId: '2', documentName: 'Apple Crisps', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 7, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', userRithmId: '', documentRithmId: '', stationRithmId: '', id: 1 },
        { rithmId: '3', documentName: 'Apple Sauce', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 3, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', userRithmId: '', documentRithmId: '', stationRithmId: '', id: 1 },
        { rithmId: '4', documentName: 'Bagel Seasoning', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 7, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', userRithmId: '', documentRithmId: '', stationRithmId: '', id: 1 },
        { rithmId: '5', documentName: 'Baking Soda', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 9, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', userRithmId: '', documentRithmId: '', stationRithmId: '', id: 1 },
        { rithmId: '6', documentName: 'Banana Crisps', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 1, userAssigned: 'John Doe', isEscalated: true, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', userRithmId: '', documentRithmId: '', stationRithmId: '', id: 1 },
        { rithmId: '7', documentName: 'Black Pepper', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', userRithmId: '', documentRithmId: '', stationRithmId: '', id: 1 },
        { rithmId: '8', documentName: 'Borax', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 1, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', userRithmId: '', documentRithmId: '', stationRithmId: '', id: 1 },
        { rithmId: '9', documentName: 'Bowtie Pasta', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '', priority: 2, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', userRithmId: '', documentRithmId: '', stationRithmId: '', id: 1 },
        { rithmId: '10', documentName: 'Calcium', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 3, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', userRithmId: '', documentRithmId: '', stationRithmId: '', id: 1 },
      ],
      numberOfDocument: 40, userType: 'admin'
    };
    service.getStationDocuments(stationId, pageNum)
      .subscribe((response) => {
        expect(response.documentList.length).toBeGreaterThanOrEqual(0);
      });

    const req = httpTestingController.expectOne(
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/stationdocuments?stationId=${stationId}&pageNum=${pageNum}`
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
      `${environment.baseApiUrl}${MICROSERVICE_PATH}/connectedstationinfo?documentId=${documentId}&stationId=${stationId}`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toBeFalsy();

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should return document and station information', () => {
    const stationId = 'E204F369-386F-4E41';
    const documentId = 'E204F369-386F-4E41';
    const mode = 'worker';
    const expectedResponse: DocumentStationInformation = {
      documentName: 'Metroid Dread',
      documentPriority: 5,
      currentAssignedUser: 'NS',
      flowedTimeUTC: '1943827200000',
      lastUpdatedUTC: '1943827200000',
      stationName: 'Development',
      stationPriority: 2,
      supervisorRoster: ['SA', 'RI', 'NI'],
      workerRoster: []
    };

    service.getDocumentInfo(stationId, documentId, mode)
      .subscribe((response) => {
        expect(response).toBeDefined();
      });

    // outgoing request
    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/documentinfo?documentId=${documentId}&stationId=${stationId}&mode=${mode}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.body).toEqual(null);

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

});
