/* eslint-disable max-len */
/* eslint-disable rxjs/no-ignored-error */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { OrganizationUsers } from 'src/models';
import { OrganizationService } from './organization.service';

const MICROSERVICE_PATH = '/userservice/api/organization';

describe('OrganizationService', () => {
  let service: OrganizationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(OrganizationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return list of users for an organization', () => {
    const organizationId = 'kdjfkd-kjdkfjd-jkjdfkdjk';
    const pageNum = 1;

    const expectedResponse: OrganizationUsers = {
      totalOrgUsers: 20,
      currentPageNum: pageNum,
      userPerPage: 15,
      users: [{
        rithmId: '123',
        firstName: 'Worker',
        lastName: 'User',
        email: 'workeruser@inpivota.com',
        isEmailVerified: true,
        notificationSettings: null,
        createdDate: '1/2/20',
        role: null,
        organizations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989']
      }, {
        rithmId: '1234',
        firstName: 'Rithm',
        lastName: 'User',
        email: 'rithmuser@inpivota.com',
        isEmailVerified: true,
        notificationSettings: null,
        createdDate: '7/4/21',
        role: null,
        organizations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989']
      }, {
        rithmId: '7812',
        firstName: 'Rithm',
        lastName: 'Admin',
        email: 'rithmadmin@inpivota.com',
        isEmailVerified: true,
        notificationSettings: null,
        createdDate: '5/9/21',
        role: 'admin',
        organizations: ['CCAEBE24-AF01-48AB-A7BB-279CC25B0989', 'POBNJV24-AF01-48AB-A7BB-279CC25B9725']
      }]
    };

    service.getUsersForOrganization(organizationId, pageNum)
      .subscribe((users) => {
        expect(users).toBeDefined();
      });

    // eslint-disable-next-line max-len
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/getusersforOrganization?rithmid=${organizationId}&pageNum=${pageNum}&usersPerPage=${expectedResponse.userPerPage}`);
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

  it('should promote user with admin role', () => {
    const role = 'admin';
    const organizationRithmId = 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989';
    const userRithmId = 'POBNJV24-AF01-48AB-A7BB-279CC25B9725';

    service.updateUserRole(role, organizationRithmId, userRithmId)
      .subscribe((response) => {
        expect(response).toBeFalsy();
      });

    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/user-organization-role`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual({ role, organizationRithmId, userRithmId });

    req.flush(null);
    httpTestingController.verify();
  });

  it('should demote user by removing admin role', () => {
    const role = null;
    const organizationRithmId = 'CCAEBE24-AF01-48AB-A7BB-279CC25B0989';
    const userRithmId = 'POBNJV24-AF01-48AB-A7BB-279CC25B9725';

    service.updateUserRole(role, organizationRithmId, userRithmId)
      .subscribe((response) => {
        expect(response).toBeFalsy();
      });

    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/user-organization-role`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual({ role, organizationRithmId, userRithmId });

    req.flush(null);
    httpTestingController.verify();
  });

});
