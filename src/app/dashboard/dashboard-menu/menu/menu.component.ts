import { Component } from '@angular/core';
import { RoleDashboardMenu } from 'src/models/enums/role-dashboard-menu.enum';
/**
 * Main menu component for dashboard menu drawer.
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  /** Type role. */
  dashboardRole = RoleDashboardMenu;
}
