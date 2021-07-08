import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { delay } from 'rxjs/operators';
import {
  Document, StationDocumentsResponse, ForwardPreviousStationsDocument, ConnectedStationInfo, DocumentStationInformation
} from 'src/models';

const MICROSERVICE_PATH = '/documentservice/api/document';

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
        { rithmId: '1', docName: 'Almond Flour', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: true, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '2', docName: 'Apple Crisps', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 7, firstName: 'John', lastName: 'Doe', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '3', docName: 'Apple Sauce', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 3, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '4', docName: 'Bagel Seasoning', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 7, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '5', docName: 'Baking Soda', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 9, firstName: 'John', lastName: 'Doe', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '6', docName: 'Banana Crisps', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: 'John', lastName: 'Doe', blocked: true, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '7', docName: 'Black Pepper', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: 'John', lastName: 'Doe', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '8', docName: 'Borax', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '9', docName: 'Bowtie Pasta', stationName: 'Dry Goods & Liquids', timeEnteredStation: '', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '10', docName: 'Calcium', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 3, firstName: 'John', lastName: 'Doe', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '11', docName: 'Citrus Oil', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 5, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '12', docName: 'Coconut Flakes', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 3, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '13', docName: 'Coconut Oil', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 8, firstName: 'John', lastName: 'Doe', blocked: true, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '14', docName: 'Coriander', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '15', docName: 'Fennel Seeds', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 3, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '16', docName: 'Garlic Powder', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '17', docName: 'Glycerin', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '18', docName: 'Grain Flour', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 4, firstName: 'John', lastName: 'Doe', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '19', docName: 'Grape Seed Oil', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 6, firstName: 'John', lastName: 'Doe', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '20', docName: 'Hemp Protein Powder', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '21', docName: 'High Gluten Flour', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 7, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '22', docName: 'Himalayan Pink Salt', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: 'John', lastName: 'Doe', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '23', docName: 'Jalapeno Powder', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 4, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '24', docName: 'Jasmine Rice', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '25', docName: 'Lemon Zest', stationName: 'Dry Goods & Liquids', timeEnteredStation: '', priority: 1, firstName: 'John', lastName: 'Doe', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '26', docName: 'Light Brown Sugar', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '27', docName: 'Malic Acid Powder', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '28', docName: 'Mango Powder', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 4, firstName: 'John', lastName: 'Doe', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '29', docName: 'Maple Syrup', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 4, firstName: 'John', lastName: 'Doe', blocked: true, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '30', docName: 'Onion Powder', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 7, firstName: '', lastName: '', blocked: true, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '31', docName: 'Paprika', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 5, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '32', docName: 'Rice Bran Oil', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 5, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '33', docName: 'Rosemary Leaves', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 1, firstName: 'John', lastName: 'Doe', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '34', docName: 'Sea Salt', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: 'John', lastName: 'Doe', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '35', docName: 'Sorbitol Powder', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: 'John', lastName: 'Doe', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '36', docName: 'Sprinkles', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: 'John', lastName: 'Doe', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '37', docName: 'Tart Cherry Extract Powder', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 3, firstName: '', lastName: '', blocked: true, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '38', docName: 'Trehalose', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 8, firstName: '', lastName: '', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '39', docName: 'Vitamin C', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 2, firstName: 'John', lastName: 'Doe', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
        { rithmId: '40', docName: 'Vitamin E Oil', stationName: 'Dry Goods & Liquids', timeEnteredStation: '2021-06-16T17:26:47.3506612Z', priority: 4, firstName: 'John', lastName: 'Doe', blocked: false, lastUpdated: '2021-06-16T17:26:47.3506612Z' },
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

  /**
   * Gets a list of forward and previous stations for a specific document.
   *
   * @param documentId The Specific id of document.
   * @param stationId The Specific id of station.
   * @returns A list of forward and previous stations for a specific document.
   */
  getConnectedStationInfo(documentId: string, stationId: string): Observable<ForwardPreviousStationsDocument> {
    const previousStations: Array<ConnectedStationInfo> = [{
      stationName: 'Development',
      totalDocuments: 5,
      isGenerator: true
    }, {
      stationName: 'Requirement',
      totalDocuments: 8,
      isGenerator: false
    }];
    const followingStations: Array<ConnectedStationInfo> = [{
      stationName: 'Station-1',
      totalDocuments: 2,
      isGenerator: true
    }, {
      stationName: 'Station-2',
      totalDocuments: 0,
      isGenerator: false
    }, {
      stationName: 'Station-3',
      totalDocuments: 3,
      isGenerator: true
    }];
    const data: ForwardPreviousStationsDocument = {
      previousStations: previousStations,
      followingStations: followingStations
    };
    return of(data).pipe(delay(1000));
  }

  /**
   * Gets a list of forward and previous stations for a specific document.
   *
   * @param documentId The Specific id of document.
   * @param stationId The Specific id of station.
   * @param mode The Specific user type supervisor or worker or admin.
   * @returns A list of forward and previous stations for a specific document.
   */
  getDocumentInfo(documentId: string, stationId: string, mode: string): Observable<DocumentStationInformation> {
    return this.http.get<DocumentStationInformation>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/documentinfo`,
      { params: { documentId, stationId, mode }}
    );
  }

}
