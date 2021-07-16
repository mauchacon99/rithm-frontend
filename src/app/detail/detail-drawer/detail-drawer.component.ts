import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';

/**
 * Component for all content inside the drawer for detail (station/document) pages.
 */
@Component({
  selector: 'app-detail-drawer',
  templateUrl: './detail-drawer.component.html',
  styleUrls: ['./detail-drawer.component.scss']
})
export class DetailDrawerComponent implements OnDestroy {

  private destroyed$ = new Subject();

  /**
   * The type of detail item to display in the drawer.
   */
  itemType = '';

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private errorService: ErrorService
  ) {
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((context) => {
        this.itemType = context;
      }, (error) => {
        this.errorService.logError(error);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
