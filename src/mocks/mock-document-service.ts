/* eslint-disable @typescript-eslint/no-unused-vars */
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  ConnectedStationInfo, DocumentStationInformation, ForwardPreviousStationsDocument, StationDocuments, UserType
} from 'src/models';
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
  getStationDocuments(stationId: string, pageNum: number): Observable<StationDocuments> {
    const ELEMENT_DATA: StationDocuments = {
      documents: [
        /* eslint-disable max-len */
        { documentName: 'Almond Flour', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: '', isEscalated: true, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Apple Crisps', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 7, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Apple Sauce', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 3, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Bagel Seasoning', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 7, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Baking Soda', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 9, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Banana Crisps', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 1, userAssigned: 'John Doe', isEscalated: true, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Black Pepper', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Borax', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 1, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Bowtie Pasta', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '', priority: 2, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Calcium', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 3, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Citrus Oil', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 5, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Coconut Flakes', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 3, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Coconut Oil', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 8, userAssigned: 'John Doe', isEscalated: true, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Coriander', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Fennel Seeds', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 3, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Garlic Powder', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 1, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Glycerin', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 1, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Grain Flour', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 4, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Grape Seed Oil', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 6, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Hemp Protein Powder', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'High Gluten Flour', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 7, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Himalayan Pink Salt', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 1, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Jalapeno Powder', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 4, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Jasmine Rice', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Lemon Zest', stationName: 'Dry Goods & Liquids', priority: 1, flowedTimeUTC: '', userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Light Brown Sugar', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Malic Acid Powder', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Mango Powder', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 4, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Maple Syrup', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 4, userAssigned: 'John Doe', isEscalated: true, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Onion Powder', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 7, userAssigned: '', isEscalated: true, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Paprika', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 5, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Rice Bran Oil', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 5, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Rosemary Leaves', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 1, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Sea Salt', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Sorbitol Powder', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Sprinkles', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Tart Cherry Extract Powder', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 3, userAssigned: '', isEscalated: true, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Trehalose', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 8, userAssigned: '', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Vitamin C', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 2, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        { documentName: 'Vitamin E Oil', stationName: 'Dry Goods & Liquids', flowedTimeUTC: '2021-06-16T17:26:47.3506612Z', priority: 4, userAssigned: 'John Doe', isEscalated: false, updatedTimeUTC: '2021-06-16T17:26:47.3506612Z', documentRithmId: '', stationRithmId: '', },
        /* eslint-enable max-len */
      ],
      totalDocuments: 40, userType: UserType.Worker
    };
    // return this.http.get<DashboardStationResponse[]>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/api/Dashboard/Stations`);
    if (pageNum === 1) {
      pageNum = 0;
      ELEMENT_DATA.documents = ELEMENT_DATA.documents.slice(pageNum, 10);
    } else {
      pageNum = ((pageNum * 10) - 10);
      ELEMENT_DATA.documents = ELEMENT_DATA.documents.slice(pageNum, (pageNum + 10));
    }
    return of(ELEMENT_DATA).pipe(delay(1000));
  }

  /**
   * Gets a list of forward and previous stations for a specific document.
   *
   * @param documentId The Specific id of document.
   * @param stationId The Specific id of station.
   * @returns A list of forward and previous stations for a specific document.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getConnectedStationInfo(documentId: string, stationId: string): Observable<ForwardPreviousStationsDocument> {
    const previousStations: Array<ConnectedStationInfo> = [{
      stationName: 'Development',
      totalDocuments: 5,
      isGenerator: true
    }];
    const followingStations: Array<ConnectedStationInfo> = [{
      stationName: 'Station-1',
      totalDocuments: 2,
      isGenerator: true
    }, {
      stationName: 'Station-2',
      totalDocuments: 0,
      isGenerator: false
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
   * @returns A list of forward and previous stations for a specific document.
   */
  getDocumentInfo(documentId: string, stationId: string): Observable<DocumentStationInformation> {
    const documentInfo: DocumentStationInformation = {
      documentName: 'Metroid Dread',
      documentPriority: 5,
      documentRithmId:'E204F369-386F-4E41',
      currentAssignedUser: 'NS',
      flowedTimeUTC: '1943827200000',
      lastUpdatedUTC: '1943827200000',
      stationId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      stationName: 'Development',
      stationPriority: 2,
      numberOfSupervisors: 7,
      supervisorRoster: [],
      numberOfWorkers: 7,
      workerRoster: [],
      questions: []
    };
    return of(documentInfo).pipe(delay(1000));
  }


}
