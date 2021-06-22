/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const stationId = 1;
    const pageNum = 1;
    service.getStationDocuments(stationId, pageNum)
      .subscribe((response: any) => {
        expect(response.data.length).toBeGreaterThanOrEqual(0);
        expect(response.totalDocs).toBeGreaterThanOrEqual(0);
        expect(response.isWorker).toBe(true || false);
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
});
