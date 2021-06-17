import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Document } from 'src/models';
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
   getStationDocuments(stationId: number, pageNum: number): Observable<Array<Document>> {
    const ELEMENT_DATA: Array<Document> = [
      { docName: 'Natasha', stationName: 'Hydrogen', timeInStation: '3 Hours', priority: 2, firstName: '', lastName: '' },
      { docName: 'Jane', stationName: 'Helium', timeInStation: '2 Hours', priority: 4, firstName: '', lastName: '' },
      { docName: 'Ashley', stationName: 'Lithium', timeInStation: '4 Hours', priority: 2, firstName: '', lastName: '' },
      { docName: 'Image', stationName: 'Beryllium', timeInStation: '1 Hours', priority: 1, firstName: '', lastName: '' },
      { docName: '', stationName: 'Boron', timeInStation: '2 Hours', priority: 4, firstName: '', lastName: '' },
      { docName: 'Margaret', stationName: 'Carbon', timeInStation: '7 Hours', priority: 8, firstName: '', lastName: '' },
      { docName: '', stationName: 'Nitrogen', timeInStation: '1 Hours', priority: 2, firstName: '', lastName: '' },
      { docName: 'Joyce', stationName: 'Oxygen', timeInStation: '2 Hours', priority: 4, firstName: '', lastName: '' },
      { docName: 'Susie', stationName: 'Fluorine', timeInStation: '3 Hours', priority: 1, firstName: '', lastName: '' },
      { docName: 'Smith', stationName: 'Neon', timeInStation: '3 Hours', priority: 4, firstName: '', lastName: '' },
      { docName: '', stationName: 'Sodium', timeInStation: '1 Hours', priority: 9, firstName: '', lastName: '' },
      { docName: 'Allen', stationName: 'Magnesium', timeInStation: '1 Hours', priority: 3, firstName: '', lastName: '' }
    ];
    let filterData = [];
    if (pageNum === 1) {
      pageNum = 0;
      filterData = ELEMENT_DATA.slice(pageNum, 10);
    } else {
      pageNum = ((pageNum * 10) - 10);
      filterData = ELEMENT_DATA.slice(pageNum, (pageNum + 10));
    }
    return of(filterData).pipe(delay(1000));
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
        timeInStation: '2 hours',
        priority: 1,
        firstName: '',
        lastName: ''
      },
      {
        docName: 'New Doc 2',
        stationName: 'Station name',
        timeInStation: '4 hours',
        priority: 2,
        firstName: '',
        lastName: ''
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
        timeInStation: '2 hours',
        priority: 1,
        firstName: '',
        lastName: ''
      },
      {
        docName: 'New Doc 2',
        stationName: 'Station name',
        timeInStation: '4 hours',
        priority: 2,
        firstName: '',
        lastName: ''
      }
    ];
    return of(filterData).pipe(delay(1000));
  }
}
