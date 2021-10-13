import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { delay } from 'rxjs/operators';
import { Station, StationInformation } from 'src/models';
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Mocks methods of the `StationService`.
 */
export class MockStationService {

  /**
   * Gets a station information.
   *
   * @param stationId The Specific id of station.
   * @returns Information related to station.
   */
  getStationInfo(stationId: string): Observable<StationInformation> {
    const data: StationInformation = {
      stationRithmId: 'E204F369-386F-4E41',
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
      supervisors: [{
        userRithmId: '',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com'
      }, {
        userRithmId: '',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com'
      }],
      workers: [{
        userRithmId: '',
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@inpivota.com'
      }, {
        userRithmId: '',
        firstName: 'Supervisor',
        lastName: 'User',
        email: 'supervisoruser@inpivota.com'
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
   * Update station name.
   *
   * @returns The list of all stations.
   * @param stationId The target station id.
   * @param newName The new name for the station.
   */
  updateStationName(stationId: string, newName: string): Observable<StationInformation> {
    if (!stationId || !newName) {
      return throwError(new HttpErrorResponse({
        error: {
          error: 'Some error message'
        }
      })).pipe(delay(1000));
    } else {
      const data: StationInformation = {
        stationRithmId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
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
        supervisors: [{
          userRithmId: '',
          firstName: 'Marry',
          lastName: 'Poppins',
          email: 'marrypoppins@inpivota.com'
        }, {
          userRithmId: '',
          firstName: 'Worker',
          lastName: 'User',
          email: 'workeruser@inpivota.com'
        }],
        workers: [{
          userRithmId: '',
          firstName: 'Harry',
          lastName: 'Potter',
          email: 'harrypotter@inpivota.com'
        }, {
          userRithmId: '',
          firstName: 'Supervisor',
          lastName: 'User',
          email: 'supervisoruser@inpivota.com'
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
}
