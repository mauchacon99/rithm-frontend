import { Component } from '@angular/core';
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
export class StationInfoDrawerComponent {

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

}
