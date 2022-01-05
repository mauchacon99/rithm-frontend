import { Component, OnInit } from '@angular/core';
import { User } from 'src/models';
import { DashboardService } from '../../dashboard/dashboard.service';
import { WorkerDashboardHeader } from 'src/models';
import { first } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';

/**
 * Component for the dashboard overview header.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  /** The user that is currently signed in. */
  user: User | undefined;

  /** The number of previously started documents. */
  numPrevDocs = 0;

  /** The number of stations that the user is a member of. */
  numStations = 0;

  /** Whether the header data is loading. */
  isLoading = true;

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService,
    private userService: UserService
  ) {
    this.user = this.userService.user;
  }

  /**
   * Get dashboard header display for number previous documents and stations.
   */
  ngOnInit(): void {
    this.dashboardService
      .getDashboardHeader()
      .pipe(first())
      .subscribe({
        next: (headerData: WorkerDashboardHeader) => {
          if (headerData) {
            this.numPrevDocs = headerData.startedDocuments;
            this.numStations = headerData.rosterStations;
            this.isLoading = false;
          }
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }
}
