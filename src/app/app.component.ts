import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from './core/sidenav.service';

/**
 * The main component loaded for the app.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  /** Get the sidenav component. */
  @ViewChild('mobileNav') mobileSideNav!: MatSidenav;

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


  constructor(private sidenavService: SidenavService) {
    // Setup...
  }

  /**
   * Set the current sidenav in the service.
   */
  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.mobileSideNav);
  }

}
