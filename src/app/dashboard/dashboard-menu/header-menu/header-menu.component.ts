import { Component } from '@angular/core';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';

/**
 * Header for dashboard menu drawer.
 */
@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent {
  constructor(private sidenavDrawerService: SidenavDrawerService) {}

  /**
   * Opens side nav on the dashboard.
   *
   * @param drawerItem The information that will be displayed in the side drawer.
   */
  toggleMenu(drawerItem: 'menuDashboard'): void {
    this.sidenavDrawerService.toggleDrawer(drawerItem);
  }
}
