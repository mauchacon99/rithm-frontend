/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Question,
  QuestionFieldType,
  Station,
  StationInformation,
  DocumentGenerationStatus,
  StationRosterMember,
  StationPotentialRostersUsers,
  DocumentNameField,
  ForwardPreviousStationsDocument,
  StandardStringJSON,
  StandardBooleanJSON,
  StationGroupData,
  StationFrameWidget,
  FrameType,
  DataLinkObject,
  StandardNumberJSON,
  DocumentEvent,
  GroupTrafficData,
} from 'src/models';

/**
 * Mocks methods of the `StationService`.
 */
export class MockStationService {
  /** The Name of the Station as BehaviorSubject. */
  stationName$ = new BehaviorSubject<string>('');

  /** The Name of the Station Document as BehaviorSubject. */
  documentStationNameFields$ = new BehaviorSubject<DocumentNameField[]>([]);

  /** Contains the name of the Flow Button as BehaviorSubject. */
  flowButtonText$ = new BehaviorSubject<string>('Flow');

  /** The questions to be updated when it changes in station page. */
  currentStationQuestions$ = new BehaviorSubject<Question[]>([]);

  /** Set the Question of the station-template which will be moved to previous fields expansion panel. */
  questionToMove$ = new Subject<Question>();

  /** Set touch to station template form. */
  stationFormTouched$ = new Subject<void>();

  /** The question to be updated when it changes in station page. */
  stationQuestion$ = new Subject<Question>();

  /** The datalink widget to be saved. */
  dataLinkObject$ = new Subject<DataLinkObject>();

  /** The question to be deleted when it delete in station field settings. */
  deleteStationQuestion$ = new Subject<Question>();

  /** The question title to be updated when it's updated in setting drawer. */
  stationQuestionTitle$ = new Subject<Question>();

  /**
   * Gets a station information.
   *
   * @param stationId The Specific id of station.
   * @returns Information related to station.
   */
  getStationInfo(stationId: string): Observable<StationInformation> {
    const data: StationInformation = {
      rithmId: 'E204F369-386F-4E41',
      name: 'Dry Goods & Liquids',
      instructions: '',
      nextStations: [
        {
          name: 'Development',
          rithmId: '753-962-785',
        },
      ],
      previousStations: [
        {
          name: 'Station-1',
          rithmId: '789-859-742',
        },
        {
          name: 'Station-2',
          rithmId: '753-951-741',
        },
      ],
      stationOwners: [
        {
          rithmId: '',
          firstName: 'Marry',
          lastName: 'Poppins',
          email: 'marrypoppins@inpivota.com',
          isWorker: false,
          isOwner: true,
        },
        {
          rithmId: '',
          firstName: 'Worker',
          lastName: 'User',
          email: 'workeruser@inpivota.com',
          isWorker: false,
          isOwner: true,
        },
      ],
      workers: [
        {
          rithmId: '',
          firstName: 'Harry',
          lastName: 'Potter',
          email: 'harrypotter@inpivota.com',
          isWorker: false,
          isOwner: false,
        },
        {
          rithmId: '',
          firstName: 'Supervisor',
          lastName: 'User',
          email: 'supervisoruser@inpivota.com',
          isWorker: true,
          isOwner: false,
        },
      ],
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: [],
      priority: 2,
      allowPreviousButton: false,
      allowAllOrgWorkers: true,
      allowExternalWorkers: false,
      flowButton: 'Flow',
      isChained: false,
    };
    return of(data).pipe(delay(1000));
  }

  /**
   * Gets all the stations from the API.
   *
   * @returns The list of all stations.
   */
  getAllStations(): Observable<Station[]> {
    const mockStationData: Station[] = [
      {
        name: 'Example Station',
        rithmId: '3j4k-3h2j-hj4j',
        instructions: 'Do as I instruct',
      },
    ];
    return of(mockStationData).pipe(delay(1000));
  }

