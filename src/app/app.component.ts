import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/models';
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
  private destroyed$ = new Subject<void>();

  /** Used to show top nav. */
  showTopNav = false;

  /** User data to hide/show admin menu. */
  private user$: ReplaySubject<unknown> = new ReplaySubject(1);

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
   * Check the URL path and show/hide the navigation.
   */
  ngOnInit(): void {
    this.userService.setUserData();
    this.userService.userData$
      .pipe(takeUntil(this.user$))
      .subscribe((user) => {
        const info = user as User;
        if (info && info.role) {
          const found = this.mobileLinks.findIndex(link => link.name === 'admin');
          if (found === -1) {
            this.mobileLinks.splice(2, 0, {
              name: 'admin',
              icon: 'fa-user-cog',
              link: 'admin'
            });
          }
        } else {
          this.mobileLinks = this.mobileLinks.filter(e => e.name !== 'admin');
        }
      });

    this.sidenavDrawerService.setSidenav(this.sidenav);
    this.router.events.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((routerEvent) => {
      if (routerEvent instanceof NavigationEnd) {
        const path = routerEvent.url;
        this.showTopNav =
          path !== '' &&
          path !== '/' &&
          path !== '/forgot-password' &&
          path !== '/account-create' &&
          path !== '/password-reset' &&
          (path?.toLowerCase().indexOf(REGISTER_URL) === -1) &&
          (path?.toLowerCase().indexOf(RESET_PASSWORD_URL) === -1);
      }
    });

    //Sets height using a css variable. this allows us to avoid using vh. Mobile friendly.
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--appvh', `${vh}px`);
  }

  /**
   * Cleanup method.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
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

  /**
   * Needed to resize a mobile browser when a the scrollbar hides.
   */
  @HostListener('window:resize', ['$event'])
  windowResize(): void {
    //Sets height using a css variable. this allows us to avoid using vh. Mobile friendly.
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--appvh', `${vh}px`);
  }
}
