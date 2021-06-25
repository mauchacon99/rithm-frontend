import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { delay } from 'rxjs/operators';
import { Document, StationDocumentsResponse } from 'src/models';

// const MICROSERVICE_PATH = '/documentservice';

/**
 * Service for all document behavior and business logic.
 */
@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(
    private http: HttpClient) { }

  /**
   * Gets a list of documents for a given station.
   *
   * @param stationId The station for which to get the documents.
   * @param pageNum The desired page number of results.
   * @returns A list of documents (one page worth).
   */
  getStationDocuments(stationId: string, pageNum: number): Observable<StationDocumentsResponse> {
    const ELEMENT_DATA: StationDocumentsResponse = {
      documentList: [
      /* eslint-disable max-len */
      { rithmId: '1', docName: 'Natasha', stationName: 'Hydrogen', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: 'Adarsh', lastName: 'Achar', blocked: true, lastUpdated: '' },
      { rithmId: '2', docName: 'Jane', stationName: 'Helium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 3, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '3', docName: 'Ashley', stationName: 'Lithium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { rithmId: '4', docName: 'Image', stationName: 'Beryllium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { rithmId: '5', docName: '', stationName: 'Boron', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { rithmId: '6', docName: 'Margaret', stationName: 'Carbon', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 8, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { rithmId: '7', docName: '', stationName: 'Nitrogen', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 4, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { rithmId: '8', docName: 'Joyce', stationName: 'Oxygen', timeEnteredStation: '', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { rithmId: '9', docName: 'Susie', stationName: 'Fluorine', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 5, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { rithmId: '10', docName: 'Smith', stationName: 'Neon', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { rithmId: '11', docName: '', stationName: 'Sodium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 7, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { rithmId: '12', docName: 'Allen', stationName: 'Magnesium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '13', docName: '', stationName: 'Aluminum', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 4, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { rithmId: '14', docName: 'Tho', stationName: 'Silicon', timeEnteredStation: '', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '15', docName: 'Jacob', stationName: 'Phosphorus', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 9, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '16', docName: '', stationName: 'Sulfur', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 3, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '17', docName: 'Daniel', stationName: 'Chlorine', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: '', stationName: 'Argon', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Adam', stationName: 'Potassium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 8, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Bis', stationName: 'Calcium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 4, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Dose', stationName: 'Neon', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Larson', stationName: 'Lawrencium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 7, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Doe', stationName: 'Palladium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Anderson', stationName: 'Rubidium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 3, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Royce', stationName: 'Seaborgium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Ashley', stationName: 'Thallium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 7, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Ed Joyce', stationName: 'Xenon', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 3, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Cooper', stationName: 'Rutherfordium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Rock', stationName: 'Erbium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 5, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'James', stationName: 'Iridium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: '', stationName: 'Gallium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 4, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Peter', stationName: 'Einsteinium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Robin', stationName: 'Fluorine', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 7, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: '', stationName: 'Krypton', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Pola', stationName: 'Lutetium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 4, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: '', stationName: 'Neodymium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Agar', stationName: 'Osmium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 5, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Qui', stationName: 'Radon', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 3, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'Logo', stationName: 'Samarium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { rithmId: '', docName: 'White', stationName: 'Silicon', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 6, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      /* eslint-enable max-len */
    ],
    numberOfDocument: 40, isWorker: true
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
        rithmId: '1',
        docName: 'Really long document name',
        stationName: 'really long Station name',
        timeEnteredStation: '2021-06-18T17:26:47.3506612Z',
        priority: 1,
        firstName: '',
        lastName: '',
        blocked: false,
        lastUpdated: '2021-06-16T17:26:47.3506612Z'
      },
      {
        rithmId: '2',
        docName: 'New Doc 2',
        stationName: 'Station name',
        timeEnteredStation: '2021-06-18T21:17:34.3506612Z',
        priority: 2,
        firstName: '',
        lastName: '',
        blocked: false,
        lastUpdated: '2021-06-16T17:26:47.3506612Z'
      },
      {
        rithmId: '3',
        docName: 'New Doc 3',
        stationName: 'Station name',
        timeEnteredStation: '2021-06-18T19:46:47.3506612Z',
        priority: 1,
        firstName: '',
        lastName: '',
        blocked: false,
        lastUpdated: '2021-06-16T17:26:47.3506612Z'
      },
      {
        rithmId: '4',
        docName: 'New Doc 4',
        stationName: 'Station name',
        timeEnteredStation: '2021-06-16T17:26:47.3506612Z',
        priority: 3,
        firstName: '',
        lastName: '',
        blocked: false,
        lastUpdated: '2021-06-16T17:26:47.3506612Z'
      },
      {
        rithmId: '5',
        docName: 'New Doc 5',
        stationName: 'Station name',
        timeEnteredStation: '2021-06-16T17:26:47.3506612Z',
        priority: 7,
        firstName: '',
        lastName: '',
        blocked: false,
        lastUpdated: '2021-06-16T17:26:47.3506612Z'
      }
    ];
    return of(filterData).pipe(delay(1000));
  }

  /**
   * Gets a list of priority queue documents.
   *
   * @returns A list of top priority queue documents.
   */
  getPriorityQueueDocuments(): Observable<Document[]> {
    const filterData: Document[] = [
      {
        rithmId: '1',
        docName: 'Really long document name',
        stationName: 'really long Station name',
        timeEnteredStation: '2021-06-16T17:26:47.3506612Z',
        priority: 1,
        firstName: '',
        lastName: '',
        blocked: false,
        lastUpdated: '2021-06-16T17:26:47.3506612Z'
      },
      {
        rithmId: '2',
        docName: 'New Doc 2',
        stationName: 'Station name',
        timeEnteredStation: '2021-06-16T17:26:47.3506612Z',
        priority: 2,
        firstName: '',
        lastName: '',
        blocked: false,
        lastUpdated: '2021-06-16T17:26:47.3506612Z'
      },
      {
        rithmId: '3',
        docName: 'New Doc 3',
        stationName: 'Station name',
        timeEnteredStation: '2021-06-16T17:26:47.3506612Z',
        priority: 1,
        firstName: '',
        lastName: '',
        blocked: false,
        lastUpdated: '2021-06-16T17:26:47.3506612Z'
      },
    ];
    return of(filterData).pipe(delay(1000));
  }

}
