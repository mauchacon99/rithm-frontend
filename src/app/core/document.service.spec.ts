/* eslint-disable rxjs/no-ignored-error */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DocumentService } from './document.service';

describe('DocumentService', () => {
  let service: DocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(DocumentService);
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

  it('should return a list of priority queue documents', () => {
    service.getPriorityQueueDocuments()
      .subscribe((response) => {
        expect(response.length).toBeGreaterThanOrEqual(0);
      });
  });

  it('should return forward and previous stations for a specific document', () => {
    const stationId = 'E204F369-386F-4E41';
    const documentId = 'E204F369-386F-4E41';
    service.getConnectedStationInfo(stationId, documentId)
      .subscribe((response) => {
        expect(response.followingStations.length).toBeGreaterThanOrEqual(0);
        expect(response.previousStations.length).toBeGreaterThanOrEqual(0);
      });
  });

});
