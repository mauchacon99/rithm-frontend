import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { UserService } from 'src/app/core/user.service';
import { StationInformation } from 'src/models';

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
  editMode!: boolean;

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((context: any) => {
        if (context) {
          this.editMode = context.editMode;
          this.stationInformation = context.stationInformation;
          this.stationName = context.stationName;
          this.isWorker = context.isWorker;
        }
      });
    this.type = this.userService.user.role === 'admin' ? this.userService.user.role : 'worker';
  }

}
