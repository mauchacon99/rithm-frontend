/* eslint-disable rxjs/no-ignored-error */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { DashboardService } from './dashboard.service';
import { DashboardStationData } from 'src/models';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    });
    service = TestBed.inject(DashboardService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should successfully fetch data for Dashboard stations', () => {
    const expectedResponse: Array<DashboardStationData> = [
      {
        numberOfDocuments: 5,
        stationName: 'station-1',
        numberOfWorkers: 3,
        workerInitials: [
          'AA', 'AB'
        ]
      },
      {
        numberOfDocuments: 2,
        stationName: 'station-2',
        numberOfWorkers: 6,
        workerInitials: [
          'XR', 'PD'
        ]
      }
    ];

    service.getDashboardStations()
      .subscribe((response) => {
        expect(response.length).toBeGreaterThanOrEqual(0);
      });

    // outgoing request
    const req = httpTestingController.expectOne(`${environment.baseApiUrl}/dashboardservice/api/Dashboard/Stations`);
    expect(req.request.method).toEqual('GET');

    req.flush(expectedResponse);
    httpTestingController.verify();
  });

});
