import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Document, StationDocumentsResponse } from 'src/models';
/**
 * Mocks methods of the `DocumentService`.
 */
export class MockDocumentService {

  /**
   * Gets a list of documents for a given station.
   *
   * @param stationId The station for which to get the documents.
   * @param pageNum The desired page number of results.
   * @returns A list of documents (one page worth).
   */
  getStationDocuments(stationId: number, pageNum: number): Observable<StationDocumentsResponse> {
    const ELEMENT_DATA: StationDocumentsResponse = {
      documentList: [
        /* eslint-disable max-len */
        { docName: 'Natasha', stationName: 'Hydrogen', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: true, lastUpdated: '' },
        { docName: 'Jane', stationName: 'Helium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 3, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
        { docName: 'Ashley', stationName: 'Lithium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
        { docName: 'Image', stationName: 'Beryllium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
        { docName: '', stationName: 'Boron', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
        { docName: 'Margaret', stationName: 'Carbon', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 8, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
        { docName: '', stationName: 'Nitrogen', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 4, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
        { docName: 'Joyce', stationName: 'Oxygen', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
        { docName: 'Susie', stationName: 'Fluorine', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 5, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
        { docName: 'Smith', stationName: 'Neon', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
        { docName: '', stationName: 'Sodium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 7, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
        { docName: 'Allen', stationName: 'Magnesium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
        /* eslint-enable max-len */
      ], numberOfDocument: 30, isWorker: true
    };
    if (pageNum === 1) {
      pageNum = 0;
      ELEMENT_DATA.documentList = ELEMENT_DATA.documentList.slice(pageNum, 10);
    } else {
      pageNum = ((pageNum * 10) - 10);
      ELEMENT_DATA.documentList = ELEMENT_DATA.documentList.slice(pageNum, (pageNum + 10));
    }
    return of(ELEMENT_DATA).pipe(delay(1000));
  }

  /**
   * Gets a list of previously started documents.
   *
   * @returns A list of previously started documents.
   */
  getPreviouslyStartedDocuments(): Observable<Document[]> {
    const filterData: Document[] = [
      {
        docName: 'Really long document name',
        stationName: 'really long Station name',
        timeEnteredStation: '2021-06-18T17:26:47.3506612Z',
        priority: 1,
        firstName: '',
        lastName: '',
        blocked: false,
        lastUpdated: ''
      },
      {
        docName: 'New Doc 2',
        stationName: 'Station name',
        timeEnteredStation: '2021-06-18T21:17:34.3506612Z',
        priority: 2,
        firstName: '',
        lastName: '',
        blocked: false,
        lastUpdated: ''
      }
    ];
    return of(filterData).pipe(delay(1000));
  }

  /**
   * Gets a list of priority queue documents.
   *
   * @returns A list of priority queue documents.
   */
  getPriorityQueueDocuments(): Observable<Document[]> {
    const filterData: Document[] = [
      {
        docName: 'Really long document name',
        stationName: 'really long Station name',
        timeEnteredStation: '2021-06-18T17:26:47.3506612Z',
        priority: 1,
        firstName: '',
        lastName: '',
        blocked: false,
        lastUpdated: ''
      },
      {
        docName: 'New Doc 2',
        stationName: 'Station name',
        timeEnteredStation: '2021-06-18T21:17:34.3506612Z',
        priority: 2,
        firstName: '',
        lastName: '',
        blocked: false,
        lastUpdated: ''
      }
    ];
    return of(filterData).pipe(delay(1000));
  }
}
