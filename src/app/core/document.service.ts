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
      { docName: 'Natasha', stationName: 'Hydrogen', timeInStation: 1624029879388, priority: 2, firstName: '', lastName: '' },
      { docName: 'Jane', stationName: 'Helium', timeInStation: 1624029879388, priority: 3, firstName: '', lastName: '' },
      { docName: 'Ashley', stationName: 'Lithium', timeInStation: 1624029879388, priority: 2, firstName: '', lastName: '' },
      { docName: 'Image', stationName: 'Beryllium', timeInStation: 1624029879388, priority: 1, firstName: '', lastName: '' },
      { docName: '', stationName: 'Boron', timeInStation: 1624029879388, priority: 2, firstName: '', lastName: '' },
      { docName: 'Margaret', stationName: 'Carbon', timeInStation: 1624029879388, priority: 8, firstName: '', lastName: '' },
      { docName: '', stationName: 'Nitrogen', timeInStation: 1624029879388, priority: 4, firstName: '', lastName: '' },
      { docName: 'Joyce', stationName: 'Oxygen', timeInStation: 1624029879388, priority: 1, firstName: '', lastName: '' },
      { docName: 'Susie', stationName: 'Fluorine', timeInStation: 1624029879388, priority: 5, firstName: '', lastName: '' },
      { docName: 'Smith', stationName: 'Neon', timeInStation: 1624029879388, priority: 1, firstName: '', lastName: '' },
      { docName: '', stationName: 'Sodium', timeInStation: 1624029879388, priority: 7, firstName: '', lastName: '' },
      { docName: 'Allen', stationName: 'Magnesium', timeInStation: 1624029879388, priority: 1, firstName: '', lastName: '' },
      { docName: '', stationName: 'Aluminum', timeInStation: 1624029879388, priority: 4, firstName: '', lastName: '' },
      { docName: 'Tho', stationName: 'Silicon', timeInStation: 1624029879388, priority: 2, firstName: '', lastName: '' },
      { docName: 'Jacob', stationName: 'Phosphorus', timeInStation: 1624029879388, priority: 9, firstName: '', lastName: '' },
      { docName: '', stationName: 'Sulfur', timeInStation: 1624029879388, priority: 3, firstName: '', lastName: '' },
      { docName: 'Daniel', stationName: 'Chlorine', timeInStation: 1624029879388, priority: 1, firstName: '', lastName: '' },
      { docName: '', stationName: 'Argon', timeInStation: 1624029879388, priority: 2, firstName: '', lastName: '' },
      { docName: 'Adam', stationName: 'Potassium', timeInStation: 1624029879388, priority: 8, firstName: '', lastName: '' },
      { docName: 'Bis', stationName: 'Calcium', timeInStation: 1624029879388, priority: 4, firstName: '', lastName: '' },
      { docName: 'Dose', stationName: 'Neon', timeInStation: 1624029879388, priority: 2, firstName: '', lastName: '' },
      { docName: 'Larson', stationName: 'Lawrencium', timeInStation: 1624029879388, priority: 7, firstName: '', lastName: '' },
      { docName: 'Doe', stationName: 'Palladium', timeInStation: 1624029879388, priority: 2, firstName: '', lastName: '' },
      { docName: 'Anderson', stationName: 'Rubidium', timeInStation: 1624029879388, priority: 3, firstName: '', lastName: '' },
      { docName: 'Royce', stationName: 'Seaborgium', timeInStation: 1624029879388, priority: 2, firstName: '', lastName: '' },
      { docName: 'Ashley', stationName: 'Thallium', timeInStation: 1624029879388, priority: 7, firstName: '', lastName: '' },
      { docName: 'Ed Joyce', stationName: 'Xenon', timeInStation: 1624029879388, priority: 3, firstName: '', lastName: '' },
      { docName: 'Cooper', stationName: 'Rutherfordium', timeInStation: 1624029879388, priority: 2, firstName: '', lastName: '' },
      { docName: 'Rock', stationName: 'Erbium', timeInStation: 1624029879388, priority: 5, firstName: '', lastName: '' },
      { docName: 'James', stationName: 'Iridium', timeInStation: 1624029879388, priority: 1, firstName: '', lastName: '' },
      { docName: '', stationName: 'Gallium', timeInStation: 1624029879388, priority: 4, firstName: '', lastName: '' },
      { docName: 'Peter', stationName: 'Einsteinium', timeInStation: 1624029879388, priority: 2, firstName: '', lastName: '' },
      { docName: 'Robin', stationName: 'Fluorine', timeInStation: 1624029879388, priority: 7, firstName: '', lastName: '' },
      { docName: '', stationName: 'Krypton', timeInStation: 1624029879388, priority: 1, firstName: '', lastName: '' },
      { docName: 'Pola', stationName: 'Lutetium', timeInStation: 1624029879388, priority: 4, firstName: '', lastName: '' },
      { docName: '', stationName: 'Neodymium', timeInStation: 1624029879388, priority: 2, firstName: '', lastName: '' },
      { docName: 'Agar', stationName: 'Osmium', timeInStation: 1624029879388, priority: 5, firstName: '', lastName: '' },
      { docName: 'Qui', stationName: 'Radon', timeInStation: 1624029879388, priority: 3, firstName: '', lastName: '' },
      { docName: 'Logo', stationName: 'Samarium', timeInStation: 1624029879388, priority: 2, firstName: '', lastName: '' },
      { docName: 'White', stationName: 'Silicon', timeInStation: 1624029879388, priority: 6, firstName: '', lastName: '' },
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
        timeInStation: 1624029879388,
        priority: 1,
        firstName: '',
        lastName: ''
      },
      {
        docName: 'New Doc 2',
        stationName: 'Station name',
        timeInStation: 1623550000000,
        priority: 2,
        firstName: '',
        lastName: ''
      },
      {
        docName: 'New Doc 3',
        stationName: 'Station name',
        timeInStation: 1623500000000,
        priority: 1,
        firstName: '',
        lastName: ''
      },
      {
        docName: 'New Doc 4',
        stationName: 'Station name',
        timeInStation: 1622000000000,
        priority: 3,
        firstName: '',
        lastName: ''
      },
      {
        docName: 'New Doc 5',
        stationName: 'Station name',
        timeInStation: 1623000000000,
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
        timeInStation: 1624029896789,
        priority: 1,
        firstName: '',
        lastName: ''
      },
      {
        docName: 'New Doc 2',
        stationName: 'Station name',
        timeInStation: 1620000000000,
        priority: 2,
        firstName: '',
        lastName: ''
      },
      {
        docName: 'New Doc 3',
        stationName: 'Station name',
        timeInStation: 1621000000000,
        priority: 1,
        firstName: '',
        lastName: ''
      },
    ];
    return of(filterData).pipe(delay(1000));
  }

}
