import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
/**
 * Mocks methods of the `StationService`.
 */
export class MockStationService {

  /**
   * Gets a list of worker roaster of a station.
   *
   * @returns A list of worker roaster of a station.
   */
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   getWorkerRoasterByStationId(): Observable<any> {
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
