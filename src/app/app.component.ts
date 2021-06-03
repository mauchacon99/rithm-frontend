import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { SidenavService } from './core/sidenav.service';

/**
 * The main component loaded for the app.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit{
  /** Get the sidenav component. */
  @ViewChild('mobileNav') mobileSideNav!: MatSidenav;

  /** Is signed in. */
  isSignedIn = false;

  /** Mobile links. */
  mobileLinks = [
    {
      name: 'Dashboard',
      icon: 'fa-th-large'
    },
    {
      name: 'Map',
      icon: 'fa-project-diagram'
    },
    {
      name: 'Settings',
      icon: 'fa-cog'
    },
    {
      name: 'Sign Out',
      icon: 'fa-sign-out-alt'
    }
  ];


  constructor(
    private sidenavService: SidenavService,
    public router: Router
    ) {

  }

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
    /* eslint-disable-next-line */
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const path = e.url;
        if(
            path == '' ||
            path == '/' ||
            path == '/forgot-password' ||
            path == '/account-create' ||
            path == '/password-reset'
            ) {
            this.isSignedIn = false;
          } else {
            this.isSignedIn = true;
          }
      }
    }, err => {
      console.log(err);
    });
  }

}
