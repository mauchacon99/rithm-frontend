import { Injectable } from '@angular/core';
import { MatDrawerToggleResult, MatSidenav } from '@angular/material/sidenav';
/** Sidenav Service. */
@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  /** Init sidenav. */
  private sidenav!: MatSidenav;

  constructor() {
    // Setup...
  }

  /**
   * Set the current sidenav.
   *
   * @param sidenav Current sidenav.
   */
  public setSidenav(sidenav: MatSidenav): void {
    this.sidenav = sidenav;
  }

  /**
   * Open the sidenav.
   *
   * @returns Opens the sidenav.
   */
  public open(): Promise<MatDrawerToggleResult> {
    return this.sidenav.open();
  }


  /**
   * Close the sidenav.
   *
   * @returns Closes the sidenav.
   */
  public close(): Promise<MatDrawerToggleResult> {
    return this.sidenav.close();
  }

  /**
   * Toggle open/close of sidenav.
   */
  public toggle(): void {
    this.sidenav.toggle();
  }
}
