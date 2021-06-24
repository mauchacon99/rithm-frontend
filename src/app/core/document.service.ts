import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { delay } from 'rxjs/operators';
import { Document } from 'src/models';

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
  getStationDocuments(stationId: number, pageNum: number): Observable<Array<Document>> {
    const ELEMENT_DATA: Array<Document> = [
      /* eslint-disable max-len */
      { docName: 'Natasha', stationName: 'Hydrogen', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: true, lastUpdated: '' },
      { docName: 'Jane', stationName: 'Helium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 3, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Ashley', stationName: 'Lithium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { docName: 'Image', stationName: 'Beryllium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { docName: '', stationName: 'Boron', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { docName: 'Margaret', stationName: 'Carbon', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 8, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { docName: '', stationName: 'Nitrogen', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 4, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { docName: 'Joyce', stationName: 'Oxygen', timeEnteredStation: '', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { docName: 'Susie', stationName: 'Fluorine', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 5, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { docName: 'Smith', stationName: 'Neon', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { docName: '', stationName: 'Sodium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 7, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { docName: 'Allen', stationName: 'Magnesium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: '', stationName: 'Aluminum', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 4, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
      { docName: 'Tho', stationName: 'Silicon', timeEnteredStation: '', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Jacob', stationName: 'Phosphorus', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 9, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: '', stationName: 'Sulfur', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 3, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Daniel', stationName: 'Chlorine', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: '', stationName: 'Argon', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Adam', stationName: 'Potassium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 8, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Bis', stationName: 'Calcium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 4, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Dose', stationName: 'Neon', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Larson', stationName: 'Lawrencium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 7, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Doe', stationName: 'Palladium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Anderson', stationName: 'Rubidium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 3, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Royce', stationName: 'Seaborgium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Ashley', stationName: 'Thallium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 7, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Ed Joyce', stationName: 'Xenon', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 3, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Cooper', stationName: 'Rutherfordium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Rock', stationName: 'Erbium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 5, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'James', stationName: 'Iridium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: '', stationName: 'Gallium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 4, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Peter', stationName: 'Einsteinium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Robin', stationName: 'Fluorine', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 7, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: '', stationName: 'Krypton', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Pola', stationName: 'Lutetium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 4, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: '', stationName: 'Neodymium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Agar', stationName: 'Osmium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 5, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Qui', stationName: 'Radon', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 3, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Logo', stationName: 'Samarium', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'White', stationName: 'Silicon', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 6, firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      /* eslint-enable max-len */
    ];
    // return this.http.get<DashboardStationResponse[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/api/Dashboard/Stations`);
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
        timeEnteredStation: '2021-06-18T17:26:47.3506612Z',
        priority: 1,
        firstName: '',
        lastName: '',
        blocked: false,
        lastUpdated: '2021-06-16T17:26:47.3506612Z'
      },
      {
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
