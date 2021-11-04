import { Injectable } from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { ReplaySubject, Subject } from 'rxjs';

/**
 * Service for all behavior and state for the sidenav and drawers.
 */
@Injectable({
  providedIn: 'root'
})
export class SidenavDrawerService {
  /** The sidenav component for the mobile navigation. */
  private sidenavComponent!: MatSidenav;

  /** The drawer component for the page. */
  private drawerComponent?: MatDrawer;

  /** The name of the context for which the drawer is opened. */
  drawerContext$: Subject<'comments' | 'history' | 'stationInfo' | 'documentInfo' | 'connectionInfo'> = new ReplaySubject(1);

  /** Optional data that is available to the drawer. */
  drawerData$: ReplaySubject<unknown> = new ReplaySubject(1);

  /** Whether to show the backdrop for an opened drawer. */
  private _drawerHasBackdrop!: boolean;

  /**
   * Whether to show the backdrop for an opened drawer (readonly).
   *
   * @returns Whether to show the backdrop.
   */
  get drawerHasBackdrop(): boolean {
    return this._drawerHasBackdrop;
  }

  constructor() {
    this.determineBackdropDisplay();

    // TODO: Do this without using window
    window.addEventListener('resize', () => {
      // TODO: Define this magic number
      this.determineBackdropDisplay();
    });
  }

  /**
   * Determines whether to show the drawer backdrop based on the current window width.
   */
  private determineBackdropDisplay() {
    this._drawerHasBackdrop = window.innerWidth <= 991;
  }

  /**
   * Sets the instance of the sidenav component for further action.
   *
   * @param component The component used for the sidenav.
   */
  setSidenav(component: MatSidenav): void {
    this.sidenavComponent = component;
  }

  /**
   * Opens the sidenav for mobile navigation.
   */
  openSidenav(): void {
    if (this.drawerComponent) {
      this.drawerComponent.close();
    }
    this.sidenavComponent.open();
  }

  /**
   * Closes the sidenav for mobile navigation.
   */
  closeSidenav(): void {
    this.sidenavComponent.close();
  }

  /**
   * Toggles the open state of the sidenav for mobile navigation.
   */
  toggleSidenav(): void {
    !this.sidenavComponent.opened ? this.openSidenav() : this.closeSidenav();
  }

  /**
   * Sets the instance of the drawer component fo rfurther action.
   *
   * @param component The component used for the drawer.
   */
  setDrawer(component: MatDrawer): void {
    this.drawerComponent = component;
  }

  /**
   * Opens the app side drawer component.
   *
   * @param context The name of the context for which the drawer is opened.
   * @param data Any data to optionally pass to the drawer.
   */
  openDrawer(context: 'comments' | 'history' | 'stationInfo' | 'documentInfo' | 'connectionInfo', data?: unknown): void {
    if (!this.drawerComponent) {
      throw new Error('The drawer component is not defined. Did you forget to set it?');
    }
    this.drawerContext$.next(context);
    this.drawerData$.next(data);
    this.sidenavComponent.close();
    this.drawerComponent.open();
  }

  /**
   * Closes the app side drawer component.
   */
  closeDrawer(): void {
    if (!this.drawerComponent) {
      throw new Error('The drawer component is not defined. Did you forget to set it?');
    }
    this.drawerComponent.close();
  }

  /**
   * Toggles the open state of the drawer component.
   *
   * @param context The name of the context for which the drawer is opened.
   * @param data Any data to optionally pass to the drawer.
   */
  toggleDrawer(context: 'comments' | 'history' | 'stationInfo' | 'documentInfo' | 'connectionInfo', data?: unknown): void {
    if (!this.drawerComponent) {
      throw new Error('The drawer component is not defined. Did you forget to set it?');
    }
    !this.drawerComponent.opened ? this.openDrawer(context, data) : this.closeDrawer();
  }
}
