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
      { docName: 'This is a really long document name', stationName: 'Hydrogen', timeInStation: '3 Hours', priority: 2,
      firstName: 'John', lastName: 'Doe', blocked: false, lastUpdated: '' },
      { docName: 'Jane', stationName: 'Helium', timeInStation: '2 Hours', priority: 3,
      firstName: 'Natasha', lastName: 'Romanovsky', blocked: true, lastUpdated: '' },
      { docName: 'Ashley', stationName: 'Lithium', timeInStation: '4 Hours', priority: 2,
      firstName: 'Barney', lastName: 'Stinson', blocked: false, lastUpdated: '' },
      { docName: 'Image', stationName: 'Beryllium', timeInStation: '1 Hours', priority: 1,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: '', stationName: 'Boron', timeInStation: '2 Hours', priority: 2,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Margaret', stationName: 'Carbon', timeInStation: '7 Hours', priority: 8,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: '', stationName: 'Nitrogen', timeInStation: '1 Hours', priority: 4,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Joyce', stationName: 'Oxygen', timeInStation: '2 Hours', priority: 1,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Susie', stationName: 'Fluorine', timeInStation: '3 Hours', priority: 5,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Smith', stationName: 'Neon', timeInStation: '3 Hours', priority: 1,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: '', stationName: 'Sodium', timeInStation: '1 Hours', priority: 7,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Allen', stationName: 'Magnesium', timeInStation: '1 Hours', priority: 1,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: '', stationName: 'Aluminum', timeInStation: '3 Hours', priority: 4,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Tho', stationName: 'Silicon', timeInStation: '6 Hours', priority: 2,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Jacob', stationName: 'Phosphorus', timeInStation: '9 Hours', priority: 9,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: '', stationName: 'Sulfur', timeInStation: '2 Hours', priority: 3,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Daniel', stationName: 'Chlorine', timeInStation: '12 Hours', priority: 1,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: '', stationName: 'Argon', timeInStation: '5 Hours', priority: 2,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Adam', stationName: 'Potassium', timeInStation: '8 Hours', priority: 8,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Bis', stationName: 'Calcium', timeInStation: '1 Hours', priority: 4,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Dose', stationName: 'Neon', timeInStation: '0 Hours', priority: 2,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Larson', stationName: 'Lawrencium', timeInStation: '3 Hours', priority: 7,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Doe', stationName: 'Palladium', timeInStation: '7 Hours', priority: 2,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Anderson', stationName: 'Rubidium', timeInStation: '2 Hours', priority: 3,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Royce', stationName: 'Seaborgium', timeInStation: '6 Hours', priority: 2,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Ashley', stationName: 'Thallium', timeInStation: '1 Hours', priority: 7,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Ed Joyce', stationName: 'Xenon', timeInStation: '16 Hours', priority: 3,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Cooper', stationName: 'Rutherfordium', timeInStation: '3 Hours', priority: 2,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Rock', stationName: 'Erbium', timeInStation: '2 Hours', priority: 5,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'James', stationName: 'Iridium', timeInStation: '8 Hours', priority: 1,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: '', stationName: 'Gallium', timeInStation: '1 Hours', priority: 4,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Peter', stationName: 'Einsteinium', timeInStation: '6 Hours', priority: 2,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Robin', stationName: 'Fluorine', timeInStation: '2 Hours', priority: 7,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: '', stationName: 'Krypton', timeInStation: '1 Hours', priority: 1,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Pola', stationName: 'Lutetium', timeInStation: '4 Hours', priority: 4,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: '', stationName: 'Neodymium', timeInStation: '2 Hours', priority: 2,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Agar', stationName: 'Osmium', timeInStation: '1 Hours', priority: 5,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Qui', stationName: 'Radon', timeInStation: '0 Hours', priority: 3,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'Logo', stationName: 'Samarium', timeInStation: '7 Hours', priority: 2,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
      { docName: 'White', stationName: 'Silicon', timeInStation: '3 Hours', priority: 6,
      firstName: '', lastName: '', blocked: false, lastUpdated: '' },
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
      },
      {
        docName: 'New Doc 3',
        stationName: 'Station name',
        timeInStation: '5 hours',
        priority: 1,
        firstName: '',
        lastName: ''
      },
      {
        docName: 'New Doc 4',
        stationName: 'Station name',
        timeInStation: '7 hours',
        priority: 3,
        firstName: '',
        lastName: ''
      },
      {
        docName: 'New Doc 5',
        stationName: 'Station name',
        timeInStation: '1 hour',
        priority: 7,
        firstName: '',
        lastName: ''
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
      },
      {
        docName: 'New Doc 3',
        stationName: 'Station name',
        timeInStation: '5 hours',
        priority: 1,
        firstName: '',
        lastName: ''
      },
    ];
    return of(filterData).pipe(delay(1000));
  }

}
