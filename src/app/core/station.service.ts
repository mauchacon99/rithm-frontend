import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// const MICROSERVICE_PATH = '/stationapi/api/station';

/**
 * Service for all station behavior and business logic.
 */
@Injectable({
  providedIn: 'root'
})
export class StationService {

  /**
   * Gets a list of worker roster of a station.
   *
   * @param stationId The id of the station for which to get the roster.
   * @returns A list of worker roster of a station.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getWorkerRoster(stationId: string): Observable<unknown[]> { // TODO: update type once response object is determined
    const data = [
      {
        firstName: 'Maggie',
        lastName: 'Rhee',
        email: 'maggie.rhee@email.com',
        initials: 'MR'
      },
      {
        firstName: 'Tyreese',
        lastName: 'Williams',
        email: 'tyreese.williams@email.com',
        initials: 'TW'
      },
      {
        firstName: 'Lizzie',
        lastName: 'Samuels',
        email: 'lizzie.samuels@email.com',
        initials: 'LS'
      },
      {
        firstName: 'Theodore',
        lastName: 'Douglas',
        email: 'theodore.douglas@email.com',
        initials: 'TD'
      },
      {
        firstName: 'Maggie',
        lastName: 'Rhee',
        email: 'maggie.rhee@email.com',
        initials: 'MR'
      }
    ];
    return of(data).pipe(delay(1000));
  }
}