  /**
   * Update station information.
   *
   * @returns The station information updated.
   * @param station The station information that will be update.
   */
  updateStation(station: StationInformation): Observable<StationInformation> {
    if (!station) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot update station without defining a station.',
            },
          })
      ).pipe(delay(1000));
    } else {
      const data: StationInformation = {
        rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        name: 'New Station Name',
        instructions: '',
        nextStations: [
          {
            name: 'Development',
            rithmId: '756-984-741',
          },
        ],
        previousStations: [
          {
            name: 'Station-1',
            rithmId: '123-987-357',
          },
          {
            name: 'Station-2',
            rithmId: '123-965-745',
          },
        ],
        stationOwners: [
          {
            rithmId: '',
            firstName: 'Marry',
            lastName: 'Poppins',
            email: 'marrypoppins@inpivota.com',
            isWorker: false,
            isOwner: true,
          },
          {
            rithmId: '',
            firstName: 'Worker',
            lastName: 'User',
            email: 'workeruser@inpivota.com',
            isWorker: false,
            isOwner: true,
          },
        ],
        workers: [
          {
            rithmId: '',
            firstName: 'Harry',
            lastName: 'Potter',
            email: 'harrypotter@inpivota.com',
            isWorker: false,
            isOwner: false,
          },
          {
            rithmId: '',
            firstName: 'Supervisor',
            lastName: 'User',
            email: 'supervisoruser@inpivota.com',
            isWorker: true,
            isOwner: false,
          },
        ],
        createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
        createdDate: '2021-07-16T17:26:47.3506612Z',
        updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
        updatedDate: '2021-07-18T17:26:47.3506612Z',
        questions: [],
        priority: 2,
        allowPreviousButton: false,
        allowAllOrgWorkers: false,
        allowExternalWorkers: true,
        flowButton: 'Flow',
        isChained: false,
      };
      return of(data).pipe(delay(1000));
    }
  }

  /**
   * Get station information updated date.
   *
   * @param stationId The id of the station for witch to get the last updated date.
   * @returns Formatted Updated Date.
   */
  getLastUpdated(stationId: string): Observable<string> {
    const mockDate = '2021-07-18T17:26:47.3506612Z';
    return of(mockDate).pipe(delay(1000));
  }

  /**
   * Get station document generation status.
   *
   * @param stationId The id of the station return status document.
   * @returns Status the document.
   */
  getStationDocumentGenerationStatus(
    stationId: string
  ): Observable<DocumentGenerationStatus> {
    const mockStatusDocument = DocumentGenerationStatus.None;
    return of(mockStatusDocument).pipe(delay(1000));
  }

  /**
   * Update station document generation status.
   *
   * @param stationId The id of the station return status document.
   * @param status The new status set in station document.
   * @returns Status new the document.
   */
  updateStationDocumentGenerationStatus(
    stationId: string,
    status: DocumentGenerationStatus
  ): Observable<DocumentGenerationStatus> {
    return of(status).pipe(delay(1000));
  }

  /**
   * Get all station previous private/all questions.
   *
   * @param stationId The Specific id of station.
   * @param isPrivate True returns private questions - False returns all questions.
   * @returns Station private/all items Array.
   */
  getStationPreviousQuestions(
    stationId: string,
    isPrivate: boolean
  ): Observable<Question[]> {
    const mockPrevQuestions: Question[] = [
      {
        prompt: 'Fake question 1',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
      {
        prompt: 'Fake question 2',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
    ];
    return of(mockPrevQuestions).pipe(delay(1000));
  }

  /**
   * Update the station questions.
   *
   * @param stationId The Specific id of station.
   * @param questions The Specific questions of station.
   * @returns Station save the questions array.
   */
  updateStationQuestions(
    stationId: string,
    questions: Question[]
  ): Observable<Question[]> {
    questions = [
      {
        prompt: 'Example question#1',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
      {
        prompt: 'Example question#2',
        rithmId: '3j5k-3h2j-hj5j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
    ];
    return of(questions).pipe(delay(1000));
  }

  /**
   * Adds users to the worker roster.
   *
   * @param stationId The Specific id of station.
   * @param userIds The users ids for assign in station.
   * @returns Rosters in the station.
   */
  addUsersToWorkerRoster(
    stationId: string,
    userIds: string[]
  ): Observable<StationRosterMember[]> {
    const mockPrevAddRosterStation: StationRosterMember[] = [
      {
        rithmId: '',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
      {
        rithmId: '',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
    ];
    return of(mockPrevAddRosterStation).pipe(delay(1000));
  }

  /**
   * Deletes a specified station.
   * Get organization users for a specific station.
   *
   * @param organizationId The id of the organization.
   * @param stationRithmId The Specific id of station.
   * @param pageNum The current page.
   * @returns Users for the organization bind to station.
   */
  // eslint-disable-next-line max-len
  getPotentialStationRosterMembers(
    organizationId: string,
    stationRithmId: string,
    pageNum: number
  ): Observable<StationPotentialRostersUsers> {
    if (!organizationId || !pageNum) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Some error message',
            },
          })
      ).pipe(delay(1000));
    } else {
      const orgUsers: StationPotentialRostersUsers = {
        users: [
          {
            rithmId: '12dasd1-asd12asdasd-asdas',
            firstName: 'Cesar',
            lastName: 'Quijada',
            email: 'strut@gmail.com',
            isOwner: true,
            isWorker: true,
          },
          {
            rithmId: '12dasd1-asd12asdasd-ffff1',
            firstName: 'Maria',
            lastName: 'Quintero',
            email: 'Maquin@gmail.com',
            isOwner: true,
            isWorker: true,
          },
          {
            rithmId: '12dasd1-asd12asdasd-a231',
            firstName: 'Pedro',
            lastName: 'Perez',
            email: 'pperez@gmail.com',
            isOwner: true,
            isWorker: true,
          },
        ],
        totalUsers: 3,
      };
      return of(orgUsers).pipe(delay(1000));
    }
  }

  /**
   * Deletes a specified station.
   *
   * @param stationId The Specific id of station.
   * @returns Returns an empty observable.
   */
  deleteStation(stationId: string): Observable<unknown> {
    if (!stationId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot delete the station without defining a station.',
            },
          })
      ).pipe(delay(1000));
    } else {
      return of().pipe(delay(1000));
    }
  }

  /**
   * Removes users  from the station's workers roster.
   *
   * @param stationId The Specific id of station.
   * @param usersIds The selected users id array to removed.
   * @returns New Station information with worker roster.
   */
  removeUsersFromWorkerRoster(
    stationId: string,
    usersIds: string[]
  ): Observable<StationRosterMember[]> {
    const data: StationRosterMember[] = [
      {
        rithmId: '12dasd1-asd12asdasd-asdas',
        firstName: 'Cesar',
        lastName: 'Quijada',
        email: 'strut@gmail.com',
        isOwner: true,
        isWorker: true,
      },
      {
        rithmId: '12dasd1-asd12asdasd-ffff1',
        firstName: 'Maria',
        lastName: 'Quintero',
        email: 'Maquin@gmail.com',
        isOwner: true,
        isWorker: true,
      },
      {
        rithmId: '12dasd1-asd12asdasd-a231',
        firstName: 'Pedro',
        lastName: 'Perez',
        email: 'pperez@gmail.com',
        isOwner: true,
        isWorker: true,
      },
    ];
    return of(data).pipe(delay(1000));
  }

  /**
   * Get Workers Roster for a given Station.
   *
   * @param stationId The id of the given station.
   * @returns A rosterMember array.
   */
  getStationWorkerRoster(stationId: string): Observable<StationRosterMember[]> {
    const mockRosterMember: StationRosterMember[] = [
      {
        rithmId: '495FC055-4472-45FE-A68E-B7A0D060E1C8',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isOwner: true,
        isWorker: true,
      },
      {
        rithmId: '49B1A2B4-7B2A-466E-93F9-78F14A672052',
        firstName: 'Rithm',
        lastName: 'User',
        email: 'rithmuser@inpivota.com',
        isOwner: true,
        isWorker: true,
      },
    ];
    return of(mockRosterMember).pipe(delay(1000));
  }

  /**
   * Get Owner Roster for a given Station.
   *
   * @param stationId The id of the given station.
   * @returns A rosterMember array.
   */
  getStationOwnerRoster(stationId: string): Observable<StationRosterMember[]> {
    const mockRosterMember: StationRosterMember[] = [
      {
        rithmId: '495FC055-4472-45FE-A68E-B7A0D060E1C8',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isOwner: true,
        isWorker: false,
      },
      {
        rithmId: '49B1A2B4-7B2A-466E-93F9-78F14A672052',
        firstName: 'Rithm',
        lastName: 'User',
        email: 'rithmuser@inpivota.com',
        isOwner: true,
        isWorker: false,
      },
    ];
    return of(mockRosterMember).pipe(delay(1000));
  }

  /**
   * Adds users to the owners roster.
   *
   * @param stationId The Specific id of station.
   * @param userIds The users ids for assign in station.
   * @returns OwnerRoster in the station.
   */
  addUsersToOwnersRoster(
    stationId: string,
    userIds: string[]
  ): Observable<StationRosterMember[]> {
    const mockOwnerRoster: StationRosterMember[] = [
      {
        rithmId: 'C5C1480C-461E-4267-BBB1-BB79E489F991',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isOwner: true,
        isWorker: false,
      },
      {
        rithmId: 'C5C1480C-461E-4267-BBB1-BB79E489F992',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isOwner: true,
        isWorker: false,
      },
    ];
    return of(mockOwnerRoster).pipe(delay(1000));
  }

  /**
   * Remove owner from the station's roster.
   *
   * @param stationId The Specific id of station.
   * @param usersIds The selected owners id array to removed.
   * @returns New Station information with owners roster.
   */
  removeUsersFromOwnerRoster(
    stationId: string,
    usersIds: string[]
  ): Observable<StationRosterMember[]> {
    const mockPrevDeleteOwnersRoster: StationRosterMember[] = [
      {
        rithmId: '12dasd1-asd12asdasd-asdas',
        firstName: 'Cesar',
        lastName: 'Quijada',
        email: 'strut@gmail.com',
        isOwner: true,
        isWorker: false,
      },
      {
        rithmId: '12dasd1-asd12asdasd-ffff1',
        firstName: 'Maria',
        lastName: 'Quintero',
        email: 'Maquin@gmail.com',
        isOwner: true,
        isWorker: true,
      },
      {
        rithmId: '12dasd1-asd12asdasd-a231',
        firstName: 'Pedro',
        lastName: 'Perez',
        email: 'pperez@gmail.com',
        isOwner: true,
        isWorker: false,
      },
    ];
    return of(mockPrevDeleteOwnersRoster).pipe(delay(1000));
  }

  /**
   * Update status document is editable or not.
   *
   * @param stationRithmId The Specific id of station.
   * @param newStatus The new status is editable in the change for document.
   * @returns New status for document editable.
   */
  updateStatusDocumentEditable(
    stationRithmId: string,
    newStatus: boolean
  ): Observable<boolean> {
    return of(newStatus).pipe(delay(1000));
  }

  /**
   * Get status document is editable or not.
   *
   * @param stationRithmId The Specific id of station.
   * @returns Status for document editable.
   */
  getStatusDocumentEditable(stationRithmId: string): Observable<boolean> {
    const expectedResponse = true;
    return of(expectedResponse).pipe(delay(1000));
  }

  /**
   * Returns the station document name.
   *
   * @param documentName The name of the document in the station.
   */
  updateDocumentStationNameFields(documentName: DocumentNameField[]): void {
    this.documentStationNameFields$.next(documentName);
  }

  /**
   * Returns the station name.
   *
   * @param stationName The name of the station.
   */
  updatedStationNameText(stationName: string): void {
    this.stationName$.next(stationName);
  }

  /**
   * Returns the flow button name.
   *
   * @param flowButtonText The name of the flow button .
   */
  updatedFlowButtonText(flowButtonText: string): void {
    this.flowButtonText$.next(flowButtonText);
  }

  /**
   * Update the station question values in the template area.
   *
   * @param question The question to be updated.
   */
  updateStationQuestionInTemplate(question: Question): void {
    this.stationQuestion$.next(question);
  }

  /**
   * Update the station questions in the data link field.
   *
   * @param questions The current questions to be updated in data link field.
   */
  updateCurrentStationQuestions(questions: Question[]): void {
    this.currentStationQuestions$.next(questions);
  }

  /**
   * Reports a new question to be moved.
   *
   * @param question The question of the station-template to be moved.
   */
  moveQuestion(question: Question): void {
    this.questionToMove$.next(question);
  }

  /**
   * Update the Station General Instruction.
   *
   * @param rithmId The Specific id of station.
   * @param instructions The general instructions to be updated.
   * @returns The updated stationInformation.
   */
  updateStationGeneralInstructions(
    rithmId: string,
    instructions: string
  ): Observable<StandardStringJSON> {
    if (!rithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error:
                'Cannot update station without defining a station id or without any instructions in it.',
            },
          })
      ).pipe(delay(1000));
    } else {
      const data: StandardStringJSON = {
        data: 'updated instructions',
      };
      return of(data).pipe(delay(1000));
    }
  }

  /**
   * Updates a station name.
   * Get previous and next stations.
   *
   * @param stationRithmId The rithm id actually station.
   * @returns Previous and next stations.
   */
  getPreviousAndNextStations(
    stationRithmId: string
  ): Observable<ForwardPreviousStationsDocument> {
    const mockDataFollowAndPrevStations: ForwardPreviousStationsDocument = {
      rithmId: stationRithmId,
      previousStations: [
        {
          rithmId: '3813442c-82c6-4035-893a-86fa9deca7c3',
          name: 'Step 1',
        },
        {
          rithmId: '3813442c-82c6-4035-893a-86fa9deca7c4',
          name: 'Step 2',
        },
      ],
      nextStations: [
        {
          rithmId: '73d47261-1932-4fcf-82bd-159eb1a7243f',
          name: 'Step 4',
        },
      ],
    };
    return of(mockDataFollowAndPrevStations).pipe(delay(1000));
  }

  /**
   * Update station name.
   *
   * @returns The station name updated.
   * @param name The new name from station.
   * @param stationRithmId The stationRithmId to send to service.
   */
  updateStationName(name: string, stationRithmId: string): Observable<string> {
    if (!stationRithmId || name === '') {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot update station name without defining a station.',
            },
          })
      ).pipe(delay(1000));
    } else {
      return of(name).pipe(delay(1000));
    }
  }

  /**
   * Get appended fields to document name template.
   *
   * @param stationId  The id of station.
   * @returns Array the appended fields in document name.
   */
  getDocumentNameTemplate(stationId: string): Observable<DocumentNameField[]> {
    const documentFieldName: DocumentNameField[] = [
      {
        prompt: 'Address',
        questionRithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a',
      },
      {
        prompt: '/',
        questionRithmId: null,
      },
      {
        prompt: 'Which is best?',
        questionRithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a',
      },
    ];
    return of(documentFieldName).pipe(delay(1000));
  }

  /**
   * Update the document name template.
   *
   * @param stationId  The id of station.
   * @param appendedFields  The appended fields.
   * @returns A list of field names for document name template.
   */
  updateDocumentNameTemplate(
    stationId: string,
    appendedFields: DocumentNameField[]
  ): Observable<DocumentNameField[]> {
    if (!stationId || !appendedFields) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot update document name.',
            },
          })
      ).pipe(delay(1000));
    } else {
      const documentFieldName: DocumentNameField[] = [
        {
          prompt: 'Address',
          questionRithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a',
        },
        {
          prompt: '/',
          questionRithmId: null,
        },
        {
          prompt: 'Which is best?',
          questionRithmId: 'ff1cc928-0f16-464d-b125-7daa260ccc3a',
        },
      ];
      return of(documentFieldName).pipe(delay(1000));
    }
  }

  /** Set touch to station template form. */
  touchStationForm(): void {
    this.stationFormTouched$.next();
  }

  /**
   * Get the stations questions.
   *
   * @param stationRithmId  The station id.
   * @param includePreviousQuestions If is true contains previous questions.
   * @returns An array of current and previous for stations.
   */
  getStationQuestions(
    stationRithmId: string,
    includePreviousQuestions: boolean
  ): Observable<Question[]> {
    if (!stationRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'The station id cannot be is null or undefined',
            },
          })
      ).pipe(delay(1000));
    } else {
      const mockQuestions: Question[] = [
        {
          prompt: 'Fake question 1',
          rithmId: '3j4k-3h2j-hj4j',
          questionType: QuestionFieldType.Number,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
          value: '1',
        },
        {
          prompt: 'Fake question 2',
          rithmId: '3j4k-3h2j-hj4j',
          questionType: QuestionFieldType.Number,
          isReadOnly: false,
          isRequired: true,
          isPrivate: false,
          children: [],
          value: '2',
        },
      ];
      return of(mockQuestions).pipe(delay(1000));
    }
  }

  /**
   * Get the allow external workers for the station roster.
   *
   * @param stationRithmId The Specific id of station.
   * @returns Allow external workers to be assigned to station documents.
   */
  getAllowExternalWorkers(stationRithmId: string): Observable<boolean> {
    const expectedResponse: StandardBooleanJSON = {
      data: true,
    };
    return of(expectedResponse.data).pipe(delay(1000));
  }

  /**
   * Get the allow previous button for the document.
   *
   * @param stationRithmId The Specific id of station.
   * @returns Allow previous button to be assigned to document.
   */
  getAllowPreviousButton(stationRithmId: string): Observable<boolean> {
    const expectedResponse: StandardBooleanJSON = {
      data: true,
    };
    return of(expectedResponse.data).pipe(delay(1000));
  }

  /**
   * Update the allow external workers status for the station roster.
   *
   * @param stationRithmId The Specific id of station.
   * @param allowExtWorkers Whether to allow external workers.
   * @returns Allow external workers updated status in the station.
   */
  updateAllowExternalWorkers(
    stationRithmId: string,
    allowExtWorkers: boolean
  ): Observable<boolean> {
    if (!stationRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: "Cannot update the allow external worker's status",
            },
          })
      ).pipe(delay(1000));
    } else {
      const expectedResponse: StandardBooleanJSON = {
        data: allowExtWorkers,
      };
      return of(expectedResponse.data).pipe(delay(1000));
    }
  }

  /**
   * Get the field AllowAllOrgWorkers.
   *
   * @param stationRithmId  The station id.
   * @returns An object with value of AllowAllOrgWorkers.
   */
  getAllowAllOrgWorkers(stationRithmId: string): Observable<boolean> {
    if (!stationRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot update field related all org workers.',
            },
          })
      ).pipe(delay(1000));
    } else {
      const mockData: StandardBooleanJSON = {
        data: true,
      };
      return of(mockData.data).pipe(delay(1000));
    }
  }

  /**
   * Update AllowAllOrgWorkers information.
   *
   * @param stationRithmId The station id that will be update.
   * @param allowAllOrgWorkers The value that will be update.
   * @returns The field AllowAllOrgWorkers updated.
   */
  updateAllowAllOrgWorkers(
    stationRithmId: string,
    allowAllOrgWorkers: boolean
  ): Observable<boolean> {
    if (!stationRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot update the current status for this.',
            },
          })
      ).pipe(delay(1000));
    } else {
      const expectedResponse: StandardBooleanJSON = {
        data: allowAllOrgWorkers,
      };
      return of(expectedResponse.data).pipe(delay(1000));
    }
  }

  /**
   * Update the allowPreviousButton button status.
   *
   * @param stationRithmId The station id that will be update.
   * @param allowPreviousButton The value that will be update.
   * @returns The status allowPreviousButton updated.
   */
  updateAllowPreviousButton(
    stationRithmId: string,
    allowPreviousButton: boolean
  ): Observable<boolean> {
    if (!stationRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot update the current status for this.',
            },
          })
      ).pipe(delay(1000));
    } else {
      const expectedResponse: StandardBooleanJSON = {
        data: allowPreviousButton,
      };
      return of(expectedResponse.data).pipe(delay(1000));
    }
  }

  /**
   * Update the flow button text.
   *
   * @param stationRithmId The station id that will be update.
   * @param flowButtonText Contains the text of flow button for updated.
   * @returns The status of update of flow button text.
   */
  updateFlowButtonText(
    stationRithmId: string,
    flowButtonText: string
  ): Observable<string> {
    if (!stationRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot update the flow button text.',
            },
          })
      ).pipe(delay(1000));
    } else {
      const expectedResponse: StandardStringJSON = {
        data: flowButtonText,
      };
      return of(expectedResponse.data).pipe(delay(1000));
    }
  }

  /**
   * Get the flow button text.
   *
   * @param stationRithmId The current station id.
   * @returns The flow button text.
   */
  getFlowButtonText(stationRithmId: string): Observable<string> {
    if (!stationRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot get the flow button text.',
            },
          })
      ).pipe(delay(1000));
    } else {
      const expectedResponse: StandardStringJSON = {
        data: 'Flow',
      };
      return of(expectedResponse.data).pipe(delay(1000));
    }
  }

  /**
   * Get the station groups widget.
   *
   * @param stationGroupRithmId The current station id.
   * @returns The station groups widget.
   */
  getStationGroups(stationGroupRithmId: string): Observable<StationGroupData> {
    const expectedResponse: StationGroupData = {
      rithmId: '6375027-78345-73824-54244',
      title: 'Station Group',
      subStationGroups: [
        {
          rithmId: '1375027-78345-73824-54244',
          title: 'Sub Station Group',
          subStationGroups: [],
          stations: [
            {
              rithmId: '123-321-456',
              name: 'station 1',
              totalDocuments: 3,
              workers: [
                {
                  rithmId: '123-321-456',
                  firstName: 'John',
                  lastName: 'Wayne',
                  email: 'name@company.com',
                  isWorker: true,
                  isOwner: true,
                },
              ],
              stationOwners: [
                {
                  rithmId: '789-798-456',
                  firstName: 'Peter',
                  lastName: 'Doe',
                  email: 'name1@company.com',
                  isWorker: true,
                  isOwner: true,
                },
              ],
            },
          ],
          users: [
            {
              rithmId: '789-798-456',
              firstName: 'Noah',
              lastName: 'Smith',
              email: 'name2@company.com',
              isWorker: true,
              isOwner: true,
            },
          ],
          admins: [
            {
              rithmId: '159-753-456',
              firstName: 'Taylor',
              lastName: 'Du',
              email: 'name3@company.com',
              isWorker: true,
              isOwner: true,
            },
          ],
          isChained: true,
          isImplicitRootStationGroup: true,
        },
      ],
      stations: [
        {
          rithmId: '123-321-456',
          name: 'station 1',
          totalDocuments: 3,
          workers: [
            {
              rithmId: '123-321-456',
              firstName: 'John',
              lastName: 'Wayne',
              email: 'name@company.com',
              isWorker: true,
              isOwner: true,
            },
          ],
          stationOwners: [
            {
              rithmId: '789-798-456',
              firstName: 'Peter',
              lastName: 'Doe',
              email: 'name1@company.com',
              isWorker: true,
              isOwner: true,
            },
          ],
        },
      ],
      users: [
        {
          rithmId: '789-798-456',
          firstName: 'Noah',
          lastName: 'Smith',
          email: 'name2@company.com',
          isWorker: true,
          isOwner: true,
        },
      ],
      admins: [
        {
          rithmId: '159-753-456',
          firstName: 'Taylor',
          lastName: 'Du',
          email: 'name3@company.com',
          isWorker: true,
          isOwner: true,
        },
      ],
      isChained: true,
      isImplicitRootStationGroup: true,
    };

    return of(expectedResponse).pipe(delay(1000));
  }

  /**
   * Save or update the field questions of widgets.
   *
   * @param stationRithmId The station id that will be update.
   * @param stationFrames The value that will be update.
   * @returns The field question updated.
   */
  saveStationWidgets(
    stationRithmId: string,
    stationFrames: StationFrameWidget[]
  ): Observable<StationFrameWidget> {
    if (!stationRithmId || !stationFrames) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot update station widgets',
            },
          })
      ).pipe(delay(1000));
    } else {
      const frameStationWidget: StationFrameWidget = {
        rithmId: '3813442c-82c6-4035-893a-86fa9deca7c3',
        stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        cols: 6,
        rows: 4,
        x: 0,
        y: 0,
        type: FrameType.Input,
        data: '',
        id: 0,
      };
      return of(frameStationWidget).pipe(delay(1000));
    }
  }

  /**
   * Get the station widgets.
   *
   * @param stationRithmId The current station id.
   * @returns The station widget data.
   */
  getStationWidgets(stationRithmId: string): Observable<StationFrameWidget[]> {
    if (!stationRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot response station widgets',
            },
          })
      ).pipe(delay(1000));
    } else {
      const stationWidgets: StationFrameWidget[] = [
        {
          rithmId: '3813442c-82c6-4035-893a-86fa9deca7c3',
          stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
          cols: 6,
          rows: 4,
          x: 0,
          y: 0,
          type: FrameType.Input,
          data: '',
          id: 0,
        },
        {
          rithmId: '3813442c-82c6-4035-903a-86f39deca2c1',
          stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
          cols: 6,
          rows: 4,
          x: 0,
          y: 0,
          type: FrameType.Input,
          data: '',
          id: 0,
        },
      ];
      return of(stationWidgets).pipe(delay(1000));
    }
  }

  /**
   * Remove owner from the group's roster.
   *
   * @param stationGroupRithmId The Specific id of group.
   * @param usersIds The selected owners id array to removed.
   * @returns New Group information with owners roster.
   */
  removeUsersFromOwnerRosterGroup(
    stationGroupRithmId: string,
    usersIds: string[]
  ): Observable<StationRosterMember[]> {
    const mockPrevDeleteOwnersRoster: StationRosterMember[] = [
      {
        rithmId: '12dasd1-asd12asdasd-asdas',
        firstName: 'Cesar',
        lastName: 'Quijada',
        email: 'strut@gmail.com',
        isOwner: true,
        isWorker: false,
      },
      {
        rithmId: '12dasd1-asd12asdasd-ffff1',
        firstName: 'Maria',
        lastName: 'Quintero',
        email: 'Maquin@gmail.com',
        isOwner: true,
        isWorker: true,
      },
      {
        rithmId: '12dasd1-asd12asdasd-a231',
        firstName: 'Pedro',
        lastName: 'Perez',
        email: 'pperez@gmail.com',
        isOwner: true,
        isWorker: false,
      },
    ];
    return of(mockPrevDeleteOwnersRoster).pipe(delay(1000));
  }

  /**
   * Removes users from the group's workers roster.
   *
   * @param stationGroupRithmId The Specific id of group.
   * @param usersIds The selected users id array to removed.
   * @returns New Group information with worker roster.
   */
  removeUsersFromWorkerRosterGroup(
    stationGroupRithmId: string,
    usersIds: string[]
  ): Observable<StationRosterMember[]> {
    const data: StationRosterMember[] = [
      {
        rithmId: '12dasd1-asd12asdasd-asdas',
        firstName: 'Cesar',
        lastName: 'Quijada',
        email: 'strut@gmail.com',
        isOwner: true,
        isWorker: true,
      },
      {
        rithmId: '12dasd1-asd12asdasd-ffff1',
        firstName: 'Maria',
        lastName: 'Quintero',
        email: 'Maquin@gmail.com',
        isOwner: true,
        isWorker: true,
      },
      {
        rithmId: '12dasd1-asd12asdasd-a231',
        firstName: 'Pedro',
        lastName: 'Perez',
        email: 'pperez@gmail.com',
        isOwner: true,
        isWorker: true,
      },
    ];
    return of(data).pipe(delay(1000));
  }

  /**
   * Get worker roster for a given station group.
   *
   * @param stationGroupRithmId The id of the given station group.
   * @returns A rosterMember array.
   */
  getStationGroupWorkerRoster(
    stationGroupRithmId: string
  ): Observable<StationRosterMember[]> {
    const mockGetStationGroupRoster: StationRosterMember[] = [
      {
        rithmId: '123-456-789',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
      {
        rithmId: '987-654-321',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
    ];
    return of(mockGetStationGroupRoster).pipe(delay(1000));
  }

  /**
   * Get owner roster for a given station group.
   *
   * @param stationGroupRithmId The id of the given station group.
   * @returns A rosterMember array.
   */
  getStationGroupOwnerRoster(
    stationGroupRithmId: string
  ): Observable<StationRosterMember[]> {
    const mockGetStationGroupAdmin: StationRosterMember[] = [
      {
        rithmId: '123-456-789',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
      {
        rithmId: '987-654-321',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isOwner: false,
        isWorker: true,
      },
    ];
    return of(mockGetStationGroupAdmin).pipe(delay(1000));
  }

  /**
   * Get history station.
   *
   * @param stationRithmId The current station id.
   * @returns The history station.
   */
  getStationHistory(stationRithmId: string): Observable<DocumentEvent[]> {
    if (!stationRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot response station history',
            },
          })
      ).pipe(delay(1000));
    } else {
      const historyResponse: DocumentEvent[] = [
        {
          eventTimeUTC: '2022-01-18T22:13:05.871Z',
          description: 'Event Document #1',
          user: {
            rithmId: '123',
            firstName: 'Testy',
            lastName: 'Test',
            email: 'test@test.com',
            isEmailVerified: true,
            notificationSettings: null,
            createdDate: '1/2/34',
            role: null,
            organization: 'kdjfkd-kjdkfjd-jkjdfkdjk',
          },
        },
      ];
      return of(historyResponse).pipe(delay(1000));
    }
  }

  /**
   * Get the number of container in a station.
   *
   * @param stationRithmId The current station id.
   * @returns The number of container.
   */
  getNumberOfContainers(stationRithmId: string): Observable<number> {
    if (!stationRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Cannot retrive the number of containers',
            },
          })
      ).pipe(delay(1000));
    } else {
      const expectedResponse: StandardNumberJSON = {
        data: 10,
      };
      return of(expectedResponse.data).pipe(delay(1000));
    }
  }

  /**
   * Get traffic data document in stations.
   *
   * @param stationGroupRithmId RithmId of groupStation to graph.
   * @returns The data to graph.
   */
  getGroupTrafficData(
    stationGroupRithmId: string
  ): Observable<GroupTrafficData> {
    const mockGetGroupTrafficData: GroupTrafficData = {
      title: 'Group Eagle',
      stationGroupRithmId: '9360D633-A1B9-4AC5-93E8-58316C1FDD9F',
      labels: ['station 1', 'station 2', 'station 3', 'station 4', 'station 5'],
      stationDocumentCounts: [10, 5, 8, 10, 20],
      averageDocumentFlow: [2, 4, 1, 8, 9],
    };
    return of(mockGetGroupTrafficData).pipe(delay(1000));
  }
}
