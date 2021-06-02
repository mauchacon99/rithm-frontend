import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from 'src/app/core/sidenav.service';

/**
 * Component for the top site navigation.
 */
@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent {
  /** The sidenav for mobile. */
  // @Input() mobileNav!: MatSidenav;

  // private sideNav: MatSidenav;

  /** List of navigation items. */
  navItems = ['Dashboard', 'Map'];

  /** Monogram for user profile icon. */
  monogram = 'AB';

  constructor(private sidenavService: SidenavService) {
    // Setup...
  }

  /**
   * Toggle opening and closing of the mobile navigation.
   */
  toggle(): void {
    this.sidenavService.toggle();
  }

}
