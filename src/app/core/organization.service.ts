import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrganizationUsers, OrganizationInfo } from 'src/models';
import { environment } from 'src/environments/environment';

const MICROSERVICE_PATH = '/userservice/api/organization';

/**
 * Service for all document behavior and business logic.
 */
@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  constructor(
    private http: HttpClient) { }

  /**
   * Gets a List of users belongs to an organization.
   *
   * @param organizationId The id of the organization.
   * @param pageNum The desired page number of result.
   * @returns An Users list observable.
   */
  getUsersForOrganization(organizationId: string, pageNum: number): Observable<OrganizationUsers> {
    const params = new HttpParams()
      .set('rithmid', organizationId)
      .set('pageNum', pageNum)
      .set('usersPerPage', 15);
    return this.http.get<OrganizationUsers>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/getusersforOrganization`, { params });
  }

  /**
   * Removes a user from the roster of an organization.
   *
   * @param organizationRithmId The Rithm Id of the organization.
   * @param userRithmId The Rithm Id of the user being removed.
   * @returns An empty observable.
   */
  removeUserFromOrganization(organizationRithmId: string, userRithmId: string): Observable<unknown> {
    return this.http.delete<void>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/RemoveUsersFromOrganizations`, {
      body: [
        {
          organizationRithmId,
          userRithmId
        }
      ]
    });
  }

  /**
   * Gets information about organization.
   *
   * @param organizationId The id of the organization.
   * @returns An organization observable.
   */
  getOrganizationInfo(organizationId: string): Observable<OrganizationInfo> {
    const params = new HttpParams()
      .set('orgRithmId', organizationId);
    return this.http.get<OrganizationInfo>(`${environment.baseApiUrl}${MICROSERVICE_PATH}/organization-info`, { params });
  }

}
