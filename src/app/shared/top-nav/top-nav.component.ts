import { Component, HostListener } from '@angular/core';
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
  /** List of navigation items. */
  navItems = ['Dashboard', 'Map'];

  /** Monogram for user profile icon. */
  monogram = 'AB';

  /** Init the browser width. */
  innerWidth = 0;

  constructor(private sidenavService: SidenavService) {
    // Setup...
  }

  /**
   * Toggle opening and closing of the mobile navigation.
   */
  toggle(): void {
    this.sidenavService.toggle();
  }

  /**
   * Check if screen size changes to hide mobile nav.
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.innerWidth = window.innerWidth;

    if(this.innerWidth >= 768) {
      this.sidenavService.close();
    }
  }

}
