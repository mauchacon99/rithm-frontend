import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Station, User } from 'src/models';

/**
 * Service for all business logic involving the dashboard.
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  /**
   * Gets a list of stations where the signed-in user is on the work roster.
   *
   * @returns A list of stations.
   */
  getWorkerStations(): Observable<Station[]> {
    const mockUser: User = {
      rithmId: '1234',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      objectPermissions: [],
      groups: [],
      createdDate: new Date().toISOString()
    };

    const mockStations: Station[] = [
      {
        name: 'Station 1',
        instructions: 'Some instructions',
        documents: 5,
        supervisors: [
          mockUser
        ],
        rosterUsers: [
          mockUser
        ]
      }
    ];
    return of(mockStations);
  }
}
