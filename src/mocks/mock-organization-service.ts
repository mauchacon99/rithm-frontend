import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { OrganizationInfo, OrganizationUsers } from 'src/models';

/**
 * Mocks methods of the `OrganizationService`.
 */
export class MockOrganizationService {
  /**
   * Gets a List of users belongs to an organization.
   *
   * @param organizationId The id of the organization.
   * @param pageNum The desired page number of result.
   * @returns An Users list observable.
   */
  getUsersForOrganization(
    organizationId: string,
    pageNum: number
  ): Observable<OrganizationUsers> {
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
      const orgUsers: OrganizationUsers = {
        totalOrgUsers: 20,
        currentPageNum: pageNum,
        userPerPage: 10,
        users: [
          {
            rithmId: '123',
            firstName: 'Worker',
            lastName: 'User',
            email: 'workeruser@inpivota.com',
            isEmailVerified: true,
            notificationSettings: null,
            createdDate: '1/2/20',
            role: null,
            organization: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
          },
          {
            rithmId: '1234',
            firstName: 'Rithm',
            lastName: 'User',
            email: 'rithmuser@inpivota.com',
            isEmailVerified: true,
            notificationSettings: null,
            createdDate: '7/4/21',
            role: null,
            organization: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
          },
          {
            rithmId: '7812',
            firstName: 'Rithm',
            lastName: 'Admin',
            email: 'rithmadmin@inpivota.com',
            isEmailVerified: true,
            notificationSettings: null,
            createdDate: '5/9/21',
            role: 'admin',
            organization: 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989',
          },
        ],
      };
      return of(orgUsers).pipe(delay(1000));
    }
  }

  /**
   * Removes a user from the roster of an organization.
   *
   * @param organizationRithmId The Rithm Id of the organization.
   * @param userRithmId The Rithm Id of the user being removed.
   * @returns An empty observable.
   */
  removeUserFromOrganization(
    organizationRithmId: string,
    userRithmId: string
  ): Observable<unknown> {
    if (!organizationRithmId || !userRithmId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Some error message',
            },
          })
      ).pipe(delay(1000));
    } else {
      return of().pipe(delay(1000));
    }
  }

  /**
   * Gets information about organization.
   *
   * @param organizationId The id of the organization.
   * @returns An organization observable.
   */
  getOrganizationInfo(organizationId: string): Observable<OrganizationInfo> {
    if (!organizationId) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Some error message',
            },
          })
      ).pipe(delay(1000));
    } else {
      const orgInfo: OrganizationInfo = {
        name: 'Strut',
        mainContactPhoneNumber: '555-123-4567',
        mainContactEmail: 'Fudge@Ministry.Magic',
        timeZone: 'MW',
      };
      return of(orgInfo).pipe(delay(1000));
    }
  }

  /**
   * Updates the role of users.
   *
   * @param role The new user role - 'admin'|null.
   * @param organizationRithmId The organization id for which user belongs to.
   * @param userRithmId The user's id.
   * @returns An empty observable.
   */
  updateUserRole(
    role: 'admin' | null,
    organizationRithmId: string,
    userRithmId: string
  ): Observable<unknown> {
    if (!organizationRithmId || !userRithmId || !role) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Some error message',
            },
          })
      ).pipe(delay(1000));
    } else {
      return of().pipe(delay(1000));
    }
  }

  /**
   * Updates the organization information.
   *
   * @param organizationInfo The OrganizationInfo.
   * @param organizationId The id of the Organization.
   * @returns An organization information observable.
   */
  updateOrganizationInfo(
    organizationInfo: OrganizationInfo,
    organizationId: string
  ): Observable<OrganizationInfo> {
    if (!organizationId || !organizationInfo) {
      return throwError(
        () =>
          new HttpErrorResponse({
            error: {
              error: 'Some error message',
            },
          })
      ).pipe(delay(1000));
    } else {
      const orgInfo: OrganizationInfo = {
        name: 'Strut',
        mainContactPhoneNumber: '555-123-4567',
        mainContactEmail: 'Fudge@Ministry.Magic',
        timeZone: 'MW',
      };
      return of(orgInfo).pipe(delay(1000));
    }
  }
}
