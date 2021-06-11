import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidenavService } from './core/sidenav.service';
import { UserService } from './core/user.service';

/**
 * The main component loaded for the app.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {

  /** Get the sidenav component. */
  @ViewChild('mobileNav')
  private mobileSideNav!: MatSidenav;

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
    private sidenavService: SidenavService,
    private userService: UserService,
    public router: Router
  ) { }

  /**
   * Set the current sidenav in the service.
   */
  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.mobileSideNav);
  }

  /**
   * Check the url path and show/hide the navigation.
   */
  ngOnInit(): void {
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
          path !== '/password-reset';
      }
    }, err => {
      console.error(err);
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

    this.mobileSideNav.toggle();
  }

}
