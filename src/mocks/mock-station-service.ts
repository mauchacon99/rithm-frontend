import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
/**
 * Mocks methods of the `StationService`.
 */
export class MockStationService {

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
      }
    ];
    return of(data).pipe(delay(1000));
  }
}
