import { Component } from '@angular/core';

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

}
