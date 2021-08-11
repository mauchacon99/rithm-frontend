import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { StationInformation } from 'src/models';

// const MICROSERVICE_PATH = '/stationapi/api/station';

/**
 * Service for all station behavior and business logic.
 */
@Injectable({
  providedIn: 'root'
})
export class StationService {

  /**
   * Gets station information.
   *
   * @param stationId The Specific id of station.
   * @returns Information related to station.
   */
   getStationInfo(stationId: string): Observable<StationInformation> {
    const data: StationInformation = {
      rithmId: 'E204F369-386F-4E41',
      name: 'Dry Goods & Liquids',
      instructions: 'General instructions',
      dueDate: '2021-08-22T17:26:47.3506612Z',
      nextStations: [{
        stationName: 'Development',
        totalDocuments: 5,
        isGenerator: true
      }],
      previousStations: [{
        stationName: 'Station-1',
        totalDocuments: 2,
        isGenerator: true
      }],
      supervisors: [{
        userRithmId: '',
        firstName: 'Marry',
        lastName: 'Poppins',
        email: 'marrypoppins@inpivota.com'
      }],
      workers: [{
        userRithmId: '',
        firstName: 'Harry',
        lastName: 'Potter',
        email: 'harrypotter@inpivota.com'
      }],
      createdByRithmId: 'ED6148C9-PBK8-408E-A210-9242B2735B1C',
      createdDate: '2021-07-16T17:26:47.3506612Z',
      updatedByRithmId: 'AO970Z9-PBK8-408E-A210-9242B2735B1C',
      updatedDate: '2021-07-18T17:26:47.3506612Z',
      questions: []
    };
    return of(data).pipe(delay(1000));
  }

}
