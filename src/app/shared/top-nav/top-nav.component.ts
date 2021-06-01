import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

/**
 * Component for the top site navigation.
 */
@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent {
  @Input() mobileNav: any;

  /** List of navigation items. */
  navItems = ['Dashboard', 'Map'];

  /** Monogram for user profile icon. */
  monogram = 'AB';

  toggle(): void {
    this.mobileNav.toggle();
  }

}
