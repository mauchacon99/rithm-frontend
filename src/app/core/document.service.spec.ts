 /* eslint-disable rxjs/no-ignored-error */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { ForwardPreviousStationsDocument } from 'src/models';
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
    service.getStationDocuments(stationId, pageNum)
      .subscribe((response) => {
        expect(response.documentList.length).toBeGreaterThanOrEqual(0);
      });
  });

  it('should return a list of previously started documents', () => {
    service.getPreviouslyStartedDocuments()
      .subscribe((response) => {
        expect(response.length).toBeGreaterThanOrEqual(0);
      });
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
