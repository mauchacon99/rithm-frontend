import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SidenavDrawerStatus } from 'src/models/enums/sidenav-drawer-status.enum';

/**
 * Service for all behavior and state for the sidenav and drawers.
 */
@Injectable({
  providedIn: 'root'
})
export class SidenavDrawerService {
  /** The state of the sidenav and drawers in the app. */
  sidenavDrawerStatus$ = new BehaviorSubject(SidenavDrawerStatus.closed);

  /**
   * Open the sidenav.
   *
   * @param sidenavDrawer The sidenav or drawer to open.
   */
  open(sidenavDrawer: SidenavDrawerStatus): void {
    if (sidenavDrawer === SidenavDrawerStatus.closed) {
      throw new Error(`'Closed' is not a valid option to open a sidenav or drawer. Please use the close() method isntead.`);
    }
    this.sidenavDrawerStatus$.next(sidenavDrawer);
  }


  /**
   * Close all drawers and the sidenav.
   */
  close(): void {
    this.sidenavDrawerStatus$.next(SidenavDrawerStatus.closed);
  }

  /**
   * Toggle open/close of sidenav.
   *
   * @param sidenavDrawer The side nav or drawer to toggle.
   */
  toggle(sidenavDrawer: SidenavDrawerStatus): void {
    const newStatus = this.sidenavDrawerStatus$.value === SidenavDrawerStatus.closed ? sidenavDrawer : SidenavDrawerStatus.closed;
    this.sidenavDrawerStatus$.next(newStatus);
  }
}
