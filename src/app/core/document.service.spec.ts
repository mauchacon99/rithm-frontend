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
      .subscribe((response) => {
        expect(response.length).toBeGreaterThanOrEqual(0);
      });
  });
});
