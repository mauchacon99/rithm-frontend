import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { SplitService } from 'src/app/core/split.service';
import { UserService } from 'src/app/core/user.service';

/**
 * Component for the main admin landing page.
 */
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  /** Show Admin portal. */
  showAdminPortal = false;

  constructor(
    private splitService: SplitService,
    private errorService: ErrorService,
    private userService: UserService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.split();
  }

  /**
   * Split Service for show or hidden section Admin Portal.
   */
  private split(): void {
    this.splitService.initSdk(this.userService.user.organization);
    this.splitService.sdkReady$.pipe(first()).subscribe({
      next: () => {
        this.showAdminPortal =
          this.splitService.getAdminPortalTreatment() === 'on';
      },
      error: (error: unknown) => {
        this.errorService.logError(error);
      },
    });
  }
}
