import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidenavDrawerService } from './core/sidenav-drawer.service';
import { UserService } from './core/user.service';

const REGISTER_URL = 'type=register';
const RESET_PASSWORD_URL = 'password-reset';

/**
 * The main component loaded for the app.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  /** The sidenav displayed on mobile. */
  @ViewChild('sidenav', { static: true })
  sidenav!: MatSidenav;

  /** Destroyed. */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /** Used to show top nav. */
  showTopNav = false;

  /** Mobile links. */
  mobileLinks = [
    {
      name: 'dashboard',
      icon: 'fa-th-large',
      link: 'dashboard'
    },
    {
      name: 'map',
      icon: 'fa-project-diagram',
      link: 'map'
    },
    {
      name: 'My Account',
      icon: 'fa-cog',
      link: 'settings/account'
    },
    {
      name: 'Sign Out',
      icon: 'fa-sign-out-alt'
    }
  ];

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private userService: UserService,
    private router: Router
  ) { }

  /**
   * Check the url path and show/hide the navigation.
   */
  ngOnInit(): void {

    if (this.userService.user.role !== null) {
      this.mobileLinks.splice(2, 0, {
        name: 'admin',
        icon: 'fa-user-cog',
        link: 'admin'
      });
    }

    this.sidenavDrawerService.setSidenav(this.sidenav);
    this.router.events.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const path = e.url;
        this.showTopNav =
          path !== '' &&
          path !== '/' &&
          path !== '/forgot-password' &&
          path !== '/account-create' &&
          path !== '/password-reset' &&
          (path?.toLowerCase().indexOf(REGISTER_URL) === -1) &&
          (path?.toLowerCase().indexOf(RESET_PASSWORD_URL) === -1);
      }
    }, (error: unknown) => {
      console.error(error);
    });
  }

  /**
   * Cleanup method.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /**
   * Toggles the side nav and determines if the user wants to sign out.
   *
   * @param item The tapped side nav item.
   */
  selectNavItem(item: string): void {
    if (item === 'Sign Out') {
      this.userService.signOut();
    }
    this.sidenavDrawerService.closeSidenav();
  }

}
