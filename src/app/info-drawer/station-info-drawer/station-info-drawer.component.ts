import { Component, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { UserService } from 'src/app/core/user.service';
import { StationInfoDrawerData, StationInformation } from 'src/models';

/**
 * Component for info station.
 */
@Component({
  selector: 'app-station-info-drawer',
  templateUrl: './station-info-drawer.component.html',
  styleUrls: ['./station-info-drawer.component.scss']
})
export class StationInfoDrawerComponent implements OnDestroy {

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject();

  /** Type of user looking at a document. */
  type: 'admin' | 'super' | 'worker';

  /** Is component viewed in station edit mode. */
  editMode = false;

  /** Station information object passed from parent. */
  stationInformation!: StationInformation;

  /** Edit Mode. */
  stationName = '';

  /** Worker. */
  isWorker = true;

  /** Is component viewed in station edit mode? */
  @Input() stationEditMode!: boolean;

  constructor(private sidenavDrawerService: SidenavDrawerService,
    private userService: UserService) {
    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as StationInfoDrawerData;
        if (dataDrawer) {
          this.editMode = dataDrawer.editMode;
          this.stationInformation = dataDrawer.stationInformation as StationInformation;
          this.stationName = dataDrawer.stationName;
          this.isWorker = dataDrawer.isWorker;
        }
      });
    this.type = this.userService.user.role === 'admin' ? this.userService.user.role : 'worker';
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Toggles the open state of the drawer for station info.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'stationInfo'): void {
    this.sidenavDrawerService.toggleDrawer(drawerItem);
  }
}
