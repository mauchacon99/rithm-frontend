import { Component, OnInit } from '@angular/core';
import { User } from 'src/models';
import { DashboardService } from '../../dashboard/dashboard.service';
import { DashboardHeaderResponse } from 'src/models';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';

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

  /** Is any content loading.*/
  isLoading = true;

  constructor(private dashboardService: DashboardService,
    private errorService: ErrorService,
    private userService: UserService) {
    this.user = {
      rithmId: '',
      firstName: '',
      lastName: '',
      email: '',
      objectPermissions: [],
      groups: [],
      createdDate: ''
    };
  }

  /**
   * Checks for query params and makes necessary request if present.
   */
  ngOnInit(): void {

    /**
     * Get dashboard header display for number previous documents and stations.
     */
    this.dashboardService.getDashboardHeader()
      .pipe(first())
      .subscribe((res: DashboardHeaderResponse) => {
        if (res) {
          this.numPrev = res.startedDocuments;
          this.numStations = res.rosterStations;
          this.isLoading = false;
        }
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error,
          true
        );
      });

    /**
     * Get user first and last name to display in dashboard.
     */
    this.user = <User>this.userService.user;

  }

}
