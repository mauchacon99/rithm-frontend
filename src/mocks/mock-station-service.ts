/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Question, QuestionFieldType, Station, StationInformation, DocumentGenerationStatus, StationRosterMember, StationPotentialRostersUsers
} from 'src/models';

/**
 * Mocks methods of the `StationService`.
 */
export class MockStationService {

  /** The Name of the Station as BehaviorSubject. */
  stationName$ = new BehaviorSubject<string>('');

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
      nextStations: [{
        stationName: 'Development',
        totalDocuments: 5,
        isGenerator: true
      }],
      previousStations: [{
        stationName: 'Station-1',
        totalDocuments: 2,
        isGenerator: true
      }, {
        stationName: 'Station-2',
        totalDocuments: 0,
        isGenerator: false
      }],
      stationOwners: [{
        rithmId: '',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com',
        isWorker: false,
        isOwner: true
      }, {
        rithmId: '',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isWorker: false,
        isOwner: true
      }],
      workers: [{
        rithmId: '',
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@inpivota.com',
        isWorker: false,
        isOwner: false
      }, {
        rithmId: '',
        firstName: 'Supervisor',
        lastName: 'User',
        email: 'supervisoruser@inpivota.com',
        isWorker: true,
        isOwner: false
      }],
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: [],
      priority: 2
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
        instructions: 'Do as I instruct'
      }
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
      return throwError(new HttpErrorResponse({
        error: {
          error: 'Cannot update station without defining a station.'
        }
      })).pipe(delay(1000));
    } else {
      const data: StationInformation = {
        rithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
        name: 'New Station Name',
        instructions: '',
        nextStations: [{
          stationName: 'Development',
          totalDocuments: 5,
          isGenerator: true
        }],
        previousStations: [{
          stationName: 'Station-1',
          totalDocuments: 2,
          isGenerator: true
        }, {
          stationName: 'Station-2',
          totalDocuments: 0,
          isGenerator: false
        }],
        stationOwners: [{
          rithmId: '',
          firstName: 'Marry',
          lastName: 'Poppins',
          email: 'marrypoppins@inpivota.com',
          isWorker: false,
          isOwner: true
        }, {
          rithmId: '',
          firstName: 'Worker',
          lastName: 'User',
          email: 'workeruser@inpivota.com',
          isWorker: false,
          isOwner: true
        }],
        workers: [{
          rithmId: '',
          firstName: 'Harry',
          lastName: 'Potter',
          email: 'harrypotter@inpivota.com',
          isWorker: false,
          isOwner: false
        }, {
          rithmId: '',
          firstName: 'Supervisor',
          lastName: 'User',
          email: 'supervisoruser@inpivota.com',
          isWorker: true,
          isOwner: false
        }],
        createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
        createdDate: '2021-07-16T17:26:47.3506612Z',
        updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
        updatedDate: '2021-07-18T17:26:47.3506612Z',
        questions: [],
        priority: 2
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
  getStationDocumentGenerationStatus(stationId: string): Observable<DocumentGenerationStatus> {
    const mockStatusDocument = DocumentGenerationStatus.None;
    return of(mockStatusDocument).pipe(delay(1000));
  }

  /**
   * Update station document generation status.
   *
   * @param stationId The id of the station return status document.
   * @param statusNew The new status set in station document.
   * @returns Status new the document.
   */
  updateStationDocumentGenerationStatus(stationId: string, statusNew: DocumentGenerationStatus): Observable<DocumentGenerationStatus> {
    return of(statusNew).pipe(delay(1000));
  }

  /**
   * Get all station previous private/all questions.
   *
   * @param stationId The Specific id of station.
   * @param isPrivate True returns private questions - False returns all questions.
   * @returns Station private/all items Array.
   */
  getStationPreviousQuestions(stationId: string, isPrivate: boolean): Observable<Question[]> {
    const mockPrevQuestions: Question[] = [
      {
        prompt: 'Fake question 1',
        instructions: 'Fake question 1',
        rithmId: '3j4k-3h2j-hj4j',
        questionType: QuestionFieldType.Number,
        isReadOnly: false,
        isRequired: true,
        isPrivate: false,
        children: [],
      },
      {
        prompt: 'Fake question 2',
        instructions: 'Fake question 2',
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
   * Adds users to the worker roster.
   *
   * @param stationId The Specific id of station.
   * @param userIds The users ids for assign in station.
   * @returns Rosters in the station.
   */
  addUsersToWorkerRoster(stationId: string, userIds: string[]): Observable<StationRosterMember[]> {
    const mockPrevAddRosterStation: StationRosterMember[] = [{
      rithmId: '',
      firstName: 'Marry',
      lastName: 'Poppins',
      email: 'marrypoppins@inpivota.com',
      isOwner: false,
      isWorker: true
    }, {
      rithmId: '',
      firstName: 'Worker',
      lastName: 'User',
      email: 'workeruser@inpivota.com',
      isOwner: false,
      isWorker: true
    }];
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
  getPotentialStationRosterMembers(organizationId: string, stationRithmId: string, pageNum: number): Observable<StationPotentialRostersUsers> {
    if (!organizationId || !pageNum) {
      return throwError(new HttpErrorResponse({
        error: {
          error: 'Some error message'
        }
      })).pipe(delay(1000));
    } else {
      const orgUsers: StationPotentialRostersUsers = {
        users: [{
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
        }],
        totalUsers: 3
      };
      return of(orgUsers).pipe(delay(1000));
    }
  }

  /** Deletes a specified station.
   *
   * @param stationId The Specific id of station.
   * @returns Returns an empty observable.
   */
  deleteStation(stationId: string): Observable<unknown> {
    if (!stationId) {
      return throwError(new HttpErrorResponse({
        error: {
          error: 'Cannot delete the station without defining a station.'
        }
      })).pipe(delay(1000));
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
  removeUsersFromWorkerRoster(stationId: string, usersIds: string[]): Observable<StationRosterMember[]> {
    const data: StationRosterMember[] = [{
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
    }];
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
  getStationOwnerRoster(stationId: string): Observable<StationRosterMember[]>{
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
   addUsersToOwnersRoster(stationId: string, userIds: string[]): Observable<StationRosterMember[]> {
    const mockOwnerRoster: StationRosterMember[] = [{
      rithmId: 'C5C1480C-461E-4267-BBB1-BB79E489F991',
      firstName: 'Marry',
      lastName: 'Poppins',
      email: 'marrypoppins@inpivota.com',
      isOwner: true,
      isWorker: false
    }, {
      rithmId: 'C5C1480C-461E-4267-BBB1-BB79E489F992',
      firstName: 'Worker',
      lastName: 'User',
      email: 'workeruser@inpivota.com',
      isOwner: true,
      isWorker: false
    }];
    return of(mockOwnerRoster).pipe(delay(1000));
  }

  /**
   * Remove owner from the station's roster.
   *
   * @param stationId The Specific id of station.
   * @param usersIds The selected owners id array to removed.
   * @returns New Station information with owners roster.
   */
  removeUsersFromOwnerRoster(stationId: string, usersIds: string[]): Observable<StationRosterMember[]> {
    const mockPrevDeleteOwnersRoster: StationRosterMember[] = [{
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
    }];
    return of(mockPrevDeleteOwnersRoster).pipe(delay(1000));
  }

  /**
   * Update status document is editable or not.
   *
   * @param stationRithmId The Specific id of station.
   * @param newStatus The new status is editable in the change for document.
   * @returns New status for document editable.
   */
  updateStatusDocumentEditable(stationRithmId: string, newStatus: boolean): Observable<boolean> {
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
}
