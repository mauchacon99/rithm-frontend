/* eslint-disable rxjs/no-ignored-error */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DashboardService } from './dashboard.service';
import { DashboardHeaderResponse } from 'src/models';
import { environment } from 'src/environments/environment';

const MICROSERVICE_PATH = '/dashboardservice/api/dashboard';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(DashboardService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should successfully get dashboard header data', () => {
    const expectedResponse: DashboardHeaderResponse = {
      userRithmId: '1234',
      id: 1,
      startedDocuments: 5,
      rosterStations: 4
    };

    service.getDashboardHeader()
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    // outgoing request
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}${MICROSERVICE_PATH}/header`);
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });
});
