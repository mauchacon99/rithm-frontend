import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ConnectedStationInfo, DocumentStationInformation, ForwardPreviousStationsDocument, QuestionFieldType, StationDocuments, UserType, DocumentAnswer, DocumentName, StationRosterMember, Question, DocumentAutoFlow, MoveDocument } from 'src/models';
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Mocks methods of the `DocumentService`.
 */
export class MockDocumentService {

  /** The Name of the Document as BehaviorSubject. */
  documentName$ = new BehaviorSubject<string>('');

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
  getConnectedStationInfo(documentId: string, stationId: string): Observable<ForwardPreviousStationsDocument> {
    const previousStations: Array<ConnectedStationInfo> = [{
      rithmId: documentId,
      name: 'Previous station 1',
      totalDocuments: 5
    },
    {
      rithmId: '789-654-753',
      name: 'Previous station 2',
      totalDocuments: 2
    }];
    const nextStations: Array<ConnectedStationInfo> = [{
      rithmId: '852-963-741',
      name: 'Follow station 1',
      totalDocuments: 2
    },
    {
      rithmId: '852-963-418',
      name: 'Follow station 2',
      totalDocuments: 1
    }];
    const data: ForwardPreviousStationsDocument = {
      rithmId: '123-654-789',
      previousStations,
      nextStations
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
      documentRithmId: 'E204F369-386F-4E41',
      currentAssignedUser: 'NS',
      flowedTimeUTC: '1943827200000',
      lastUpdatedUTC: '1943827200000',
      stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      stationName: 'Development',
      stationPriority: 2,
      stationInstruction: 'This is an instruction',
      stationOwners: [],
      workers: [],
      questions: [
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 1',
          questionType: QuestionFieldType.ShortText,
          isReadOnly: false,
          isRequired: false,
          isPrivate: false,
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 2',
          questionType: QuestionFieldType.LongText,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 3',
          questionType: QuestionFieldType.URL,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 4',
          questionType: QuestionFieldType.Email,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 5',
          questionType: QuestionFieldType.Number,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 6',
          questionType: QuestionFieldType.Phone,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 7',
          questionType: QuestionFieldType.Currency,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 8',
          questionType: QuestionFieldType.Date,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 9',
          questionType: QuestionFieldType.Select,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          possibleAnswers: [
            {
              text: 'Option 1',
              default: false
            },
            {
              text: 'Option 2',
              default: true
            },
            {
              text: 'Option 3',
              default: false
            },
            {
              text: 'Option 4',
              default: false
            }
          ],
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 10',
          questionType: QuestionFieldType.MultiSelect,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          possibleAnswers: [
            {
              text: 'Option 1',
              default: false
            },
            {
              text: 'Option 2',
              default: true
            },
            {
              text: 'Option 3',
              default: false
            },
            {
              text: 'Option 4',
              default: false
            }
          ],
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 12',
          questionType: QuestionFieldType.CheckList,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          possibleAnswers: [
            {
              text: 'Option 1',
              default: false
            },
            {
              text: 'Option 2',
              default: false
            },
            {
              text: 'Option 3',
              default: false
            },
            {
              text: 'Option 4',
              default: false
            }
          ],
          children: [],
        },
        {
          rithmId: '3j4k-3h2j-hj4j',
          prompt: 'Fake question 13',
          questionType: QuestionFieldType.Nested,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [
            {
              rithmId: '3j4k-3h2j-hj4j',
              prompt: 'Address Line 1',
              questionType: QuestionFieldType.AddressLine,
              isReadOnly: false,
              isRequired: false,
              isPrivate: false,
              children: [],
            },
            {
              rithmId: '3j4k-3h2j-hj4j',
              prompt: 'Address Line 2',
              questionType: QuestionFieldType.AddressLine,
              isReadOnly: false,
              isRequired: false,
              isPrivate: false,
              children: [],
            },
            {
              rithmId: '3j4k-3h2j-hj4j',
              prompt: 'Fake question 1',
              questionType: QuestionFieldType.City,
              isReadOnly: false,
              isRequired: false,
              isPrivate: false,
              children: [],
            },
            {
              rithmId: '3j4k-3h2j-hj4j',
              prompt: 'Fake question 12',
              questionType: QuestionFieldType.State,
              isReadOnly: false,
              isRequired: true,
              isPrivate: false,
              possibleAnswers: [
                {
                  text: 'Option 1',
                  default: false
                },
                {
                  text: 'Option 2',
                  default: false
                },
                {
                  text: 'Option 3',
                  default: false
                },
                {
                  text: 'Option 4',
                  default: false
                }
              ],
              children: [],
            },
            {
              rithmId: '3j4k-3h2j-hj4j',
              prompt: 'Zip',
              questionType: QuestionFieldType.Zip,
              isReadOnly: false,
              isRequired: true,
              isPrivate: false,
              children: [],
            },
          ],
        }
      ],
      instructions: 'General instructions'
    };
    return of(documentInfo).pipe(delay(1000));
  }

  /**
   * Update the document name.
   *
   * @param documentId The specific id of document.
   * @param documentName The new document name.
   * @returns The new document name.
   */
  updateDocumentName(documentId: string, documentName: string): Observable<DocumentName> {
    if (!documentId && documentName === '') {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Cannot update document name.'
        }
      })).pipe(delay(1000));
    } else {
      const updateDocumentName: DocumentName = {
        baseName: documentName,
        appendedName: ''
      };
      return of(updateDocumentName).pipe(delay(1000));
    }
  }

  /**
   * Get the document name.
   *
   * @param documentId The specific id of document.
   * @returns The document name.
   */
  getDocumentName(documentId: string): Observable<DocumentName> {
    if (!documentId) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Cannot get document name.'
        }
      })).pipe(delay(1000));
    } else {
      const documentName: DocumentName = {
        baseName: 'Metroid Dread',
        appendedName: ''
      };
      return of(documentName).pipe(delay(1000));
    }
  }

  /**
   * Save the document answers.
   *
   * @param documentRithmId The specific document id.
   * @param answerDocument The answers so document.
   * @returns The document answers.
   */
  saveDocumentAnswer(documentRithmId: string, answerDocument: DocumentAnswer[]): Observable<DocumentAnswer[]> {
    if (!documentRithmId || !answerDocument) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Cannot get the name of the document or its answers.'
        }
      })).pipe(delay(1000));
    } else {
      const expectAnswerDocument: DocumentAnswer[] = [{
        questionRithmId: 'Dev 1',
        documentRithmId: '123-654-789',
        stationRithmId: '741-951-753',
        value: 'Answer Dev',
        file: 'dev.txt',
        filename: 'dev',
        type: QuestionFieldType.Email,
        rithmId: '789-321-456',
        questionUpdated: true,
      },
      {
        questionRithmId: 'Dev 2',
        documentRithmId: '123-654-789-856',
        stationRithmId: '741-951-753-741',
        value: 'Answer Dev2',
        file: 'dev2.txt',
        filename: 'dev2',
        type: QuestionFieldType.City,
        rithmId: '789-321-456-789',
        questionUpdated: false,
      }];
      return of(expectAnswerDocument).pipe(delay(1000));
    }
  }

  /**
   * Update the Document Name Behavior Subject.
   *
   * @param documentName The Document Name.
   */
  updateDocumentNameBS(documentName: string): void {
    this.documentName$.next(documentName);
  }

  /**
   * Get last updated time for document.
   *
   * @param documentRithmId The id of the document to get the last updated date.
   * @returns Formatted Updated Date.
   */
  getLastUpdated(documentRithmId: string): Observable<string> {
    const mockDate = '2021-12-09T17:26:47.3506612Z';
    return of(mockDate).pipe(delay(1000));
  }

  /**
   * Get held time in station for document.
   *
   * @param documentId The specific id of document.
   * @param stationId The specific id of station.
   * @returns The document time in station.
   */
  getDocumentTimeInStation(documentId: string, stationId: string): Observable<string> {
    if (!documentId || !stationId) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Cannot get held time in station for document.'
        }
      })).pipe(delay(1000));
    } else {
      const documentTimeInStation = '2021-12-09T17:26:47.3506612Z';
      return of(documentTimeInStation).pipe(delay(1000));
    }
  }

  /**
   * Get the user assigned to the document.
   *
   * @param documentId The specific id of document.
   * @param stationId The specific id of station.
   * @param getOnlyCurrentStation The specific current station only.
   * @returns The assigned user.
   */
  getAssignedUserToDocument(documentId: string, stationId: string, getOnlyCurrentStation: boolean): Observable<StationRosterMember[]> {
    if (!documentId || (!stationId && getOnlyCurrentStation)) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Cannot get the user assigned for document.'
        }
      })).pipe(delay(1000));
    } else {
      const assignedUser: StationRosterMember[] = [{
        rithmId: '789-321-456-789',
        firstName: 'John',
        lastName: 'Christopher',
        email: 'johnny.depp@gmail.com',
        isAssigned: true
      }];
      return of(assignedUser).pipe(delay(1000));
    }
  }

  /**
   * Get Previous Questions.
   *
   * @param documentId The specific id of document.
   * @param stationId The specific id of station.
   * @param getPrivate Will fetch only private or non private questions.
   * @returns The array with previous questions.
   */
  getDocumentPreviousQuestions(documentId: string, stationId: string, getPrivate = false): Observable<Question[]> {
    if (!documentId || !stationId) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Invalid station or document id.'
        }
      })).pipe(delay(1000));
    } else {

      const previousQuestions: Question[] = [
        {
          rithmId: '',
          questionType: QuestionFieldType.City,
          prompt: 'string',
          isPrivate: getPrivate,
          isEncrypted: true,
          isReadOnly: true,
          isRequired: true,
          possibleAnswers: [
            {
              text: 'string',
              default: true
            }
          ],
          answer: {
            questionRithmId: 'string',
            referAttribute: 'string',
            asArray: [],
            asInt: 0,
            asDecimal: 0,
            asString: 'string',
            asDate: '2021-12-14T14:10:31.030Z',
            value: 'string'
          },
          children: []
        }
      ];
      return of(previousQuestions).pipe(delay(1000));
    }
  }

  /**
   * Delete a specified document.
   *
   * @param documentRithmId The Specific id of document.
   * @returns Returns an empty observable.
   */
  deleteDocument(documentRithmId: string): Observable<unknown> {
    if (!documentRithmId) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Cannot delete the document without defining a document.'
        }
      })).pipe(delay(1000));
    } else {
      return of().pipe(delay(1000));
    }
  }

  /**
   * Flow a document.
   *
   * @param documentAutoFlow Params for add flow to Document.
   * @returns Returns an empty observable.
   */
  autoFlowDocument(documentAutoFlow: DocumentAutoFlow): Observable<unknown> {
    if (!documentAutoFlow) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Unable to flow the document, invalid parameters.'
        }
      })).pipe(delay(1000));
    } else {
      return of().pipe(delay(1000));
    }
  }

  /**
   * Unassign a user to document.
   *
   * @param documentRithmId The Specific id of document.
   * @param stationRithmId The station Id.
   * @returns Returns an empty observable.
   */
  unassignUserToDocument(documentRithmId: string, stationRithmId: string): Observable<unknown> {
    if (!documentRithmId || !stationRithmId) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'The user cannot be unassigned.'
        }
      })).pipe(delay(1000));
    } else {
      return of().pipe(delay(1000));
    }
  }

  /**
   * Move to Document to station.
   *
   * @param moveDocument Model for move to document.
   * @returns Returns an empty observable.
   */
  moveDocument(moveDocument: MoveDocument): Observable<unknown> {
    if (!moveDocument) {
      return throwError(() => new HttpErrorResponse({
        error: {
          error: 'Data invalid, document could not be moved.'
        }
      })).pipe(delay(1000));
    } else {
      return of().pipe(delay(1000));
    }
  }
}
