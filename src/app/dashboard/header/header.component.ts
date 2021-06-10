import { Component, OnInit } from '@angular/core';
import { User } from 'src/models';
import { DashboardService } from '../../dashboard/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DashboardHeaderResponse } from 'src/models';

/**
 * Component for the dashboard overview header.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  /** A temp user. */
  user: User;

  /** Number of previously started docs. */
  numPrev = 0;

  /** Number of stations user is a member of. */
  numStations = 0;

  constructor(private dashboardService: DashboardService) {
    this.user = {
      rithmId: '1',
      firstName: 'Steve',
      lastName: 'Rogers',
      email: 'steve@rogers.com',
      objectPermissions: [],
      groups: [],
      createdDate: ''
    };
  }

  ngOnInit() {
    /**
    * Get dashboard header display data
   */
    this.dashboardService.getDashboardHeader()
      .subscribe((res: DashboardHeaderResponse) => {
        if (res) {
          this.numPrev = res.startedDocuments;
          this.numStations = res.rosterStations;
        }
      }, (error: HttpErrorResponse) => { });
  }

}
